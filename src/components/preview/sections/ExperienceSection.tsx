import type { Experience, CVTheme } from '../../../types/cv';

interface Props {
  experiences: Experience[];
  theme: CVTheme;
}

export function ExperienceSection({ experiences, theme }: Props) {
  if (!experiences.length) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        Expérience Professionnelle
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {experiences.map((exp) => (
          <div key={exp.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '1px',
              }}
            >
              <div>
                <span style={{ fontSize: '10pt', fontWeight: 700, color: '#0f172a' }}>
                  {exp.company}
                </span>
                {exp.role && (
                  <span style={{ fontSize: '10pt', fontWeight: 500, color: '#334155' }}>
                    {' '}— {exp.role}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '8.5pt', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
              </span>
            </div>
            {exp.location && (
              <p style={{ margin: '0 0 4px 0', fontSize: '8.5pt', color: '#64748b', fontStyle: 'italic' }}>
                {exp.location}
              </p>
            )}
            {exp.bullets.length > 0 && (
              <ul
                style={{
                  margin: '4px 0',
                  paddingLeft: '14px',
                  listStyle: 'disc',
                }}
              >
                {exp.bullets.map((b) => (
                  <li key={b.id} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2px', lineHeight: 1.45 }}>
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
            {exp.technologies.length > 0 && (
              <p style={{ margin: '3px 0 0 0', fontSize: '8pt', color: '#64748b' }}>
                <span style={{ fontWeight: 600 }}>Technologies :</span>{' '}
                {exp.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
