import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, Experience, SkillCategory, Education, Project, CustomSection, CVSection, CVTheme, PersonalInfo } from '../types/cv';

const sampleData: CVData = {
  personalInfo: {
    fullName: 'Jean Dupont',
    title: 'Tech Lead & Développeur Web Full-Stack',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/jeandupont',
    github: 'github.com/jeandupont',
    website: '',
  },
  summary:
    'Tech Lead passionné avec 8+ ans d\'expérience dans la conception et le développement d\'applications web à forte charge. Expert en architecture microservices, TypeScript et Go. Habitué à piloter des équipes de 5-10 développeurs tout en restant hands-on sur le code. Forte culture de la qualité logicielle : tests, code review, documentation.',
  experiences: [
    {
      id: 'exp-1',
      company: 'Contentsquare',
      role: 'Tech Lead',
      startDate: '03/2021',
      endDate: 'Présent',
      location: 'Paris, France',
      bullets: [
        { id: 'b1', text: 'Dirigé une équipe de 8 développeurs pour la refonte de la plateforme analytics (2M+ utilisateurs actifs)' },
        { id: 'b2', text: 'Conçu et déployé une architecture microservices réduisant la latence API de 40% et les coûts infra de 25%' },
        { id: 'b3', text: 'Introduit des pratiques DDD et TDD, augmentant la couverture de tests de 35% à 87%' },
        { id: 'b4', text: 'Animé des sessions de pair-programming et code review pour monter en compétence l\'équipe junior' },
      ],
      technologies: ['TypeScript', 'React', 'Node.js', 'Go', 'Kubernetes', 'GCP', 'PostgreSQL'],
    },
    {
      id: 'exp-2',
      company: 'Alan',
      role: 'Développeur Full-Stack Senior',
      startDate: '06/2018',
      endDate: '02/2021',
      location: 'Paris, France',
      bullets: [
        { id: 'b5', text: 'Développé le portail assuré en React utilisé par 300K+ clients avec un NPS de 72' },
        { id: 'b6', text: 'Migré une application monolithique Django vers une architecture hexagonale, réduisant la complexité cyclomatique de 60%' },
        { id: 'b7', text: 'Implémenté le pipeline CI/CD (GitLab CI + Docker + AWS ECS) réduisant le délai de déploiement de 3h à 12min' },
      ],
      technologies: ['React', 'Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
    },
    {
      id: 'exp-3',
      company: 'Société Générale',
      role: 'Développeur Full-Stack',
      startDate: '09/2016',
      endDate: '05/2018',
      location: 'Paris La Défense, France',
      bullets: [
        { id: 'b8', text: 'Conçu et développé un dashboard de reporting financier en Angular consommé par 500 traders' },
        { id: 'b9', text: 'Optimisé les requêtes SQL critiques réduisant le temps de génération des rapports de 45 secondes à 3 secondes' },
      ],
      technologies: ['Angular', 'Java Spring Boot', 'Oracle SQL', 'Jenkins'],
    },
  ],
  skillCategories: [
    { id: 'sk-1', name: 'Langages', skills: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'HTML/CSS'] },
    { id: 'sk-2', name: 'Frameworks & Libs', skills: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'Django'] },
    { id: 'sk-3', name: 'DevOps & Cloud', skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'GitHub Actions', 'GitLab CI'] },
    { id: 'sk-4', name: 'Architecture', skills: ['Microservices', 'DDD', 'Event Sourcing', 'REST', 'GraphQL', 'CQRS'] },
    { id: 'sk-5', name: 'Bases de données', skills: ['PostgreSQL', 'Redis', 'MongoDB', 'Elasticsearch'] },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'INSA Lyon',
      degree: 'Diplôme d\'ingénieur',
      field: 'Génie Informatique',
      startDate: '2013',
      endDate: '2018',
      details: 'Spécialisation en systèmes distribués et développement logiciel',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenPR',
      description: 'CLI open source pour générer automatiquement des descriptions de PR pertinentes via LLM',
      url: 'github.com/jeandupont/openpr',
      technologies: ['Go', 'OpenAI API', 'GitHub API'],
      bullets: [
        { id: 'pb1', text: '500+ étoiles GitHub, utilisé par des équipes de 20+ entreprises' },
        { id: 'pb2', text: 'Réduction de 70% du temps passé à rédiger des descriptions de PR' },
      ],
    },
    {
      id: 'proj-2',
      name: 'react-perf-monitor',
      description: 'Bibliothèque de monitoring des performances React en temps réel',
      url: 'github.com/jeandupont/react-perf-monitor',
      technologies: ['TypeScript', 'React', 'Performance API'],
      bullets: [
        { id: 'pb3', text: '10K+ téléchargements/semaine sur NPM' },
      ],
    },
  ],
  customSections: [],
  sectionOrder: [
    { id: 'sec-experience', type: 'experience', visible: true },
    { id: 'sec-skills', type: 'skills', visible: true },
    { id: 'sec-education', type: 'education', visible: true },
    { id: 'sec-projects', type: 'projects', visible: true },
  ],
  theme: {
    accentColor: '#2563eb',
    fontFamily: 'inter',
  },
};

