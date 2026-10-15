import {
  BriefcaseBusiness,
  Building2,
  FileUser,
  GraduationCap,
  LayoutList,
  Mail,
  PenLine,
  Rocket,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { AppMode } from '@/store/useAppStore';

export interface NavItem<Id extends string> {
  id: Id;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const MODES: Record<AppMode, { label: string; icon: LucideIcon }> = {
  cv: { label: 'CV', icon: FileUser },
  letter: { label: 'Lettres de motivation', icon: Mail },
};

export type CVSectionId = 'profile' | 'experience' | 'skills' | 'education' | 'projects' | 'custom';

export const CV_SECTIONS: NavItem<CVSectionId>[] = [
  { id: 'profile', label: 'Profil', description: 'Identité, coordonnées et résumé professionnel', icon: UserRound },
  { id: 'experience', label: 'Expériences', description: 'Postes occupés, réalisations et technologies', icon: BriefcaseBusiness },
  { id: 'skills', label: 'Compétences', description: 'Compétences regroupées par catégorie', icon: Sparkles },
  { id: 'education', label: 'Formation', description: 'Diplômes et établissements', icon: GraduationCap },
  { id: 'projects', label: 'Projets', description: 'Projets personnels et open source', icon: Rocket },
  { id: 'custom', label: 'Sections libres', description: 'Certifications, langues, bénévolat…', icon: LayoutList },
];

export type LetterSectionId = 'recipient' | 'content';

export const LETTER_SECTIONS: NavItem<LetterSectionId>[] = [
  { id: 'recipient', label: 'Destinataire', description: "Placé dans la fenêtre d'une enveloppe DL", icon: Building2 },
  { id: 'content', label: 'Contenu', description: 'Objet, corps de la lettre et formules', icon: PenLine },
];
