import { useLetterStore, senderFromCV } from '../../store/useLetterStore';
import { useCVStore } from '../../store/useCVStore';
import type { LetterSender } from '../../types/letter';
import { ImageUpload, RangeField, TextField } from './fields';

const FIELDS: { key: keyof LetterSender; label: string; placeholder: string; rows?: number }[] = [
  { key: 'fullName', label: 'Nom complet', placeholder: 'Jean Dupont' },
  { key: 'address', label: 'Adresse postale', placeholder: '8 avenue des Lilas\n75011 Paris', rows: 3 },
  { key: 'phone', label: 'Téléphone', placeholder: '+33 6 12 34 56 78' },
  { key: 'email', label: 'Email', placeholder: 'jean@email.com' },
  { key: 'extra', label: 'Ligne complémentaire', placeholder: 'linkedin.com/in/jean' },
];

export function SenderForm() {
  const { profile, updateProfile } = useLetterStore();
  const personalInfo = useCVStore((s) => s.data.personalInfo);
  const { sender } = profile;

  const update = (key: keyof LetterSender, value: string) =>
    updateProfile({ sender: { ...sender, [key]: value } });

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Ces informations sont communes à toutes vos lettres.
      </p>

      <ImageUpload label="Logo" value={profile.logo} onChange={(logo) => updateProfile({ logo })} />
      {profile.logo && (
        <RangeField
          label="Hauteur du logo"
          value={profile.logoHeight}
          min={8}
          max={40}
          unit="mm"
          onChange={(logoHeight) => updateProfile({ logoHeight })}
        />
      )}

      <div className="space-y-3">
        {FIELDS.map(({ key, label, placeholder, rows }) => (
          <TextField
            key={key}
            label={label}
            value={sender[key]}
            onChange={(v) => update(key, v)}
            placeholder={placeholder}
            rows={rows}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm('Remplacer vos coordonnées par celles du CV ?')) {
            updateProfile({ sender: senderFromCV(personalInfo) });
          }
        }}
        className="text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        ↺ Reprendre les coordonnées du CV
      </button>
    </div>
  );
}