interface CVStore {
  data: CVData;
  setPersonalInfo: (info: PersonalInfo) => void;
  setSummary: (summary: string) => void;
  setTheme: (theme: CVTheme) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  removeExperience: (id: string) => void;
  addSkillCategory: (cat: SkillCategory) => void;
  updateSkillCategory: (id: string, cat: SkillCategory) => void;
  removeSkillCategory: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  removeEducation: (id: string) => void;
  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Project) => void;
  removeProject: (id: string) => void;
  addCustomSection: (sec: CustomSection) => void;
  updateCustomSection: (id: string, sec: CustomSection) => void;
  removeCustomSection: (id: string) => void;
  setSectionOrder: (order: CVSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
  resetData: () => void;
  importData: (data: CVData) => void;
}

const dedupeSectionOrder = (order: CVSection[]): CVSection[] => {
  const seenTypes = new Set<string>();
  return order.filter((sec) => {
    if (sec.type === 'custom') return true;
    if (seenTypes.has(sec.type)) return false;
    seenTypes.add(sec.type);
    return true;
  });
};

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      data: sampleData,

      setPersonalInfo: (info) =>
        set((s) => ({ data: { ...s.data, personalInfo: info } })),

      setSummary: (summary) =>
        set((s) => ({ data: { ...s.data, summary } })),

      setTheme: (theme) =>
        set((s) => ({ data: { ...s.data, theme } })),

      addExperience: (exp) =>
        set((s) => ({ data: { ...s.data, experiences: [...s.data.experiences, exp] } })),

      updateExperience: (id, exp) =>
        set((s) => ({
          data: { ...s.data, experiences: s.data.experiences.map((e) => (e.id === id ? exp : e)) },
        })),

      removeExperience: (id) =>
        set((s) => ({ data: { ...s.data, experiences: s.data.experiences.filter((e) => e.id !== id) } })),

      addSkillCategory: (cat) =>
        set((s) => ({ data: { ...s.data, skillCategories: [...s.data.skillCategories, cat] } })),

      updateSkillCategory: (id, cat) =>
        set((s) => ({
          data: {
            ...s.data,
            skillCategories: s.data.skillCategories.map((c) => (c.id === id ? cat : c)),
          },
        })),

      removeSkillCategory: (id) =>
        set((s) => ({
          data: { ...s.data, skillCategories: s.data.skillCategories.filter((c) => c.id !== id) },
        })),

      addEducation: (edu) =>
        set((s) => ({ data: { ...s.data, educations: [...s.data.educations, edu] } })),

      updateEducation: (id, edu) =>
        set((s) => ({
          data: { ...s.data, educations: s.data.educations.map((e) => (e.id === id ? edu : e)) },
        })),

      removeEducation: (id) =>
        set((s) => ({ data: { ...s.data, educations: s.data.educations.filter((e) => e.id !== id) } })),

      addProject: (proj) =>
        set((s) => ({ data: { ...s.data, projects: [...s.data.projects, proj] } })),

      updateProject: (id, proj) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.map((p) => (p.id === id ? proj : p)) },
        })),

      removeProject: (id) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

      addCustomSection: (sec) =>
        set((s) => ({ data: { ...s.data, customSections: [...s.data.customSections, sec] } })),

      updateCustomSection: (id, sec) =>
        set((s) => ({
          data: {
            ...s.data,
            customSections: s.data.customSections.map((c) => (c.id === id ? sec : c)),
          },
        })),

      removeCustomSection: (id) =>
        set((s) => ({
          data: { ...s.data, customSections: s.data.customSections.filter((c) => c.id !== id) },
        })),

      setSectionOrder: (order) =>
        set((s) => ({ data: { ...s.data, sectionOrder: order } })),

      toggleSectionVisibility: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            sectionOrder: s.data.sectionOrder.map((sec) =>
              sec.id === id ? { ...sec, visible: !sec.visible } : sec
            ),
          },
        })),

      resetData: () => set({ data: sampleData }),

      importData: (data) =>
        set({ data: { ...data, sectionOrder: dedupeSectionOrder(data.sectionOrder) } }),
    }),
    {
      name: 'cv-builder-data',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as CVStore;
        return {
          ...state,
          data: { ...state.data, sectionOrder: dedupeSectionOrder(state.data.sectionOrder) },
        };
      },
    }
  )
);

const EXPORT_PREFIX = 'CV1:';

export const encodeCVData = (data: CVData): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return EXPORT_PREFIX + btoa(binary);
};

export const decodeCVData = (input: string): CVData => {
  const raw = input.trim().replace(/^CV1:/, '');
  const binary = atob(raw);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const data = JSON.parse(new TextDecoder().decode(bytes)) as CVData;
  if (!data?.personalInfo || !Array.isArray(data.sectionOrder) || !Array.isArray(data.experiences)) {
    throw new Error('Format invalide');
  }
  return data;
};
