export type SkillEntry = {
  name: string;
  /** Key into skillIconMap (src/components/skills/skillIcons.tsx). Omit for
   * skills without a recognizable brand mark — they fall back to a monogram. */
  icon?: string;
};

export type SkillCategory = {
  title: string;
  blurb: string;
  skills: SkillEntry[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    blurb: "The foundations everything else is built on.",
    skills: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    blurb: "Where most of the day-to-day building happens.",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "React Native", icon: "reactNative" },
    ],
  },
  {
    title: "Animation",
    blurb: "Motion, depth, and scroll-driven interfaces that feel alive.",
    skills: [
      { name: "Motion", icon: "motion" },
      { name: "GSAP", icon: "gsap" },
      { name: "Three.js", icon: "threejs" },
      { name: "Anime.js", icon: "animejs" },
    ],
  },
  {
    title: "State Management",
    blurb: "Keeping client and UI state predictable as apps grow.",
    skills: [
      { name: "Zustand" },
      { name: "Redux", icon: "redux" },
    ],
  },
  {
    title: "Styling",
    blurb: "Layout, tokens, and component polish from utility CSS to design systems.",
    skills: [
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Sass", icon: "sass" },
      { name: "Shadcn UI", icon: "shadcn" },
      { name: "Ant Design", icon: "antdesign" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Material UI", icon: "mui" },
    ],
  },
  {
    title: "Data & API",
    blurb: "Fetching, caching, and typing data from the backend.",
    skills: [
      { name: "Axios", icon: "axios" },
      { name: "TanStack Query", icon: "reactQuery" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
  {
    title: "Automation",
    blurb: "Workflows, agents, and runtimes that handle repetitive work.",
    skills: [
      { name: "OpenClaw", icon: "openclaw" },
      { name: "Hermes", icon: "hermes" },
      { name: "N8N", icon: "n8n" },
    ],
  },
  {
    title: "Tools & Platforms",
    blurb: "What keeps the work organized, reviewed, and shipped.",
    skills: [
      { name: "Cursor", icon: "cursor" },
      { name: "Claude Code", icon: "claude" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "GitLab", icon: "gitlab" },
      { name: "Figma", icon: "figma" },
      { name: "Docker", icon: "docker" },
      { name: "Mongo Compass", icon: "mongodb" },
      { name: "ClickUp", icon: "clickup" },
      { name: "Trello", icon: "trello" },
      { name: "Jira", icon: "jira" },
    ],
  },
];
