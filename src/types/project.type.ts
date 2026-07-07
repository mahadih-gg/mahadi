export type ProjectFeature = {
  title: string;
  description: string;
};

export type ProjectSection = {
  title: string;
  paragraphs: string[];
  features?: ProjectFeature[];
  showcase?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  titleLines: string[];
  tags: string[];
  description: string;
  color: string;
  accent: string;
  heroDescription: string;
  visitUrl: string;
  heroImage: string;
  showcaseImages: string[];
  sections: ProjectSection[];
  /** Category label for the gallery panel; defaults to `tags[0]` when omitted. */
  category?: string;
  /** Tech badges shown in the gallery's focused detail panel. */
  techStack?: string[];
  /** Public repo URL; omit to hide the GitHub button in the gallery. */
  githubUrl?: string;
};
