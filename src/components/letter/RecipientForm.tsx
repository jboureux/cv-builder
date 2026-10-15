import { useLetterStore, useActiveLetter } from '../../store/useLetterStore';
import type { LetterRecipient } from '../../types/letter';
import { TextField } from './fields';

export function RecipientForm() {
  const updateLetter = useLetterStore((s) => s.updateLetter);
  const letter = useActiveLetter();

  const update = (key: keyof LetterRecipient, value: string) =>
    updateLetter(letter.id, { ...letter, recipient: { ...letter.recipient, [key]: value } });

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Le bloc destinataire est positionné pour apparaître dans la fenêtre d'une enveloppe DL une fois la lettre pliée en trois.
      </p>
      <TextField
        label="Interlocuteur"
        value={letter.recipient.name}
        onChange={(v) => update('name', v)}
        placeholder="Mme Claire Martin, Responsable RH"
      />
      <TextField
        label="Entreprise"
        value={letter.recipient.company}
        onChange={(v) => update('company', v)}
        placeholder="Société Exemple"
      />
      <TextField
        label="Adresse"
        value={letter.recipient.address}
        onChange={(v) => update('address', v)}
        placeholder={'12 rue de la République\n69002 Lyon'}
        rows={3}
      />
    </div>
  );
}
