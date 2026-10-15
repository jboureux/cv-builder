import { useLetterStore } from '../../store/useLetterStore';
import type { FontFamily } from '../../types/cv';
import type { LetterTheme } from '../../types/letter';
import { RangeField } from './fields';

const PRESET_COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#059669', '#0f766e', '#be123c', '#1e3a5f', '#374151'];

const FONTS: { label: string; value: FontFamily }[] = [
  { label: 'Georgia (Serif)', value: 'georgia' },
  { label: 'Inter (Sans-serif)', value: 'inter' },
  { label: 'Roboto (Sans-serif)', value: 'roboto' },
];

export function LetterStyleForm() {
  const { profile, updateProfile } = useLetterStore();
  const { theme } = profile;
  const set = <K extends keyof LetterTheme>(key: K, value: LetterTheme[K]) =>
    updateProfile({ theme: { ...theme, [key]: value } });

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Couleur du nom
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set('accentColor', c)}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: theme.accentColor === c ? '#0f172a' : 'transparent',
                outline: theme.accentColor === c ? '2px solid white' : 'none',
                outlineOffset: '-3px',
              }}
            />
          ))}
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) => set('accentColor', e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border border-slate-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Police</label>
        <div className="space-y-1.5">
          {FONTS.map((f) => (
            <label key={f.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="letterFont"
                checked={theme.fontFamily === f.value}
                onChange={() => set('fontFamily', f.value)}
                className="accent-slate-700"
              />
              <span className="text-sm text-slate-700">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <RangeField
        label="Taille du texte"
        value={theme.fontSize}
        min={9}
        max={13}
        step={0.5}
        unit="pt"
        onChange={(v) => set('fontSize', v)}
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={theme.justify}
            onChange={(e) => set('justify', e.target.checked)}
            className="accent-blue-600"
          />
          Texte justifié
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={theme.showFoldMarks}
            onChange={(e) => set('showFoldMarks', e.target.checked)}
            className="accent-blue-600"
          />
          Repères de pliage (en trois, enveloppe DL)
        </label>
      </div>
    </div>
  );
}
