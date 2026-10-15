import { useId } from 'react';
import { useLetterStore } from '@/store/useLetterStore';
import { RangeField } from '@/components/common/fields';
import { ColorPicker, FontPicker } from '@/components/common/StylePickers';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import type { LetterTheme } from '@/types/letter';

function SwitchField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription className="text-xs">{description}</FieldDescription>
      </FieldContent>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </Field>
  );
}

export function LetterStyleForm() {
  const { profile, updateProfile } = useLetterStore();
  const { theme } = profile;
  const set = <K extends keyof LetterTheme>(key: K, value: LetterTheme[K]) =>
    updateProfile({ theme: { ...theme, [key]: value } });

  return (
    <FieldGroup className="gap-6">
      <ColorPicker label="Couleur du nom" value={theme.accentColor} onChange={(c) => set('accentColor', c)} />
      <FieldSeparator />
      <FontPicker value={theme.fontFamily} onChange={(f) => set('fontFamily', f)} />
      <RangeField
        label="Taille du texte"
        value={theme.fontSize}
        min={9}
        max={13}
        step={0.5}
        unit="pt"
        onChange={(v) => set('fontSize', v)}
      />
      <FieldSeparator />
      <FieldSet className="gap-4">
        <FieldLegend variant="label">Mise en forme</FieldLegend>
        <SwitchField
          label="Texte justifié"
          description="Aligne les paragraphes sur les deux marges."
          checked={theme.justify}
          onChange={(v) => set('justify', v)}
        />
        <SwitchField
          label="Repères de pliage"
          description="Petits traits en marge pour plier en trois (enveloppe DL)."
          checked={theme.showFoldMarks}
          onChange={(v) => set('showFoldMarks', v)}
        />
      </FieldSet>
    </FieldGroup>
  );
}
