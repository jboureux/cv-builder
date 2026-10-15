import { toast } from 'sonner';
import { useCVStore } from '@/store/useCVStore';
import { useLetterStore, letterLabel } from '@/store/useLetterStore';
import { useUIStore } from '@/store/useUIStore';
import { useConfirm } from './ConfirmProvider';

/** Actions sur les documents partagées entre la sidebar et la barre de menus. */
export function useDocumentActions() {
  const confirm = useConfirm();
  const openDialog = useUIStore((s) => s.openDialog);

  const resetCV = async () => {
    const ok = await confirm({
      title: 'Réinitialiser le CV ?',
      description: 'Toutes vos données seront remplacées par le CV d’exemple. Cette action est irréversible.',
      confirmLabel: 'Réinitialiser',
      destructive: true,
    });
    if (ok) {
      useCVStore.getState().resetData();
      toast.success('CV réinitialisé avec les données d’exemple');
    }
  };

  const newLetter = () => {
    useLetterStore.getState().addLetter();
    toast.success('Nouvelle lettre créée');
  };

  const duplicateLetter = (id: string) => {
    useLetterStore.getState().duplicateLetter(id);
    toast.success('Lettre dupliquée');
  };

  const renameLetter = (id: string) => openDialog('rename-letter', id);

  const removeLetter = async (id: string) => {
    const letter = useLetterStore.getState().letters.find((l) => l.id === id);
    if (!letter) return;
    const label = letterLabel(letter);
    const ok = await confirm({
      title: 'Supprimer cette lettre ?',
      description: `« ${label} » sera définitivement supprimée. Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      destructive: true,
    });
    if (ok) {
      useLetterStore.getState().removeLetter(id);
      toast.success(`« ${label} » supprimée`);
    }
  };

  return { resetCV, newLetter, duplicateLetter, renameLetter, removeLetter };
}
