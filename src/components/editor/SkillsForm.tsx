import { Trash2 } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { TagInput } from '@/components/common/TagInput';
import { AddButton } from '@/components/common/ItemCard';
import { useConfirm } from '@/components/app/ConfirmProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SkillCategory } from '@/types/cv';

export function SkillsForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useCVStore();
  const confirm = useConfirm();

  const add = () => addSkillCategory({ id: crypto.randomUUID(), name: '', skills: [] });

  const update = (cat: SkillCategory, patch: Partial<SkillCategory>) => updateSkillCategory(cat.id, { ...cat, ...patch });

  const remove = async (cat: SkillCategory) => {
    if (cat.skills.length === 0 && !cat.name) return removeSkillCategory(cat.id);
    const ok = await confirm({
      title: 'Supprimer cette catégorie ?',
      description: `« ${cat.name || 'Sans nom'} » et ses ${cat.skills.length} compétence(s) seront retirées du CV.`,
      confirmLabel: 'Supprimer',
      destructive: true,
    });
    if (ok) removeSkillCategory(cat.id);
  };

  return (
    <div className="space-y-2.5">
      {data.skillCategories.map((cat) => (
        <div key={cat.id} className="group/cat space-y-2 rounded-xl border bg-card p-3 shadow-xs">
          <div className="flex items-center gap-1">
            <Input
              value={cat.name}
              onChange={(e) => update(cat, { name: e.target.value })}
              placeholder="Langages, Frameworks…"
              aria-label="Nom de la catégorie"
              className="border-transparent px-1.5 font-medium shadow-none hover:border-input dark:bg-transparent"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Supprimer la catégorie"
              onClick={() => remove(cat)}
              className="text-muted-foreground opacity-0 group-hover/cat:opacity-100 hover:text-destructive focus-visible:opacity-100"
            >
              <Trash2 />
            </Button>
          </div>
          <TagInput
            tags={cat.skills}
            onChange={(skills) => update(cat, { skills })}
            placeholder="Ajouter une compétence (Entrée)"
          />
        </div>
      ))}
      <AddButton onClick={add}>Ajouter une catégorie</AddButton>
    </div>
  );
}
