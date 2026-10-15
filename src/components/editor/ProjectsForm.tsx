import { useState } from 'react';
import { useCVStore } from '../../store/useCVStore';
import { TagInput } from '../ui/TagInput';
import type { Project, ProjectBullet } from '../../types/cv';

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  url: '',
  technologies: [],
  bullets: [],
});

function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: ProjectBullet[];
  onChange: (b: ProjectBullet[]) => void;
}) {
  const add = () => onChange([...bullets, { id: crypto.randomUUID(), text: '' }]);
  const remove = (id: string) => onChange(bullets.filter((b) => b.id !== id));
  const update = (id: string, text: string) =>
    onChange(bullets.map((b) => (b.id === id ? { ...b, text } : b)));

  return (
    <div className="space-y-1.5">
      {bullets.map((b) => (
        <div key={b.id} className="flex gap-1.5 items-start">
          <span className="text-slate-400 mt-2 text-xs">•</span>
          <input
            type="text"
            value={b.text}
            onChange={(e) => update(b.id, e.target.value)}
            placeholder="Résultat ou impact mesurable..."
            className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          />
          <button type="button" onClick={() => remove(b.id)} className="mt-1.5 text-slate-300 hover:text-red-400 text-lg leading-none">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
        + Ajouter un point
      </button>
    </div>
  );
}

function ProjectCard({
  proj,
  onUpdate,
  onRemove,
}: {
  proj: Project;
  onUpdate: (p: Project) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(!proj.name);
  const set = (key: keyof Project, value: unknown) => onUpdate({ ...proj, [key]: value });

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800">
          {proj.name || 'Nouveau projet'}
        </span>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nom du projet</label>
              <input type="text" value={proj.name} onChange={(e) => set('name', e.target.value)} placeholder="MonProjet" className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">URL / GitHub</label>
              <input type="text" value={proj.url} onChange={(e) => set('url', e.target.value)} placeholder="github.com/user/repo" className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
            <textarea value={proj.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Une phrase décrivant le projet..." className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white resize-y" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Points clés</label>
            <BulletEditor bullets={proj.bullets} onChange={(b) => set('bullets', b)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Technologies</label>
            <TagInput tags={proj.technologies} onChange={(t) => set('technologies', t)} placeholder="Go, React... (Entrée)" />
          </div>
          <button type="button" onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 font-medium">
            Supprimer ce projet
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useCVStore();

  return (
    <div className="space-y-3">
      {data.projects.map((proj) => (
        <ProjectCard key={proj.id} proj={proj} onUpdate={(p) => updateProject(proj.id, p)} onRemove={() => removeProject(proj.id)} />
      ))}
      <button type="button" onClick={() => addProject(emptyProject())} className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium">
        + Ajouter un projet
      </button>
    </div>
  );
}
