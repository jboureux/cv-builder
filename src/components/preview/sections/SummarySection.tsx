import type { CVTheme } from '../../../types/cv';

interface Props {
  summary: string;
  theme: CVTheme;
}

export function SummarySection({ summary, theme }: Props) {
  if (!summary) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <h2 className="cv-section-title" style={{ color: theme.accentColor }}>
        Profil Professionnel
      </h2>
      <p style={{ margin: 0, fontSize: '9.5pt', color: '#334155', lineHeight: 1.55 }}>
        {summary}
      </p>
    </div>
  );
}
