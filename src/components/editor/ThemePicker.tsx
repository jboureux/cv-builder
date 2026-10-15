import { useCVStore } from '../../store/useCVStore';
import type { FontFamily } from '../../types/cv';

const PRESET_COLORS = [
  { label: 'Bleu', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Émeraude', value: '#059669' },
  { label: 'Ardoise', value: '#0f766e' },
  { label: 'Bordeaux', value: '#be123c' },
  { label: 'Ardoise foncé', value: '#1e3a5f' },
  { label: 'Graphite', value: '#374151' },
];

const FONTS: { label: string; value: FontFamily }[] = [
  { label: 'Inter (Sans-serif)', value: 'inter' },
  { label: 'Roboto (Sans-serif)', value: 'roboto' },
  { label: 'Georgia (Serif)', value: 'georgia' },
];

export function ThemePicker() {
  const { data, setTheme } = useCVStore();
  const { theme } = data;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Couleur d'accent
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setTheme({ ...theme, accentColor: c.value })}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c.value,
                borderColor: theme.accentColor === c.value ? '#0f172a' : 'transparent',
                outline: theme.accentColor === c.value ? '2px solid white' : 'none',
                outlineOffset: '-3px',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-slate-200"
          />
          <span className="text-sm text-slate-500">Couleur personnalisée</span>
          <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {theme.accentColor}
          </code>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Police
        </label>
        <div className="space-y-1.5">
          {FONTS.map((f) => (
            <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="fontFamily"
                value={f.value}
                checked={theme.fontFamily === f.value}
                onChange={() => setTheme({ ...theme, fontFamily: f.value })}
                className="accent-slate-700"
              />
              <span className="text-sm text-slate-700">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
