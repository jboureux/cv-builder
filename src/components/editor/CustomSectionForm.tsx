import { useState } from 'react';
import { useCVStore } from '../../store/useCVStore';
import type { CustomSection } from '../../types/cv';

function CustomCard({
  sec,
  onUpdate,
  onRemove,
}: {
  sec: CustomSection;
  onUpdate: (s: CustomSection) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(!sec.title);
  const set = (key: keyof CustomSection, value: string) => onUpdate({ ...sec, [key]: value });

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800">
          {sec.title || 'Nouvelle section'}
        </span>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Titre de la section</label>
            <input
              type="text"
              value={sec.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Certifications, Langues, Bénévolat..."
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Contenu <span className="text-slate-400 font-normal">(une ligne = un point de liste)</span>
            </label>
            <textarea
              value={sec.content}
              onChange={(e) => set('content', e.target.value)}
              rows={5}
              placeholder={`AWS Certified Solutions Architect (2024)\nAnglais — Courant (TOEIC 945)\nEspagnol — Intermédiaire (B2)`}
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white resize-y font-mono"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-600 font-medium"
          >
            Supprimer cette section
          </button>
        </div>
      )}
    </div>
  );
}

export function CustomSectionForm() {
  const { data, addCustomSection, updateCustomSection, removeCustomSection, setSectionOrder } = useCVStore();

  const add = () => {
    const id = crypto.randomUUID();
    addCustomSection({ id, title: '', content: '' });
    setSectionOrder([
      ...data.sectionOrder,
      { id: `sec-custom-${id}`, type: 'custom', customId: id, visible: true },
    ]);
  };

  const remove = (id: string) => {
    removeCustomSection(id);
    setSectionOrder(data.sectionOrder.filter((s) => s.customId !== id));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Ajoutez des sections libres : certifications, langues, bénévolat, etc.
      </p>
      {data.customSections.map((sec) => (
        <CustomCard
          key={sec.id}
          sec={sec}
          onUpdate={(s) => updateCustomSection(sec.id, s)}
          onRemove={() => remove(sec.id)}
        />
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        + Ajouter une section personnalisée
      </button>
    </div>
  );
}
