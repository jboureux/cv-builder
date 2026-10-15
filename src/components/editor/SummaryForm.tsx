import { useCVStore } from '@/store/useCVStore';
import { TextField } from '@/components/common/fields';
import { FieldLegend, FieldSet } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export function SummaryForm() {
  const { data, setSummary } = useCVStore();
  const length = data.summary.length;
  const inRange = length >= 200 && length <= 400;

  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label">Résumé professionnel</FieldLegend>
      <TextField
        label="Accroche"
        hint="affichée sous le titre"
        value={data.summary}
        onChange={setSummary}
        rows={6}
        placeholder="Tech Lead avec X ans d'expérience..."
        description={
          <>
            <span className={cn('font-medium tabular-nums', inRange ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground')}>
              {length} caractères
            </span>{' '}
            — idéalement entre 200 et 400
          </>
        }
      />
    </FieldSet>
  );
}
