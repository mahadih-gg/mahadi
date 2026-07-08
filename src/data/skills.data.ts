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
      { name: "Motion", icon: "motion" },
      { name: "Three.js", icon: "threejs" },
      { name: "GSAP", icon: "gsap" },
      { name: "Zustand" },
      { name: "Shadcn UI", icon: "shadcn" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Ant Design", icon: "antdesign" },
      { name: "Sass", icon: "sass" },
      { name: "Axios", icon: "axios" },
      { name: "TanStack Query", icon: "reactQuery" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
  {
    title: "Tools & Platforms",
    blurb: "What keeps the work organized, reviewed, and shipped.",
    skills: [
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
