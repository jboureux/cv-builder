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
import { GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SortableItem } from './SortableItem';

interface Bullet {
  id: string;
  text: string;
}

interface Props<T extends Bullet> {
  bullets: T[];
  onChange: (bullets: T[]) => void;
  placeholder?: string;
}

/** Liste de points clés éditables et réordonnables par glisser-déposer. */
export function BulletList<T extends Bullet>({ bullets, onChange, placeholder }: Props<T>) {
  const add = () => onChange([...bullets, { id: crypto.randomUUID(), text: '' } as T]);
  const remove = (id: string) => onChange(bullets.filter((b) => b.id !== id));
  const update = (id: string, text: string) => onChange(bullets.map((b) => (b.id === id ? { ...b, text } : b)));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
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
                <div className="group/bullet flex items-start gap-1">
                  <span
                    {...handleProps}
                    title="Glisser pour réordonner"
                    className="flex h-8 w-4 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
                  >
                    <GripVertical className="size-3.5" />
                  </span>
                  <Textarea
                    rows={1}
                    value={b.text}
                    onChange={(e) => update(b.id, e.target.value)}
                    // un point = une ligne : Entrée ne crée pas de retour à la ligne
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder={placeholder}
                    className="min-h-8 resize-none py-1.5"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Retirer ce point"
                    onClick={() => remove(b.id)}
                    className="text-muted-foreground opacity-0 group-hover/bullet:opacity-100 hover:text-destructive focus-visible:opacity-100"
                  >
                    <X />
                  </Button>
                </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button type="button" variant="ghost" size="xs" onClick={add} className="ml-4 text-muted-foreground">
        <Plus />
        Ajouter un point
      </Button>
    </div>
  );
}
