import { useLetterStore, useActiveLetter, letterLabel } from '../../store/useLetterStore';
import { TextField } from './fields';

const formatUpdated = (ts: number) =>
  new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export function LetterListForm() {
  const { letters, activeId, setActive, addLetter, duplicateLetter, removeLetter, updateLetter } = useLetterStore();
  const active = useActiveLetter();

  const handleRemove = (id: string, label: string) => {
    if (confirm(`Supprimer la lettre « ${label} » ? Cette action est irréversible.`)) removeLetter(id);
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Nom de la lettre active"
        hint="(usage interne, non imprimé)"
        value={active.title}
        onChange={(title) => updateLetter(active.id, { ...active, title })}
        placeholder="Candidature – Nom de l'entreprise"
      />

      <button
        type="button"
        onClick={addLetter}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg transition-colors font-medium"
      >
        + Nouvelle lettre
      </button>

      <ul className="space-y-2">
        {letters.map((l) => {
          const isActive = l.id === activeId;
          const label = letterLabel(l);
          return (
            <li
              key={l.id}
              className={`rounded-lg border bg-white transition-colors ${
                isActive ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button type="button" onClick={() => setActive(l.id)} className="w-full text-left px-3 pt-2.5 pb-1">
                <span className="block text-sm font-semibold text-slate-800 truncate">{label}</span>
                <span className="block text-xs text-slate-400 truncate">
                  {[l.recipient.company, `modifiée le ${formatUpdated(l.updatedAt)}`].filter(Boolean).join(' · ')}
                </span>
              </button>
              <div className="flex gap-3 px-3 pb-2">
                <button
                  type="button"
                  onClick={() => duplicateLetter(l.id)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Dupliquer
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(l.id, label)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  Supprimer
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
