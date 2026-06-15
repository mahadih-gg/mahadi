export type GalleryPlaneLabel = {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
  /** Phrases to emphasize inside responsibility copy */
  highlightTerms: string[];
  color: string;
};

export type GalleryPlaneData = {
  fallbackColor: string;
  accentColor: string;
  textureSrc: string;
  position: { x: number; y?: number };
  backgroundColor: string;
  blob1Color: string;
  blob2Color: string;
  label: GalleryPlaneLabel;
};

export const galleryPlaneData: GalleryPlaneData[] = [
  {
    fallbackColor: "#002253",
    accentColor: "#ffffff",
    textureSrc: "/experience-gallery/horizon-logo.webp",
    position: { x: -0.9, y: 0 },
    backgroundColor: "#002253",
    blob1Color: "#002253",
    blob2Color: "#ffffff",
    label: {
      company: "Flagship",
      role: "Lead Front-end Engineer",
      period: "Jun 2025 – Present",
      responsibilities: [
        "Designed and developed a universal embed system and React-based Web SDK for plug-and-play Shorts video integration across external platforms.",
        "Built a full-featured Console platform enabling video uploads, analytics, and end-to-end Shorts content management for creators and internal teams.",
      ],
      highlightTerms: [
        "React",
        "Web SDK",
        "Shorts",
        "embed",
        "Console",
        "analytics",
      ],
      color: "#ffffff",
    },
  },
  {
    fallbackColor: "#02205f",
    accentColor: "#ffffff",
    textureSrc: "/experience-gallery/learnyxai_logo.webp",
    position: { x: 0, y: 0 },
    backgroundColor: "#02205f",
    blob1Color: "#02205f",
    blob2Color: "#ffffff",
    label: {
      company: "Learnyx AI",
      role: "Front-end Developer",
      period: "Jun 2024 – Apr 2025",
      responsibilities: [
        "Designed and built the full frontend of an AI-powered educational platform for kids using React, React Router, TailwindCSS, ShadCN, and TanStack Query — Gamestories.ai.",
        "Developed a cross-platform educational sports game (web, Android, iOS) using React Native — Litzone.app — combining fantasy sports with reading and math challenges.",
      ],
      highlightTerms: [
        "React",
        "React Native",
        "TanStack Query",
        "ShadCN",
        "TailwindCSS",
        "Gamestories.ai",
        "Litzone.app",
        "AI-powered",
      ],
      color: "#ffffff",
    },
  },
  {
    fallbackColor: "#8a171c",
    accentColor: "#ffffff",
    textureSrc: "/experience-gallery/redlime-logo.webp",
    position: { x: 0, y: 0 },
    backgroundColor: "#8a171c",
    blob1Color: "#8a171c",
    blob2Color: "#ffffff",
    label: {
      company: "Redlime Solutions",
      role: "Front-end Developer",
      period: "Aug 2022 – May 2024",
      responsibilities: [
        "Developed a user-friendly dashboard for medicine delivery and prescription management, integrating client, medicine, and user features with optimized performance.",
        "Implemented user authentication and role management using Next.js, Tailwind CSS, and Ant Design, enhancing portal security and responsive usability.",
      ],
      highlightTerms: [
        "dashboard",
        "Next.js",
        "Tailwind CSS",
        "Ant Design",
        "authentication",
        "role management",
      ],
      color: "#ffffff",
    },
  },
  {
    fallbackColor: "#bf1720",
    accentColor: "#ffffff",
    textureSrc: "/experience-gallery/TechnoVista.webp",
    position: { x: 0, y: 0 },
    backgroundColor: "#016435",
    blob1Color: "#bf1720",
    blob2Color: "#016435",
    label: {
      company: "TechnoVista Limited",
      role: "Front-end Developer",
      period: "Mar 2021 – Jul 2022",
      responsibilities: [
        "Developed a ticket management system with React.js, Bootstrap, and Ant Design — role-based access, schedule programs, real-time seat management, and CRUD operations.",
        "Contributed to scalable micro-service architecture for government projects; collaborated on requirements, delivered quality solutions, and conducted thorough testing.",
      ],
      highlightTerms: [
        "React.js",
        "Ant Design",
        "real-time",
        "seat management",
        "micro-service",
        "government",
      ],
      color: "#ffffff",
    },
  },
];

/** Screen-reader / fallback copy — mirrors gallery planes */
export const experienceRoles = galleryPlaneData.map((plane) => ({
  company: plane.label.company,
  title: plane.label.role,
  period: plane.label.period,
  highlights: plane.label.responsibilities,
}));
