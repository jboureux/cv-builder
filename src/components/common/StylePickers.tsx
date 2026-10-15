import { useId } from 'react';
import { Check } from 'lucide-react';
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FONT_STACKS } from '@/lib/fonts';
import type { FontFamily } from '@/types/cv';

const PRESET_COLORS = [
  { label: 'Bleu', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Émeraude', value: '#059669' },
  { label: 'Sarcelle', value: '#0f766e' },
  { label: 'Bordeaux', value: '#be123c' },
  { label: 'Marine', value: '#1e3a5f' },
  { label: 'Graphite', value: '#374151' },
];

const FONTS: { value: FontFamily; label: string; description: string }[] = [
  { value: 'inter', label: 'Inter', description: 'Sans-serif moderne et lisible' },
  { value: 'roboto', label: 'Roboto', description: 'Sans-serif neutre et compacte' },
  { value: 'georgia', label: 'Georgia', description: 'Serif classique, idéale pour les lettres' },
];

export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const isCustom = !PRESET_COLORS.some((c) => c.value === value);

  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label">{label}</FieldLegend>
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESET_COLORS.map((c) => {
          const selected = c.value === value;
          return (
            <button
              key={c.value}
              type="button"
              title={c.label}
              aria-label={c.label}
              aria-pressed={selected}
              onClick={() => onChange(c.value)}
              className="flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-foreground/70"
              style={{ backgroundColor: c.value }}
            >
              {selected && <Check className="size-3.5 text-white" strokeWidth={3} />}
            </button>
          );
        })}
        <label
          title="Couleur personnalisée"
          data-selected={isCustom || undefined}
          className="relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[conic-gradient(#ef4444,#f59e0b,#22c55e,#06b6d4,#6366f1,#d946ef,#ef4444)] ring-offset-2 ring-offset-background transition-transform hover:scale-110 data-selected:ring-2 data-selected:ring-foreground/70"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          {isCustom && <span className="size-3.5 rounded-full ring-2 ring-white" style={{ backgroundColor: value }} />}
        </label>
      </div>
      <FieldDescription className="text-xs">
        Couleur actuelle <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{value}</code>
      </FieldDescription>
    </FieldSet>
  );
}

export function FontPicker({ value, onChange }: { value: FontFamily; onChange: (font: FontFamily) => void }) {
  const baseId = useId();

  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label">Police</FieldLegend>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as FontFamily)} className="gap-2">
        {FONTS.map((f) => (
          <FieldLabel key={f.value} htmlFor={`${baseId}-${f.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle className="text-base" style={{ fontFamily: FONT_STACKS[f.value] }}>
                  {f.label}
                </FieldTitle>
                <FieldDescription className="text-xs">{f.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={f.value} id={`${baseId}-${f.value}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
