import { useCVStore } from '@/store/useCVStore';
import { AddButton, ItemCard } from '@/components/common/ItemCard';
import { TextField } from '@/components/common/fields';
import type { Education } from '@/types/cv';

const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  details: '',
});

function EducationCard({
  edu,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  onUpdate: (e: Education) => void;
  onRemove: () => void;
}) {
  const set = (key: keyof Education, value: string) => onUpdate({ ...edu, [key]: value });

  return (
    <ItemCard
      title={edu.institution || 'Nouvel établissement'}
      subtitle={[edu.field, edu.endDate].filter(Boolean).join(' · ')}
      defaultOpen={!edu.institution}
      removeLabel="cette formation"
      onRemove={onRemove}
    >
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Établissement"
          value={edu.institution}
          onChange={(v) => set('institution', v)}
          placeholder="INSA Lyon"
          className="col-span-2"
        />
        <TextField label="Diplôme" value={edu.degree} onChange={(v) => set('degree', v)} placeholder="Master, Ingénieur…" />
        <TextField label="Domaine" value={edu.field} onChange={(v) => set('field', v)} placeholder="Informatique" />
        <TextField label="Début" value={edu.startDate} onChange={(v) => set('startDate', v)} placeholder="2013" />
        <TextField label="Fin" value={edu.endDate} onChange={(v) => set('endDate', v)} placeholder="2018" />
      </div>
      <TextField
        label="Détails / spécialisation"
        value={edu.details}
        onChange={(v) => set('details', v)}
        rows={2}
        placeholder="Spécialisation en systèmes distribués…"
      />
    </ItemCard>
  );
}

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useCVStore();

  return (
    <div className="space-y-2.5">
      {data.educations.map((edu) => (
        <EducationCard
          key={edu.id}
          edu={edu}
          onUpdate={(e) => updateEducation(edu.id, e)}
          onRemove={() => removeEducation(edu.id)}
        />
      ))}
      <AddButton onClick={() => addEducation(emptyEducation())}>Ajouter une formation</AddButton>
    </div>
  );
}
