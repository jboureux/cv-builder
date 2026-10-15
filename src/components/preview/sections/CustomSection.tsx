import type { CustomSection as CustomSectionType, CVTheme } from '../../../types/cv';

interface Props {
  section: CustomSectionType;
  theme: CVTheme;
}

export function CustomSection({ section, theme }: Props) {
  if (!section.title && !section.content) return null;

  const lines = section.content.split('\n').filter((l) => l.trim());

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        {section.title}
      </h2>
      {lines.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: '14px', listStyle: 'disc' }}>
          {lines.map((line, i) => (
            <li key={i} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2px', lineHeight: 1.45 }}>
              {line.replace(/^[-•*]\s*/, '')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
