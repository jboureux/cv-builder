import { useState, type ReactNode } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useConfirm } from '@/components/app/ConfirmProvider';

interface ItemCardProps {
  title: string;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  /** Libellé de l'élément dans la confirmation de suppression, ex. « cette expérience » */
  removeLabel: string;
  onRemove: () => void;
  children: ReactNode;
}

/** Carte repliable pour un élément de liste (expérience, formation, projet…). */
export function ItemCard({ title, subtitle, defaultOpen, removeLabel, onRemove, children }: ItemCardProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const confirm = useConfirm();

  const handleRemove = async () => {
    const ok = await confirm({
      title: `Supprimer ${removeLabel} ?`,
      description: `« ${title} » sera définitivement retiré de votre CV.`,
      confirmLabel: 'Supprimer',
      destructive: true,
    });
    if (ok) onRemove();
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/item rounded-xl border bg-card text-card-foreground shadow-xs transition-shadow data-open:shadow-sm"
    >
      <div className="flex items-center gap-1 pr-1.5">
        <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open/item:rotate-90" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{title}</span>
            {subtitle && <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>}
          </span>
        </CollapsibleTrigger>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Supprimer"
                onClick={handleRemove}
                className="text-muted-foreground opacity-0 group-hover/item:opacity-100 group-data-open/item:opacity-100 hover:text-destructive focus-visible:opacity-100"
              />
            }
          >
            <Trash2 />
          </TooltipTrigger>
          <TooltipContent>Supprimer</TooltipContent>
        </Tooltip>
      </div>
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="space-y-3 border-t px-3 pt-3 pb-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Bouton pointillé « + Ajouter … » placé en fin de liste. */
export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-10 w-full border-dashed text-muted-foreground shadow-none hover:border-solid hover:text-foreground"
    >
      <Plus />
      {children}
    </Button>
  );
}

/** Courte explication en tête de section. */
export function SectionHint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>;
}
