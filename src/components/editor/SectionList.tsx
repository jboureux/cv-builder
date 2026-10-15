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
import { SortableItem } from '../ui/SortableItem';
import type { CVSection } from '../../types/cv';

const SECTION_LABELS: Record<string, string> = {
  experience: 'Expérience professionnelle',
  skills: 'Compétences techniques',
  education: 'Formation',
  projects: 'Projets & Open Source',
  custom: 'Section personnalisée',
};

function getSectionLabel(sec: CVSection, customSections: { id: string; title: string }[]) {
  if (sec.type === 'custom') {
    const custom = customSections.find((c) => c.id === sec.customId);
    return custom?.title || 'Section personnalisée';
  }
  return SECTION_LABELS[sec.type] ?? sec.type;
}

export function SectionList() {
  const { data, setSectionOrder, toggleSectionVisibility } = useCVStore();
  const { sectionOrder, customSections } = data;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = sectionOrder.findIndex((s) => s.id === active.id);
      const newIdx = sectionOrder.findIndex((s) => s.id === over.id);
      setSectionOrder(arrayMove(sectionOrder, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 mb-3">
        Glissez-déposez pour réordonner. Cliquez sur l'œil pour masquer/afficher une section sans la supprimer.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((sec) => (
            <SortableItem key={sec.id} id={sec.id}>
              {(handleProps) => (
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 bg-white border rounded-lg ${
                    sec.visible ? 'border-slate-200' : 'border-slate-100 opacity-50'
                  }`}
                >
                  <span
                    {...handleProps}
                    className="cursor-grab text-slate-300 hover:text-slate-500 select-none touch-none"
                    title="Glisser pour réordonner"
                  >
                    ⠿
                  </span>
                  <span className="flex-1 text-sm text-slate-700">
                    {getSectionLabel(sec, customSections)}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    title={sec.visible ? 'Masquer' : 'Afficher'}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {sec.visible ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
