import { useLetterStore, useActiveLetter, formatLetterDate } from '../../store/useLetterStore';
import type { CoverLetter } from '../../types/letter';
import { TextField } from './fields';

type TextKey = 'place' | 'date' | 'subject' | 'salutation' | 'body' | 'closing';

export function ContentForm() {
  const updateLetter = useLetterStore((s) => s.updateLetter);
  const letter = useActiveLetter();

  const update = (key: TextKey, value: string) => updateLetter(letter.id, { ...letter, [key]: value } as CoverLetter);
  const words = letter.body.trim() ? letter.body.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Lieu" value={letter.place} onChange={(v) => update('place', v)} placeholder="Paris" />
        <div>
          <TextField label="Date" value={letter.date} onChange={(v) => update('date', v)} placeholder={formatLetterDate()} />
          <button
            type="button"
            onClick={() => update('date', formatLetterDate())}
            className="mt-1 text-[11px] text-blue-600 hover:text-blue-700"
          >
            Aujourd'hui
          </button>
        </div>
      </div>
      <TextField
        label="Objet"
        value={letter.subject}
        onChange={(v) => update('subject', v)}
        placeholder="Candidature au poste de…"
      />
      <TextField
        label="Formule d'appel"
        value={letter.salutation}
        onChange={(v) => update('salutation', v)}
        placeholder="Madame, Monsieur,"
      />
      <div>
        <TextField
          label="Corps de la lettre"
          hint="(ligne vide = nouveau paragraphe)"
          value={letter.body}
          onChange={(v) => update('body', v)}
          rows={16}
          placeholder="Vous / Moi / Nous : présentez ce qui vous attire dans l'entreprise, ce que vous apportez, et ce que vous construirez ensemble."
        />
        <p className="mt-1 text-xs text-slate-400">{words} mots — idéalement entre 250 et 400</p>
      </div>
      <TextField
        label="Formule de politesse"
        value={letter.closing}
        onChange={(v) => update('closing', v)}
        rows={3}
      />
    </div>
  );
}
