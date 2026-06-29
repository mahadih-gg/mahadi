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
};
