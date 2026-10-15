import { useId, useRef, useState, type ReactNode } from 'react';
import { ImageUp, Trash2 } from 'lucide-react';
import { fileToDataURL } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextProps {
  label: string;
  hint?: string;
  description?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Si défini, affiche une zone de texte d'au moins `rows` lignes */
  rows?: number;
  type?: string;
  className?: string;
  inputClassName?: string;
}

export function TextField({
  label,
  hint,
  description,
  value,
  onChange,
  placeholder,
  rows,
  type = 'text',
  className,
  inputClassName,
}: TextProps) {
  const id = useId();
  return (
    <Field className={cn('gap-1.5', className)}>
      <FieldLabel htmlFor={id} className="text-xs text-muted-foreground">
        {label}
        {hint && <span className="font-normal text-muted-foreground/70">{hint}</span>}
      </FieldLabel>
      {rows ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: `${rows * 1.4 + 1}rem` }}
          className={cn('resize-y', inputClassName)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClassName}
        />
      )}
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
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
    <Field className="gap-2.5">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
        <span className="text-xs font-medium tabular-nums">
          {value} {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
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
  const checkboxId = useId();
  const [removeWhite, setRemoveWhite] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      onChange(await fileToDataURL(file, { removeWhite: removeWhiteOption && removeWhite }));
    } catch {
      setError('Impossible de lire cette image.');
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Field className="gap-1.5">
      <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          'flex items-center gap-3 rounded-xl border border-dashed p-3 transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-input'
        )}
      >
        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-[repeating-conic-gradient(var(--muted)_0_25%,var(--background)_0_50%)] bg-size-[12px_12px]">
          {value ? (
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <ImageUp className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <div className="flex gap-1.5">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              {value ? 'Remplacer' : 'Importer'}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Retirer l'image"
                onClick={() => onChange(null)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">PNG, JPG ou SVG · glisser-déposer</span>
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
        <div className="flex items-start gap-2 pt-1">
          <Checkbox id={checkboxId} checked={removeWhite} onCheckedChange={setRemoveWhite} className="mt-px" />
          <Label htmlFor={checkboxId} className="text-xs leading-snug font-normal text-muted-foreground">
            Rendre le fond blanc transparent à l'import (signature scannée)
          </Label>
        </div>
      )}
      {error && <FieldError className="text-xs">{error}</FieldError>}
    </Field>
  );
}
