export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ExperienceBullet {
  id: string;
  text: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: ExperienceBullet[];
  technologies: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ProjectBullet {
  id: string;
  text: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  bullets: ProjectBullet[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType = 'experience' | 'skills' | 'education' | 'projects' | 'custom';

export interface CVSection {
  id: string;
  type: SectionType;
  customId?: string;
  visible: boolean;
}

export type FontFamily = 'inter' | 'georgia' | 'roboto';

export interface CVTheme {
  accentColor: string;
  fontFamily: FontFamily;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  skillCategories: SkillCategory[];
  educations: Education[];
  projects: Project[];
  customSections: CustomSection[];
  sectionOrder: CVSection[];
  theme: CVTheme;
}
