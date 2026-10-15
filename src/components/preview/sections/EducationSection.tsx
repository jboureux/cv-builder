import type { Education, CVTheme } from '../../../types/cv';

interface Props {
  educations: Education[];
  theme: CVTheme;
}

export function EducationSection({ educations, theme }: Props) {
  if (!educations.length) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        Formation
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {educations.map((edu) => (
          <div key={edu.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '10pt', fontWeight: 700, color: '#0f172a' }}>
                {edu.institution}
              </span>
              <span style={{ fontSize: '8.5pt', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
              </span>
            </div>
            {(edu.degree || edu.field) && (
              <p style={{ margin: '1px 0 0 0', fontSize: '9pt', color: '#334155', fontWeight: 500 }}>
                {[edu.degree, edu.field].filter(Boolean).join(' — ')}
              </p>
            )}
            {edu.details && (
              <p style={{ margin: '2px 0 0 0', fontSize: '8.5pt', color: '#64748b', fontStyle: 'italic' }}>
                {edu.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
