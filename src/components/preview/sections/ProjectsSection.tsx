import type { Project, CVTheme } from '../../../types/cv';

interface Props {
  projects: Project[];
  theme: CVTheme;
}

export function ProjectsSection({ projects, theme }: Props) {
  if (!projects.length) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        Projets & Open Source
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map((proj) => (
          <div key={proj.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '10pt', fontWeight: 700, color: '#0f172a' }}>
                {proj.name}
              </span>
              {proj.url && (
                <span style={{ fontSize: '8pt', color: '#64748b', marginLeft: '8px' }}>
                  {proj.url}
                </span>
              )}
            </div>
            {proj.description && (
              <p style={{ margin: '2px 0', fontSize: '9pt', color: '#334155' }}>
                {proj.description}
              </p>
            )}
            {proj.bullets.length > 0 && (
              <ul style={{ margin: '3px 0', paddingLeft: '14px', listStyle: 'disc' }}>
                {proj.bullets.map((b) => (
                  <li key={b.id} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2px', lineHeight: 1.45 }}>
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
            {proj.technologies.length > 0 && (
              <p style={{ margin: '2px 0 0 0', fontSize: '8pt', color: '#64748b' }}>
                <span style={{ fontWeight: 600 }}>Stack :</span>{' '}
                {proj.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
