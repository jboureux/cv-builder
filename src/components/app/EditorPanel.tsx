import type { ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PersonalInfoForm } from '@/components/editor/PersonalInfoForm';
import { SummaryForm } from '@/components/editor/SummaryForm';
import { ExperienceForm } from '@/components/editor/ExperienceForm';
import { SkillsForm } from '@/components/editor/SkillsForm';
import { EducationForm } from '@/components/editor/EducationForm';
import { ProjectsForm } from '@/components/editor/ProjectsForm';
import { CustomSectionForm } from '@/components/editor/CustomSectionForm';
import { RecipientForm } from '@/components/letter/RecipientForm';
import { ContentForm } from '@/components/letter/ContentForm';
import { FieldSeparator } from '@/components/ui/field';
import { CV_SECTIONS, LETTER_SECTIONS, type CVSectionId, type LetterSectionId, type NavItem } from './navigation';

const CV_FORMS: Record<CVSectionId, ReactNode> = {
  profile: (
    <div className="space-y-6">
      <PersonalInfoForm />
      <FieldSeparator />
      <SummaryForm />
    </div>
  ),
  experience: <ExperienceForm />,
  skills: <SkillsForm />,
  education: <EducationForm />,
  projects: <ProjectsForm />,
  custom: <CustomSectionForm />,
};

const LETTER_FORMS: Record<LetterSectionId, ReactNode> = {
  recipient: <RecipientForm />,
  content: <ContentForm />,
};

/** Panneau de saisie de la section sélectionnée dans la sidebar. */
export function EditorPanel() {
  const { mode, cvSection, letterSection } = useAppStore();

  const [section, form]: [NavItem<string>, ReactNode] =
    mode === 'cv'
      ? [CV_SECTIONS.find((s) => s.id === cvSection) ?? CV_SECTIONS[0], CV_FORMS[cvSection] ?? CV_FORMS.profile]
      : [
          LETTER_SECTIONS.find((s) => s.id === letterSection) ?? LETTER_SECTIONS[1],
          LETTER_FORMS[letterSection] ?? LETTER_FORMS.content,
        ];
  const Icon = section.icon;

  return (
    <aside className="no-print flex w-[400px] shrink-0 flex-col border-r bg-background max-lg:w-[340px] max-md:w-full max-md:border-r-0">
      <header className="flex items-center gap-3 border-b px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-heading text-sm font-semibold">{section.label}</h2>
          <p className="truncate text-xs text-muted-foreground">{section.description}</p>
        </div>
      </header>
      {/* key : on repart en haut du défilement à chaque changement de section */}
      <div key={`${mode}-${section.id}`} className="flex-1 overflow-y-auto px-5 py-5 animate-in fade-in-0 duration-200">
        {form}
      </div>
    </aside>
  );
}
