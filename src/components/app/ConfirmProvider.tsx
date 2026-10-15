import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Action irréversible : bouton rouge et icône d'avertissement */
  destructive?: boolean;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/** Fournit `useConfirm()`, remplaçant asynchrone de `window.confirm` basé sur AlertDialog. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [open, setOpen] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((opts) => {
    resolver.current?.(false);
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={(next) => !next && settle(false)}>
        {options && (
          <AlertDialogContent>
            <AlertDialogHeader>
              {options.destructive && (
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <TriangleAlert />
                </AlertDialogMedia>
              )}
              <AlertDialogTitle>{options.title}</AlertDialogTitle>
              {options.description && <AlertDialogDescription>{options.description}</AlertDialogDescription>}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{options.cancelLabel ?? 'Annuler'}</AlertDialogCancel>
              <AlertDialogAction
                variant={options.destructive ? 'destructive' : 'default'}
                onClick={() => settle(true)}
              >
                {options.confirmLabel ?? 'Confirmer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm doit être utilisé dans un ConfirmProvider');
  return confirm;
}
