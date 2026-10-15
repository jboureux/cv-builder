import { forwardRef } from 'react';
import type { CVData } from '../../types/cv';
import { HeaderSection } from './sections/HeaderSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { EducationSection } from './sections/EducationSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CustomSection } from './sections/CustomSection';
import { FONT_STACKS } from '../../lib/fonts';

interface Props {
  data: CVData;
}

export const CVDocument = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { personalInfo, summary, experiences, skillCategories, educations, projects, customSections, sectionOrder, theme } = data;

  const renderSection = (sec: typeof sectionOrder[0]) => {
    if (!sec.visible) return null;

    switch (sec.type) {
      case 'experience':
        return <ExperienceSection key={sec.id} experiences={experiences} theme={theme} />;
      case 'skills':
        return <SkillsSection key={sec.id} categories={skillCategories} theme={theme} />;
      case 'education':
        return <EducationSection key={sec.id} educations={educations} theme={theme} />;
      case 'projects':
        return <ProjectsSection key={sec.id} projects={projects} theme={theme} />;
      case 'custom': {
        const custom = customSections.find((c) => c.id === sec.customId);
        return custom ? <CustomSection key={sec.id} section={custom} theme={theme} /> : null;
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className="cv-document"
      style={{
        fontFamily: FONT_STACKS[theme.fontFamily] ?? FONT_STACKS.inter,
        padding: '12mm 14mm',
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
      }}
    >
      <HeaderSection info={personalInfo} theme={theme} />
      {summary && <SummarySection summary={summary} theme={theme} />}
      {sectionOrder.map(renderSection)}
    </div>
  );
});

CVDocument.displayName = 'CVDocument';
