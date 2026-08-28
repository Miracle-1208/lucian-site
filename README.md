# Lucian's World

Lucian 的个人主页，以 Astro 构建。站点保留原有浅蓝紫色调、衬线字体、头像与个人文案，并加入章节式内容浏览、全站搜索、条目评论和首页留言板。

## 本地运行

```sh
npm install
npm run dev
```

生产构建：

```sh
npm run build
```

## 添加新条目

所有可搜索条目都集中在 `src/data/library.ts`。新增项目、课程、文章或音乐时：

1. 在 `libraryEntries` 中添加一条记录；标题、简介、标签、文件名和 `keywords` 会自动进入搜索索引。
2. 在 `src/pages` 对应目录中添加详情页，并用 `getLibraryEntry()` 把记录传给 `DetailLayout`。
3. 把附件放进 `public/files` 的对应目录。

首页会按章节自动收纳条目；条目增多后会变为横向翻页，不会继续纵向堆叠。

## 评论与留言板

评论使用 Vercel Function 与 Postgres 数据库，不依赖 GitHub 登录：

- 昵称可留空；留空时显示为“匿名”。
- 每个详情页使用独立的评论主题。
- 首页留言板位于页面最下方。
- 服务端限制留言长度与短时间内的发布频率，并使用隐藏字段拦截基础机器人提交。

首次上线前，在 Vercel 项目中连接一个 Neon Postgres 数据库，让项目获得 `DATABASE_URL` 环境变量；API 会自动创建所需数据表。建议另外设置一个随机的 `COMMENTS_SALT` 环境变量，然后重新部署。

前端组件位于 `src/components/CommentThread.astro`，服务端接口位于 `api/comments.ts`。
