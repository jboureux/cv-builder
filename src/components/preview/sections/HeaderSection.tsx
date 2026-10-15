import type { PersonalInfo, CVTheme } from '../../../types/cv';

interface Props {
  info: PersonalInfo;
  theme: CVTheme;
}

export function HeaderSection({ info, theme }: Props) {
  const contacts = [
    info.email,
    info.phone,
    info.location,
    info.linkedin,
    info.github,
    info.website,
  ].filter(Boolean);

  return (
    <div style={{ marginBottom: '14px' }}>
      <h1
        style={{
          margin: '0 0 2px 0',
          fontSize: '22pt',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#0f172a',
          lineHeight: 1.1,
        }}
      >
        {info.fullName || 'Votre Nom'}
      </h1>
      <p
        style={{
          margin: '0 0 10px 0',
          fontSize: '11pt',
          fontWeight: 500,
          color: theme.accentColor,
          letterSpacing: '0.01em',
        }}
      >
        {info.title || 'Votre Titre'}
      </p>
      <div
        style={{
          height: '2px',
          background: theme.accentColor,
          marginBottom: '8px',
          borderRadius: '1px',
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: '8.5pt',
          color: '#475569',
          lineHeight: 1.6,
        }}
      >
        {contacts.join('  ·  ')}
      </p>
    </div>
  );
}
