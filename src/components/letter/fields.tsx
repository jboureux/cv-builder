import { useRef, useState, type ReactNode } from 'react';
import { fileToDataURL } from '../../lib/image';

const INPUT_CLASS =
  'w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
        {hint && <span className="ml-2 text-slate-400 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

interface TextProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextField({ label, hint, value, onChange, placeholder, rows }: TextProps) {
  return (
    <Field label={label} hint={hint}>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${INPUT_CLASS} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={INPUT_CLASS}
        />
      )}
    </Field>
  );
}

interface RangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}

export function RangeField({ label, value, min, max, step = 1, unit, onChange }: RangeProps) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <span className="w-14 text-right text-xs text-slate-500 tabular-nums">
          {value} {unit}
        </span>
      </div>
    </Field>
  );
}

interface ImageProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  removeWhiteOption?: boolean;
}

export function ImageUpload({ label, value, onChange, removeWhiteOption }: ImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [removeWhite, setRemoveWhite] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      onChange(await fileToDataURL(file, { removeWhite: removeWhiteOption && removeWhite }));
    } catch {
      setError("Impossible de lire cette image.");
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Field label={label}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-lg bg-white"
      >
        <div className="w-24 h-14 shrink-0 flex items-center justify-center rounded bg-[repeating-conic-gradient(#f1f5f9_0_25%,white_0_50%)] bg-[length:12px_12px] overflow-hidden">
          {value ? (
            <img src={value} alt="" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-[10px] text-slate-400">Aucune image</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {value ? 'Remplacer…' : 'Importer une image…'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Retirer
            </button>
          )}
          <span className="text-[10px] text-slate-400">PNG, JPG ou SVG · glisser-déposer possible</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {removeWhiteOption && (
        <label className="mt-2 flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={removeWhite}
            onChange={(e) => setRemoveWhite(e.target.checked)}
            className="accent-blue-600"
          />
          Rendre le fond blanc transparent à l'import (signature scannée)
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </Field>
  );
}
