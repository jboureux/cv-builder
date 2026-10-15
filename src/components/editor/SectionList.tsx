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
import { BriefcaseBusiness, GraduationCap, GripVertical, LayoutList, Rocket, Sparkles, type LucideIcon } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { SortableItem } from '@/components/common/SortableItem';
import { SectionHint } from '@/components/common/ItemCard';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { CVSection, SectionType } from '@/types/cv';

const SECTION_META: Record<SectionType, { label: string; icon: LucideIcon }> = {
  experience: { label: 'Expérience professionnelle', icon: BriefcaseBusiness },
  skills: { label: 'Compétences techniques', icon: Sparkles },
  education: { label: 'Formation', icon: GraduationCap },
  projects: { label: 'Projets & Open Source', icon: Rocket },
  custom: { label: 'Section personnalisée', icon: LayoutList },
};

function getSectionLabel(sec: CVSection, customSections: { id: string; title: string }[]) {
  if (sec.type === 'custom') {
    const custom = customSections.find((c) => c.id === sec.customId);
    return custom?.title || SECTION_META.custom.label;
  }
  return SECTION_META[sec.type]?.label ?? sec.type;
}

export function SectionList() {
  const { data, setSectionOrder, toggleSectionVisibility } = useCVStore();
  const { sectionOrder, customSections } = data;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIdx = sectionOrder.findIndex((s) => s.id === active.id);
      const newIdx = sectionOrder.findIndex((s) => s.id === over.id);
      setSectionOrder(arrayMove(sectionOrder, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <SectionHint>
        Glissez-déposez pour réordonner. Désactivez une section pour la masquer du CV sans perdre son contenu.
      </SectionHint>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {sectionOrder.map((sec) => {
              const Icon = SECTION_META[sec.type]?.icon ?? LayoutList;
              const label = getSectionLabel(sec, customSections);
              return (
                <SortableItem key={sec.id} id={sec.id}>
                  {(handleProps) => (
                    <div
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border bg-card py-2 pr-3 pl-1.5 shadow-xs transition-opacity',
                        !sec.visible && 'opacity-55'
                      )}
                    >
                      <span
                        {...handleProps}
                        title="Glisser pour réordonner"
                        className="flex h-7 w-5 cursor-grab touch-none items-center justify-center text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
                      >
                        <GripVertical className="size-4" />
                      </span>
                      <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="flex-1 truncate text-sm">{label}</span>
                      <Switch
                        size="sm"
                        checked={sec.visible}
                        onCheckedChange={() => toggleSectionVisibility(sec.id)}
                        aria-label={sec.visible ? `Masquer ${label}` : `Afficher ${label}`}
                      />
                    </div>
                  )}
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
