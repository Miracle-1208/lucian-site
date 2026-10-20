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
  footnote?: string;
  resourceHref?: string;
  resourceLabel?: string;
  keywords: string[];
  transitionName: string;
};

export const sectionMeta: Record<
  LibrarySection,
  { label: string; emptyText: string }
> = {
  projects: {
    label: "Projects",
    emptyText: "这一章还是空白，等待一个值得被做出来的念头。",
  },
  courses: {
    label: "Courses",
    emptyText: "课程资料正在整理中。",
  },
  writings: {
    label: "Writings",
    emptyText: "下一篇文字还在路上。",
  },
  music: {
    label: "Music",
    emptyText: "这一页暂时留给沉默。",
  },
};

export const libraryEntries: LibraryEntry[] = [
  {
    id: "notebricks",
    href: "/projects/notebricks/",
    section: "projects",
    sectionLabel: "Projects",
    tag: "Co-founder",
    title: "积木笔记",
    description: "把数学课堂视频整理成可编辑讲义的工具。",
    footnote: "notebrick.cn",
    resourceHref: "https://notebrick.cn/",
    resourceLabel: "访问 notebrick.cn",
    keywords: [
      "积木笔记",
      "NoteBricks",
      "NoteBrick",
      "课堂视频",
      "讲义",
      "Typst",
      "AI",
      "教育科技",
      "创始人",
    ],
    transitionName: "folio-notebricks",
  },
  {
    id: "plib",
    href: "/projects/plib/",
    section: "projects",
    sectionLabel: "Projects",
    tag: "Co-founder",
    title: "Plib",
    description: "由北大学生自主开发的学习资源共享网站。",
    footnote: "e.pkuhub.cn · i.pkuhub.cn",
    resourceHref: "https://e.pkuhub.cn/",
    resourceLabel: "访问 Plib",
    keywords: [
      "Plib",
      "pkuhub",
      "学习资源",
      "资料共享",
      "往年题",
      "笔记",
      "北大",
      "校园社区",
      "创始人",
    ],
    transitionName: "folio-plib",
  },
  {
    id: "ode-solutions",
    href: "/courses/ode-solutions/",
    section: "courses",
    sectionLabel: "Courses",
    tag: "ODE",
    title: "常微分方程",
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
    id: "abstract-algebra",
    href: "/courses/abstract-algebra/",
    section: "courses",
    sectionLabel: "Courses",
    tag: "Algebra",
    title: "抽象代数",
    description:
      "冯荣权《代数学三》书后题答案合集，是北大抽代课教材答案",
    fileName: "抽象代数习题答案.pdf",
    resourceHref: "/files/courses/抽象代数习题答案.pdf",
    resourceLabel: "打开 PDF",
    keywords: ["抽象代数", "代数学三", "冯荣权", "Algebra", "习题", "答案", "群论", "Sylow", "Jordan-Hölder", "课程资料"],
    transitionName: "folio-abstract-algebra",
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
