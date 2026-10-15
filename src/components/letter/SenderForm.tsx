import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLetterStore, senderFromCV } from '@/store/useLetterStore';
import { useCVStore } from '@/store/useCVStore';
import { ImageUpload, RangeField, TextField } from '@/components/common/fields';
import { SectionHint } from '@/components/common/ItemCard';
import { useConfirm } from '@/components/app/ConfirmProvider';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import type { LetterSender } from '@/types/letter';

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
  const confirm = useConfirm();
  const { sender } = profile;

  const update = (key: keyof LetterSender, value: string) => updateProfile({ sender: { ...sender, [key]: value } });

  const importFromCV = async () => {
    const ok = await confirm({
      title: 'Reprendre les coordonnées du CV ?',
      description: 'Vos coordonnées d’expéditeur actuelles seront remplacées par celles saisies dans le CV.',
      confirmLabel: 'Remplacer',
    });
    if (ok) {
      updateProfile({ sender: senderFromCV(personalInfo) });
      toast.success('Coordonnées reprises du CV');
    }
  };

  return (
    <FieldGroup className="gap-6">
      <SectionHint>Ces informations sont communes à toutes vos lettres.</SectionHint>

      <FieldSet className="gap-4">
        <FieldLegend variant="label">Logo</FieldLegend>
        <ImageUpload label="Image" value={profile.logo} onChange={(logo) => updateProfile({ logo })} />
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
      </FieldSet>

      <FieldSeparator />

      <FieldSet className="gap-3">
        <div className="flex items-center justify-between gap-2">
          <FieldLegend variant="label" className="mb-0">
            Coordonnées
          </FieldLegend>
          <Button type="button" variant="ghost" size="xs" onClick={importFromCV} className="text-muted-foreground">
            <RotateCcw />
            Reprendre du CV
          </Button>
        </div>
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
      </FieldSet>
    </FieldGroup>
  );
}
