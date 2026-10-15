import { forwardRef } from 'react';
import type { CoverLetter, LetterProfile } from '../../types/letter';
import { FONT_STACKS } from '../../lib/fonts';

interface Props {
  letter: CoverLetter;
  profile: LetterProfile;
}

/*
 * Mise en page inspirée de la norme NF Z 11-001 :
 * le bloc destinataire commence à ~45 mm du haut et ~105 mm du bord gauche,
 * ce qui le place dans la fenêtre d'une enveloppe DL (110 × 220 mm) une fois la lettre pliée en trois.
 */
const PAGE_PADDING = { top: 15, side: 20, bottom: 18 };
const RIGHT_COLUMN = 105 - PAGE_PADDING.side; // mm, depuis la marge gauche
const RECIPIENT_TOP = 45 - PAGE_PADDING.top; // mm
const FOLD_MARKS = [99, 198]; // mm, pliage en trois

const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const LetterDocument = forwardRef<HTMLDivElement, Props>(({ letter, profile }, ref) => {
  const { sender, theme } = profile;
  const { recipient } = letter;
  const senderLines = [sender.address, sender.phone, sender.email, sender.extra].filter(Boolean);
  const recipientLines = [recipient.name, recipient.company, recipient.address].filter(Boolean);
  const dateLine = letter.date
    ? `${letter.place ? `${letter.place}, le` : 'Le'} ${letter.date}`
    : letter.place;

  return (
    <div
      ref={ref}
      className="cv-document letter-document"
      style={{
        position: 'relative',
        fontFamily: FONT_STACKS[theme.fontFamily] ?? FONT_STACKS.georgia,
        fontSize: `${theme.fontSize}pt`,
        lineHeight: 1.5,
        padding: `${PAGE_PADDING.top}mm ${PAGE_PADDING.side}mm ${PAGE_PADDING.bottom}mm`,
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
        color: '#1e293b',
      }}
    >
      {theme.showFoldMarks &&
        FOLD_MARKS.map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              left: 0,
              top: `${top}mm`,
              width: '5mm',
              borderTop: '0.5pt solid #cbd5e1',
            }}
          />
        ))}

      {/* En-tête : expéditeur à gauche, destinataire dans la fenêtre d'enveloppe */}
      <div style={{ display: 'grid', gridTemplateColumns: `${RIGHT_COLUMN}mm 1fr`, marginBottom: '12mm' }}>
        <div style={{ paddingRight: '8mm' }}>
          {profile.logo && (
            <img
              src={profile.logo}
              alt=""
              style={{
                display: 'block',
                height: `${profile.logoHeight}mm`,
                maxWidth: '70mm',
                objectFit: 'contain',
                objectPosition: 'left',
                marginBottom: '5mm',
              }}
            />
          )}
          {sender.fullName && (
            <p style={{ margin: 0, fontWeight: 700, color: theme.accentColor, fontSize: '1.1em' }}>
              {sender.fullName}
            </p>
          )}
          <div style={{ fontSize: '0.88em', color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.45 }}>
            {senderLines.join('\n')}
          </div>
        </div>

        <div style={{ paddingTop: `${RECIPIENT_TOP}mm`, whiteSpace: 'pre-line' }}>
          {recipientLines.map((line, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 600 : 400 }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {dateLine && <p style={{ margin: `0 0 10mm ${RIGHT_COLUMN}mm` }}>{dateLine}</p>}

      {letter.subject.trim() && (
        <p style={{ margin: '0 0 8mm' }}>
          <span style={{ fontWeight: 700 }}>Objet : </span>
          {letter.subject}
        </p>
      )}

      <div style={{ textAlign: theme.justify ? 'justify' : 'left', hyphens: 'auto' }} lang="fr">
        {letter.salutation && <p style={{ margin: '0 0 1em' }}>{letter.salutation}</p>}
        {paragraphs(letter.body).map((p, i) => (
          <p key={i} style={{ margin: '0 0 0.9em', whiteSpace: 'pre-line', textIndent: 0 }}>
            {p}
          </p>
        ))}
        {letter.closing && <p style={{ margin: '0 0 0.9em', whiteSpace: 'pre-line' }}>{letter.closing}</p>}
      </div>

      {/* Signature */}
      <div style={{ marginLeft: `${RIGHT_COLUMN}mm`, marginTop: '6mm', breakInside: 'avoid' }}>
        {profile.signature ? (
          <img
            src={profile.signature}
            alt=""
            style={{
              display: 'block',
              height: `${profile.signatureHeight}mm`,
              maxWidth: '70mm',
              objectFit: 'contain',
              objectPosition: 'left',
              marginBottom: '2mm',
            }}
          />
        ) : (
          <div style={{ height: '12mm' }} />
        )}
        {sender.fullName && <p style={{ margin: 0 }}>{sender.fullName}</p>}
      </div>
    </div>
  );
});

LetterDocument.displayName = 'LetterDocument';
