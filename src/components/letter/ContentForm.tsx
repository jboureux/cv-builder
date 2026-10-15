import { CalendarCheck } from 'lucide-react';
import { useLetterStore, useActiveLetter, formatLetterDate } from '@/store/useLetterStore';
import { TextField } from '@/components/common/fields';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/types/letter';

type TextKey = 'place' | 'date' | 'subject' | 'salutation' | 'body' | 'closing';

export function ContentForm() {
  const updateLetter = useLetterStore((s) => s.updateLetter);
  const letter = useActiveLetter();

  const update = (key: TextKey, value: string) => updateLetter(letter.id, { ...letter, [key]: value } as CoverLetter);
  const words = letter.body.trim() ? letter.body.trim().split(/\s+/).length : 0;
  const inRange = words >= 250 && words <= 400;

  return (
    <FieldGroup className="gap-6">
      <FieldSet className="gap-3">
        <FieldLegend variant="label">En-tête</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Lieu" value={letter.place} onChange={(v) => update('place', v)} placeholder="Paris" />
          <div className="relative">
            <TextField
              label="Date"
              value={letter.date}
              onChange={(v) => update('date', v)}
              placeholder={formatLetterDate()}
              inputClassName="pr-8"
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Date du jour"
                    onClick={() => update('date', formatLetterDate())}
                    className="absolute right-1 bottom-1 text-muted-foreground"
                  />
                }
              >
                <CalendarCheck />
              </TooltipTrigger>
              <TooltipContent>Date du jour</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <TextField
          label="Objet"
          value={letter.subject}
          onChange={(v) => update('subject', v)}
          placeholder="Candidature au poste de…"
        />
      </FieldSet>

      <FieldSet className="gap-3">
        <FieldLegend variant="label">Lettre</FieldLegend>
        <TextField
          label="Formule d'appel"
          value={letter.salutation}
          onChange={(v) => update('salutation', v)}
          placeholder="Madame, Monsieur,"
        />
        <TextField
          label="Corps de la lettre"
          hint="ligne vide = nouveau paragraphe"
          value={letter.body}
          onChange={(v) => update('body', v)}
          rows={16}
          placeholder="Vous / Moi / Nous : présentez ce qui vous attire dans l'entreprise, ce que vous apportez, et ce que vous construirez ensemble."
          inputClassName="leading-relaxed"
          description={
            <>
              <span className={cn('font-medium tabular-nums', inRange ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground')}>
                {words} mots
              </span>{' '}
              — idéalement entre 250 et 400
            </>
          }
        />
        <TextField label="Formule de politesse" value={letter.closing} onChange={(v) => update('closing', v)} rows={3} />
      </FieldSet>
    </FieldGroup>
  );
}
