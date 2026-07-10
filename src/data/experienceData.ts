export type ExperienceEntry = {
  company: string;
  role: string;
  duration: string;
  /** One bullet per line on the card */
  description: string[];
  /** Technology badges */
  tech: string[];
  logo: string;
  /** Brand color behind the logo tile */
  logoBackground: string;
};

export const experienceData: ExperienceEntry[] = [
  {
    company: "Horizon",
    role: "Lead Front-end Engineer",
    duration: "Jun 2025 – Present",
    description: [
      "Designed and developed a universal embed system and React-based Web SDK for plug-and-play Shorts video integration across external platforms.",
      "Built a full-featured Console platform enabling video uploads, analytics, and end-to-end Shorts content management for creators and internal teams.",
    ],
    tech: ["React", "Web SDK", "Video Embeds", "Analytics"],
    logo: "/experience-gallery/horizon-logo.webp",
    logoBackground: "#002253",
  },
  {
    company: "Learnyx AI",
    role: "Front-end Developer",
    duration: "Jun 2024 – Apr 2025",
    description: [
      "Designed and built the full frontend of an AI-powered educational platform for kids using React, React Router, TailwindCSS, ShadCN, and TanStack Query — Gamestories.ai.",
      "Developed a cross-platform educational sports game (web, Android, iOS) using React Native — Litzone.app — combining fantasy sports with reading and math challenges.",
    ],
    tech: ["React", "React Native", "TailwindCSS", "ShadCN", "TanStack Query"],
    logo: "/experience-gallery/learnyxai_logo.webp",
    logoBackground: "#02205f",
  },
  {
    company: "Redlime Solutions",
    role: "Front-end Developer",
    duration: "Aug 2022 – May 2024",
    description: [
      "Developed a user-friendly dashboard for medicine delivery and prescription management, integrating client, medicine, and user features with optimized performance.",
      "Implemented user authentication and role management using Next.js, Tailwind CSS, and Ant Design, enhancing portal security and responsive usability.",
    ],
    tech: ["Next.js", "Tailwind CSS", "Ant Design"],
    logo: "/experience-gallery/redlime-logo.webp",
    logoBackground: "#8a171c",
  },
  {
    company: "TechnoVista Limited",
    role: "Front-end Developer",
    duration: "Mar 2021 – Jul 2022",
    description: [
      "Developed a ticket management system with React.js, Bootstrap, and Ant Design — role-based access, schedule programs, real-time seat management, and CRUD operations.",
      "Contributed to scalable micro-service architecture for government projects; collaborated on requirements, delivered quality solutions, and conducted thorough testing.",
    ],
    tech: ["React.js", "Bootstrap", "Ant Design", "Microservices"],
    logo: "/experience-gallery/TechnoVista.webp",
    logoBackground: "#ddc4a4",
  },
];
