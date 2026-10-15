import { useCVStore } from '../../store/useCVStore';
import type { PersonalInfo } from '../../types/cv';

type Field = keyof PersonalInfo;

const FIELDS: { key: Field; label: string; placeholder: string; type?: string }[] = [
  { key: 'fullName', label: 'Nom complet', placeholder: 'Jean Dupont' },
  { key: 'title', label: 'Titre professionnel', placeholder: 'Tech Lead & Développeur Web Full-Stack' },
  { key: 'email', label: 'Email', placeholder: 'jean@email.com', type: 'email' },
  { key: 'phone', label: 'Téléphone', placeholder: '+33 6 12 34 56 78' },
  { key: 'location', label: 'Localisation', placeholder: 'Paris, France' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jean' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/jean' },
  { key: 'website', label: 'Site web', placeholder: 'monsite.dev' },
];

export function PersonalInfoForm() {
  const { data, setPersonalInfo } = useCVStore();
  const { personalInfo } = data;

  const update = (key: Field, value: string) =>
    setPersonalInfo({ ...personalInfo, [key]: value });

  return (
    <div className="space-y-3">
      {FIELDS.map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
          <input
            type={type ?? 'text'}
            value={personalInfo[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          />
        </div>
      ))}
    </div>
  );
}
