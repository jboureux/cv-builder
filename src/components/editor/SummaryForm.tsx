import { useCVStore } from '../../store/useCVStore';

export function SummaryForm() {
  const { data, setSummary } = useCVStore();

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        Résumé professionnel
        <span className="ml-2 text-slate-400 font-normal">(affiché sous le titre)</span>
      </label>
      <textarea
        value={data.summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={6}
        placeholder="Tech Lead avec X ans d'expérience..."
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white resize-y"
      />
      <p className="mt-1 text-xs text-slate-400">
        {data.summary.length} caractères — idéalement entre 200 et 400
      </p>
    </div>
  );
}
