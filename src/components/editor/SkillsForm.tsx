import { useCVStore } from '../../store/useCVStore';
import { TagInput } from '../ui/TagInput';
import type { SkillCategory } from '../../types/cv';

export function SkillsForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useCVStore();

  const add = () =>
    addSkillCategory({ id: crypto.randomUUID(), name: '', skills: [] });

  const update = (id: string, key: keyof SkillCategory, value: unknown) => {
    const cat = data.skillCategories.find((c) => c.id === id)!;
    updateSkillCategory(id, { ...cat, [key]: value });
  };

  return (
    <div className="space-y-3">
      {data.skillCategories.map((cat) => (
        <div key={cat.id} className="border border-slate-200 rounded-lg bg-white p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cat.name}
              onChange={(e) => update(cat.id, 'name', e.target.value)}
              placeholder="Ex: Langages, Frameworks..."
              className="flex-1 px-2.5 py-1.5 text-sm font-medium border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            />
            <button
              type="button"
              onClick={() => removeSkillCategory(cat.id)}
              className="text-slate-300 hover:text-red-400 text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
          <TagInput
            tags={cat.skills}
            onChange={(skills) => update(cat.id, 'skills', skills)}
            placeholder="Ajouter une compétence (Entrée)"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        + Ajouter une catégorie
      </button>
    </div>
  );
}
