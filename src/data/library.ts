export type LibrarySection = "projects" | "courses" | "writings" | "music";

export type LibraryEntry = {
  id: string;
  href: string;
  section: LibrarySection;
  sectionLabel: string;
  tag: string;
  title: string;
  description: string;
  fileName?: string;
  resourceHref?: string;
  resourceLabel?: string;
  keywords: string[];
  transitionName: string;
};

export const sectionMeta: Record<
  LibrarySection,
  { label: string; caption: string; emptyText: string }
> = {
  projects: {
    label: "Projects",
    caption: "实践、研究与尚在生长的想法",
    emptyText: "这一章还是空白，等待一个值得被做出来的念头。",
  },
  courses: {
    label: "Courses",
    caption: "推导、题解与学习过程中留下的路标",
    emptyText: "课程资料正在整理中。",
  },
  writings: {
    label: "Writings",
    caption: "文字是经验被重新看见的方式",
    emptyText: "下一篇文字还在路上。",
  },
  music: {
    label: "Music",
    caption: "旋律、片段与偶然被记住的声音",
    emptyText: "这一页暂时留给沉默。",
  },
};

export const libraryEntries: LibraryEntry[] = [
  {
    id: "ode-solutions",
    href: "/courses/ode-solutions/",
    section: "courses",
    sectionLabel: "Courses",
    tag: "ODE",
    title: "常微分方程习题答案",
    description:
      "柳彬《常微分方程》书后题答案合集，也收录了部分课程拓展题，用于复习、查漏补缺与对照推导。",
    fileName: "ode-solutions.pdf",
    resourceHref: "/files/courses/ode-solutions.pdf",
    resourceLabel: "打开 PDF",
    keywords: ["常微分方程", "ODE", "柳彬", "刘保平", "习题", "答案", "课程资料"],
    transitionName: "folio-ode-solutions",
  },
  {
    id: "probability",
    href: "/courses/probability/",
    section: "courses",
    sectionLabel: "Courses",
    tag: "Probability",
    title: "概率论",
    description: "概率论期末题与答案，便于复习、查漏补缺和考前回顾。",
    fileName: "概率论期末题与答案.pdf",
    resourceHref: "/files/courses/概率论期末题与答案.pdf",
    resourceLabel: "打开 PDF",
    keywords: ["概率论", "Probability", "期末题", "答案", "复习", "课程资料"],
    transitionName: "folio-probability",
  },
  {
    id: "huanjing",
    href: "/writings/huanjing/",
    section: "writings",
    sectionLabel: "Writings",
    tag: "Essay",
    title: "幻镜",
    description:
      "心理学导论第一次课程作业，课程优秀论文。一篇以大一转专业经历为背景的日记对话体小说。",
    fileName: "幻镜.pdf",
    resourceHref: "/files/writings/幻镜.pdf",
    resourceLabel: "打开 PDF",
    keywords: ["幻镜", "心理学导论", "转专业", "日记", "对话体", "小说", "课程论文"],
    transitionName: "folio-huanjing",
  },
  {
    id: "guangying-hesheng",
    href: "/writings/guangying-hesheng/",
    section: "writings",
    sectionLabel: "Writings",
    tag: "Essay",
    title: "光影何生",
    description:
      "心理学导论第二次课程作业，课程优秀论文。一篇关于心理学、自我、经验与成长的文章。",
    fileName: "光影何生.pdf",
    resourceHref: "/files/writings/光影何生.pdf",
    resourceLabel: "打开 PDF",
    keywords: ["光影何生", "心理学导论", "自我", "经验", "成长", "通识联播", "课程论文"],
    transitionName: "folio-guangying-hesheng",
  },
];

export const getLibraryEntry = (id: string) => {
  const entry = libraryEntries.find((item) => item.id === id);

  if (!entry) {
    throw new Error(`Unknown library entry: ${id}`);
  }

  return entry;
};

export const getEntriesBySection = (section: LibrarySection) =>
  libraryEntries.filter((entry) => entry.section === section);

export const searchIndex = libraryEntries.map((entry) => ({
  id: entry.id,
  href: entry.href,
  section: entry.sectionLabel,
  tag: entry.tag,
  title: entry.title,
  description: entry.description,
  fileName: entry.fileName ?? "",
  searchable: [
    entry.title,
    entry.description,
    entry.fileName,
    entry.sectionLabel,
    entry.tag,
    ...entry.keywords,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("zh-CN"),
}));
