import { useCVStore } from '@/store/useCVStore';
import { ColorPicker, FontPicker } from '@/components/common/StylePickers';
import { FieldGroup, FieldSeparator } from '@/components/ui/field';

export function ThemePicker() {
  const { data, setTheme } = useCVStore();
  const { theme } = data;

  return (
    <FieldGroup className="gap-6">
      <ColorPicker
        label="Couleur d'accent"
        value={theme.accentColor}
        onChange={(accentColor) => setTheme({ ...theme, accentColor })}
      />
      <FieldSeparator />
      <FontPicker value={theme.fontFamily} onChange={(fontFamily) => setTheme({ ...theme, fontFamily })} />
    </FieldGroup>
  );
}
