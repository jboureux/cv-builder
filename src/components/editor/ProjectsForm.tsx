import { useCVStore } from '@/store/useCVStore';
import { TagInput } from '@/components/common/TagInput';
import { BulletList } from '@/components/common/BulletList';
import { AddButton, ItemCard } from '@/components/common/ItemCard';
import { TextField } from '@/components/common/fields';
import { Field, FieldLabel } from '@/components/ui/field';
import type { Project } from '@/types/cv';

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  url: '',
  technologies: [],
  bullets: [],
});

function ProjectCard({
  proj,
  onUpdate,
  onRemove,
}: {
  proj: Project;
  onUpdate: (p: Project) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof Project>(key: K, value: Project[K]) => onUpdate({ ...proj, [key]: value });

  return (
    <ItemCard
      title={proj.name || 'Nouveau projet'}
      subtitle={proj.url}
      defaultOpen={!proj.name}
      removeLabel="ce projet"
      onRemove={onRemove}
    >
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Nom du projet" value={proj.name} onChange={(v) => set('name', v)} placeholder="MonProjet" />
        <TextField label="URL / GitHub" value={proj.url} onChange={(v) => set('url', v)} placeholder="github.com/user/repo" />
      </div>
      <TextField
        label="Description"
        value={proj.description}
        onChange={(v) => set('description', v)}
        rows={2}
        placeholder="Une phrase décrivant le projet…"
      />
      <Field className="gap-1.5">
        <FieldLabel className="text-xs text-muted-foreground">Points clés</FieldLabel>
        <BulletList
          bullets={proj.bullets}
          onChange={(b) => set('bullets', b)}
          placeholder="Résultat ou impact mesurable…"
        />
      </Field>
      <Field className="gap-1.5">
        <FieldLabel className="text-xs text-muted-foreground">Technologies</FieldLabel>
        <TagInput tags={proj.technologies} onChange={(t) => set('technologies', t)} placeholder="Go, React… (Entrée)" />
      </Field>
    </ItemCard>
  );
}

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useCVStore();

  return (
    <div className="space-y-2.5">
      {data.projects.map((proj) => (
        <ProjectCard
          key={proj.id}
          proj={proj}
          onUpdate={(p) => updateProject(proj.id, p)}
          onRemove={() => removeProject(proj.id)}
        />
      ))}
      <AddButton onClick={() => addProject(emptyProject())}>Ajouter un projet</AddButton>
    </div>
  );
}
