import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useCVStore } from '../../store/useCVStore';
import { TagInput } from '../ui/TagInput';
import { SortableItem } from '../ui/SortableItem';
import type { Experience, ExperienceBullet } from '../../types/cv';

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

function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: ExperienceBullet[];
  onChange: (b: ExperienceBullet[]) => void;
}) {
  const add = () => onChange([...bullets, { id: crypto.randomUUID(), text: '' }]);
  const remove = (id: string) => onChange(bullets.filter((b) => b.id !== id));
  const update = (id: string, text: string) =>
    onChange(bullets.map((b) => (b.id === id ? { ...b, text } : b)));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = bullets.findIndex((b) => b.id === active.id);
      const newIdx = bullets.findIndex((b) => b.id === over.id);
      onChange(arrayMove(bullets, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-1.5">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={bullets.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {bullets.map((b) => (
            <SortableItem key={b.id} id={b.id}>
              {(handleProps) => (
                <div className="flex gap-1.5 items-start">
                  <span
                    {...handleProps}
                    className="mt-1.5 text-slate-300 hover:text-slate-500 cursor-grab select-none touch-none text-sm leading-none"
                    title="Glisser pour réordonner"
                  >
                    ⠿
                  </span>
                  <input
                    type="text"
                    value={b.text}
                    onChange={(e) => update(b.id, e.target.value)}
                    placeholder="Action verb + résultat mesurable..."
                    className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => remove(b.id)}
                    className="mt-1.5 text-slate-300 hover:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={add}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        + Ajouter un point
      </button>
    </div>
  );
}

function ExperienceCard({
  exp,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  onUpdate: (e: Experience) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(!exp.company);

  const set = (key: keyof Experience, value: unknown) =>
    onUpdate({ ...exp, [key]: value });

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">
            {exp.company || 'Nouvelle expérience'}
          </span>
          {exp.role && (
            <span className="text-sm text-slate-500"> — {exp.role}</span>
          )}
          {(exp.startDate || exp.endDate) && (
            <span className="ml-2 text-xs text-slate-400">
              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
            </span>
          )}
        </div>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Entreprise</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="Google"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Rôle</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="Tech Lead"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Début</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                placeholder="01/2022"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fin</label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                placeholder="Présent"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Localisation</label>
            <input
              type="text"
              value={exp.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Paris, France"
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Points clés</label>
            <BulletEditor bullets={exp.bullets} onChange={(b) => set('bullets', b)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Technologies</label>
            <TagInput
              tags={exp.technologies}
              onChange={(t) => set('technologies', t)}
              placeholder="React, Node.js... (Entrée pour valider)"
            />
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-red-400 hover:text-red-600 font-medium"
            >
              Supprimer cette expérience
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useCVStore();

  return (
    <div className="space-y-3">
      {data.experiences.map((exp) => (
        <ExperienceCard
          key={exp.id}
          exp={exp}
          onUpdate={(e) => updateExperience(exp.id, e)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}
      <button
        type="button"
        onClick={() => addExperience(emptyExperience())}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        + Ajouter une expérience
      </button>
    </div>
  );
}
