import { useState } from 'react';
import { useCVStore } from '../../store/useCVStore';
import type { Education } from '../../types/cv';

const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  details: '',
});

function EducationCard({
  edu,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  onUpdate: (e: Education) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(!edu.institution);
  const set = (key: keyof Education, value: string) => onUpdate({ ...edu, [key]: value });

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">
            {edu.institution || 'Nouvel établissement'}
          </span>
          {edu.field && (
            <span className="text-sm text-slate-500"> — {edu.field}</span>
          )}
          {edu.endDate && (
            <span className="ml-2 text-xs text-slate-400">{edu.endDate}</span>
          )}
        </div>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Établissement</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => set('institution', e.target.value)}
                placeholder="INSA Lyon"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Diplôme</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => set('degree', e.target.value)}
                placeholder="Master, Ingénieur..."
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Domaine</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => set('field', e.target.value)}
                placeholder="Informatique"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Début</label>
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                placeholder="2013"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fin</label>
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                placeholder="2018"
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Détails / spécialisation</label>
            <textarea
              value={edu.details}
              onChange={(e) => set('details', e.target.value)}
              rows={2}
              placeholder="Spécialisation en systèmes distribués..."
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white resize-y"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-600 font-medium"
          >
            Supprimer cette formation
          </button>
        </div>
      )}
    </div>
  );
}

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useCVStore();

  return (
    <div className="space-y-3">
      {data.educations.map((edu) => (
        <EducationCard
          key={edu.id}
          edu={edu}
          onUpdate={(e) => updateEducation(edu.id, e)}
          onRemove={() => removeEducation(edu.id)}
        />
      ))}
      <button
        type="button"
        onClick={() => addEducation(emptyEducation())}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        + Ajouter une formation
      </button>
    </div>
  );
}
