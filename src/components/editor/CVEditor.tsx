import { useState } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { CustomSectionForm } from './CustomSectionForm';
import { SectionList } from './SectionList';
import { ThemePicker } from './ThemePicker';

type Tab = 'profil' | 'experience' | 'skills' | 'education' | 'projects' | 'custom' | 'sections' | 'theme';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'profil', label: 'Profil', icon: '👤' },
  { id: 'experience', label: 'Expériences', icon: '💼' },
  { id: 'skills', label: 'Compétences', icon: '⚡' },
  { id: 'education', label: 'Formation', icon: '🎓' },
  { id: 'projects', label: 'Projets', icon: '🚀' },
  { id: 'custom', label: 'Sections +', icon: '✚' },
  { id: 'sections', label: 'Ordre', icon: '↕' },
  { id: 'theme', label: 'Thème', icon: '🎨' },
];

const CONTENT: Record<Tab, { title: string; component: React.ReactNode }> = {
  profil: { title: 'Informations personnelles & Résumé', component: <><PersonalInfoForm /><div className="mt-4"><SummaryForm /></div></> },
  experience: { title: 'Expériences professionnelles', component: <ExperienceForm /> },
  skills: { title: 'Compétences techniques', component: <SkillsForm /> },
  education: { title: 'Formation', component: <EducationForm /> },
  projects: { title: 'Projets & Open Source', component: <ProjectsForm /> },
  custom: { title: 'Sections personnalisées', component: <CustomSectionForm /> },
  sections: { title: 'Ordre & visibilité des sections', component: <SectionList /> },
  theme: { title: 'Thème visuel', component: <ThemePicker /> },
};

export function CVEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('profil');

  return (
    <div className="no-print flex flex-col h-full w-[360px] shrink-0 border-r border-slate-200 bg-slate-50">
      {/* Tab navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center px-3 py-2 text-xs transition-colors shrink-0 border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base leading-none mb-0.5">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Section title */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <h2 className="text-sm font-semibold text-slate-700">{CONTENT[activeTab].title}</h2>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-4">
        {CONTENT[activeTab].component}
      </div>
    </div>
  );
}
