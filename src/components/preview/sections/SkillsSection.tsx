import type { SkillCategory, CVTheme } from '../../../types/cv';

interface Props {
  categories: SkillCategory[];
  theme: CVTheme;
}

export function SkillsSection({ categories, theme }: Props) {
  if (!categories.length) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        Compétences Techniques
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '9pt',
                fontWeight: 700,
                color: '#0f172a',
                minWidth: '120px',
                flexShrink: 0,
              }}
            >
              {cat.name} :
            </span>
            <span style={{ fontSize: '9pt', color: '#334155' }}>
              {cat.skills.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
