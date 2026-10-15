import { useCVStore } from '@/store/useCVStore';
import { TextField } from '@/components/common/fields';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import type { PersonalInfo } from '@/types/cv';

type Field = keyof PersonalInfo;

interface FieldDef {
  key: Field;
  label: string;
  placeholder: string;
  type?: string;
  wide?: boolean;
}

const IDENTITY: FieldDef[] = [
  { key: 'fullName', label: 'Nom complet', placeholder: 'Jean Dupont', wide: true },
  { key: 'title', label: 'Titre professionnel', placeholder: 'Tech Lead & Développeur Web Full-Stack', wide: true },
];

const CONTACT: FieldDef[] = [
  { key: 'email', label: 'Email', placeholder: 'jean@email.com', type: 'email', wide: true },
  { key: 'phone', label: 'Téléphone', placeholder: '+33 6 12 34 56 78' },
  { key: 'location', label: 'Localisation', placeholder: 'Paris, France' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jean' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/jean' },
  { key: 'website', label: 'Site web', placeholder: 'monsite.dev', wide: true },
];

export function PersonalInfoForm() {
  const { data, setPersonalInfo } = useCVStore();
  const { personalInfo } = data;

  const update = (key: Field, value: string) => setPersonalInfo({ ...personalInfo, [key]: value });

  const renderFields = (fields: FieldDef[]) => (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(({ key, label, placeholder, type, wide }) => (
        <TextField
          key={key}
          label={label}
          type={type}
          value={personalInfo[key]}
          onChange={(v) => update(key, v)}
          placeholder={placeholder}
          className={wide ? 'col-span-2' : undefined}
        />
      ))}
    </div>
  );

  return (
    <FieldGroup className="gap-6">
      <FieldSet className="gap-3">
        <FieldLegend variant="label">Identité</FieldLegend>
        {renderFields(IDENTITY)}
      </FieldSet>
      <FieldSet className="gap-3">
        <FieldLegend variant="label">Coordonnées</FieldLegend>
        {renderFields(CONTACT)}
      </FieldSet>
    </FieldGroup>
  );
}
