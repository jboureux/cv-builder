import { useCVStore } from '@/store/useCVStore';
import { TagInput } from '@/components/common/TagInput';
import { BulletList } from '@/components/common/BulletList';
import { AddButton, ItemCard } from '@/components/common/ItemCard';
import { TextField } from '@/components/common/fields';
import { Field, FieldLabel } from '@/components/ui/field';
import type { Experience } from '@/types/cv';

const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  location: '',
  bullets: [],
  technologies: [],
});

function ExperienceCard({
  exp,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  onUpdate: (e: Experience) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof Experience>(key: K, value: Experience[K]) => onUpdate({ ...exp, [key]: value });
  const period = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');

  return (
    <ItemCard
      title={exp.company || 'Nouvelle expérience'}
      subtitle={[exp.role, period].filter(Boolean).join(' · ')}
      defaultOpen={!exp.company}
      removeLabel="cette expérience"
      onRemove={onRemove}
    >
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Entreprise" value={exp.company} onChange={(v) => set('company', v)} placeholder="Google" />
        <TextField label="Rôle" value={exp.role} onChange={(v) => set('role', v)} placeholder="Tech Lead" />
        <TextField label="Début" value={exp.startDate} onChange={(v) => set('startDate', v)} placeholder="01/2022" />
        <TextField label="Fin" value={exp.endDate} onChange={(v) => set('endDate', v)} placeholder="Présent" />
        <TextField
          label="Localisation"
          value={exp.location}
          onChange={(v) => set('location', v)}
          placeholder="Paris, France"
          className="col-span-2"
        />
      </div>
      <Field className="gap-1.5">
        <FieldLabel className="text-xs text-muted-foreground">Points clés</FieldLabel>
        <BulletList
          bullets={exp.bullets}
          onChange={(b) => set('bullets', b)}
          placeholder="Verbe d'action + résultat mesurable…"
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel className="text-xs text-muted-foreground">Technologies</FieldLabel>
        <TagInput
          tags={exp.technologies}
          onChange={(t) => set('technologies', t)}
          placeholder="React, Node.js… (Entrée pour valider)"
        />
      </Field>
    </ItemCard>
  );
}

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useCVStore();

  return (
    <div className="space-y-2.5">
      {data.experiences.map((exp) => (
        <ExperienceCard
          key={exp.id}
          exp={exp}
          onUpdate={(e) => updateExperience(exp.id, e)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}
      <AddButton onClick={() => addExperience(emptyExperience())}>Ajouter une expérience</AddButton>
    </div>
  );
}
