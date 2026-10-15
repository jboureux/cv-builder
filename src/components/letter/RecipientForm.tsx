import { useLetterStore, useActiveLetter } from '@/store/useLetterStore';
import { TextField } from '@/components/common/fields';
import { SectionHint } from '@/components/common/ItemCard';
import type { LetterRecipient } from '@/types/letter';

export function RecipientForm() {
  const updateLetter = useLetterStore((s) => s.updateLetter);
  const letter = useActiveLetter();

  const update = (key: keyof LetterRecipient, value: string) =>
    updateLetter(letter.id, { ...letter, recipient: { ...letter.recipient, [key]: value } });

  return (
    <div className="space-y-4">
      <SectionHint>
        Le bloc destinataire est positionné pour apparaître dans la fenêtre d'une enveloppe DL une fois la lettre pliée
        en trois.
      </SectionHint>
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
