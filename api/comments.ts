import { neon } from "@neondatabase/serverless";

type CommentRow = {
  id: string;
  nickname: string | null;
  content: string;
  created_at: string;
};

let tableReady: Promise<unknown> | undefined;

const json = (payload: unknown, status = 200) =>
  Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const normalizePage = (value: unknown) => {
  const page = String(value ?? "").trim();
  return page.length > 0 && page.length <= 160 ? page : null;
};

const normalizeNickname = (value: unknown) =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 40) || null;

const normalizeContent = (value: unknown) =>
  String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

const fingerprintRequest = async (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const secret = process.env.COMMENTS_SALT || process.env.DATABASE_URL || "lucian-comments";
  const bytes = new TextEncoder().encode(`${address}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const serialize = (row: CommentRow) => ({
  id: String(row.id),
  nickname: row.nickname,
  content: row.content,
  createdAt: row.created_at,
});

export default {
  async fetch(request: Request) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return json({ error: "留言服务尚未连接数据库。" }, 503);
    }

    const url = new URL(request.url);
    const sql = neon(connectionString);

    tableReady ??= (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS lucian_comments (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          page VARCHAR(160) NOT NULL,
          nickname VARCHAR(40),
          content VARCHAR(1000) NOT NULL,
          fingerprint CHAR(64) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS lucian_comments_page_created_idx
        ON lucian_comments (page, created_at)
      `;
    })();

    try {
      await tableReady;

      if (request.method === "GET") {
        const page = normalizePage(url.searchParams.get("page"));
        if (!page) return json({ error: "缺少页面标识。" }, 400);

        const rows = await sql`
          SELECT id::text, nickname, content, created_at
          FROM (
            SELECT id, nickname, content, created_at
            FROM lucian_comments
            WHERE page = ${page}
            ORDER BY created_at DESC
            LIMIT 100
          ) recent
          ORDER BY created_at ASC
        ` as CommentRow[];

        return json({ comments: rows.map(serialize) });
      }

      if (request.method === "POST") {
        const origin = request.headers.get("origin");
        if (origin && origin !== url.origin) {
          return json({ error: "无法从其他站点发布留言。" }, 403);
        }

        const body = await request.json().catch(() => null) as Record<string, unknown> | null;
        if (!body) return json({ error: "留言格式不正确。" }, 400);
        if (String(body.website ?? "").trim()) {
          return json({ comment: null }, 201);
        }

        const page = normalizePage(body.page);
        const nickname = normalizeNickname(body.nickname);
        const content = normalizeContent(body.content);

        if (!page) return json({ error: "缺少页面标识。" }, 400);
        if (!content) return json({ error: "先写一点内容。" }, 400);
        if (content.length > 1000) return json({ error: "留言请控制在 1000 字以内。" }, 400);

        const fingerprint = await fingerprintRequest(request);
        const recent = await sql`
          SELECT COUNT(*)::int AS count
          FROM lucian_comments
          WHERE fingerprint = ${fingerprint}
            AND created_at > NOW() - INTERVAL '1 minute'
        ` as Array<{ count: number }>;

        if ((recent[0]?.count ?? 0) >= 3) {
          return json({ error: "发得有点快，请稍后再试。" }, 429);
        }

        const rows = await sql`
          INSERT INTO lucian_comments (page, nickname, content, fingerprint)
          VALUES (${page}, ${nickname}, ${content}, ${fingerprint})
          RETURNING id::text, nickname, content, created_at
        ` as CommentRow[];

        return json({ comment: serialize(rows[0]) }, 201);
      }

      return json({ error: "不支持这个请求。" }, 405);
    } catch (error) {
      console.error("comments api error", error);
      tableReady = undefined;
      return json({ error: "留言服务暂时不可用。" }, 500);
    }
  },
};
