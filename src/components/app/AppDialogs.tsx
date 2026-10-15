import { useId, useState } from 'react';
import { Check, ClipboardPaste, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCVStore, encodeCVData, decodeCVData } from '@/store/useCVStore';
import { useLetterStore } from '@/store/useLetterStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CODE_CLASS = 'h-40 max-h-40 resize-none break-all font-mono text-xs md:text-xs [field-sizing:fixed]';

function ExportDataDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const data = useCVStore((s) => s.data);
  const [copied, setCopied] = useState(false);
  const code = open ? encodeCVData(data) : '';
  const id = useId();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Données copiées dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copie impossible : sélectionnez le texte et copiez-le manuellement.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Exporter les données du CV</DialogTitle>
          <DialogDescription>
            Cette chaîne contient l'intégralité de votre CV. Conservez-la pour le restaurer plus tard ou sur un autre
            navigateur.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={id} className="sr-only">
            Chaîne d'export
          </FieldLabel>
          <Textarea
            id={id}
            readOnly
            value={code}
            onFocus={(e) => e.currentTarget.select()}
            className={CODE_CLASS}
          />
          <FieldDescription className="text-xs">{Math.round(code.length / 1024)} Ko · format CV1</FieldDescription>
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Fermer</DialogClose>
          <Button onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copié' : 'Copier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportDataDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <ImportDataForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

/** Monté à chaque ouverture du dialogue : l'état repart de zéro. */
function ImportDataForm({ onDone }: { onDone: () => void }) {
  const importData = useCVStore((s) => s.importData);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const pasteFromClipboard = async () => {
    try {
      setCode(await navigator.clipboard.readText());
      setError(null);
    } catch {
      toast.error('Accès au presse-papier refusé : collez la chaîne manuellement (⌘V).');
    }
  };

  const submit = () => {
    try {
      importData(decodeCVData(code));
      onDone();
      toast.success('Données restaurées');
    } catch {
      setError("Cette chaîne n'est pas une sauvegarde de CV valide.");
    }
  };

  return (
    <form
      className="contents"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <DialogHeader>
        <DialogTitle>Importer des données</DialogTitle>
        <DialogDescription>
          Collez une chaîne exportée précédemment. Elle <strong>remplacera</strong> l'ensemble de votre CV actuel.
        </DialogDescription>
      </DialogHeader>
      <Field data-invalid={!!error}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={id}>Chaîne d'import</FieldLabel>
          <Button type="button" variant="ghost" size="xs" onClick={pasteFromClipboard}>
            <ClipboardPaste />
            Coller
          </Button>
        </div>
        <Textarea
          id={id}
          autoFocus
          value={code}
          aria-invalid={!!error}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="CV1:eyJwZXJzb25hbEluZm8iOnsi…"
          className={CODE_CLASS}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Annuler</DialogClose>
        <Button type="submit" disabled={!code.trim()}>
          Remplacer mes données
        </Button>
      </DialogFooter>
    </form>
  );
}

function RenameLetterDialog({
  open,
  letterId,
  onOpenChange,
}: {
  open: boolean;
  letterId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {letterId && <RenameLetterForm letterId={letterId} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function RenameLetterForm({ letterId, onDone }: { letterId: string; onDone: () => void }) {
  const letter = useLetterStore((s) => s.letters.find((l) => l.id === letterId));
  const updateLetter = useLetterStore((s) => s.updateLetter);
  const [title, setTitle] = useState(letter?.title ?? '');
  const id = useId();

  return (
    <form
      className="contents"
      onSubmit={(e) => {
        e.preventDefault();
        if (letter) updateLetter(letter.id, { ...letter, title: title.trim() });
        onDone();
      }}
    >
      <DialogHeader>
        <DialogTitle>Renommer la lettre</DialogTitle>
        <DialogDescription>Ce nom sert uniquement à retrouver la lettre ; il n'est pas imprimé.</DialogDescription>
      </DialogHeader>
      <Field>
        <FieldLabel htmlFor={id}>Nom</FieldLabel>
        <Input
          id={id}
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={letter?.recipient.company ? `Candidature – ${letter.recipient.company}` : "Candidature – Nom de l'entreprise"}
        />
      </Field>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Annuler</DialogClose>
        <Button type="submit">Enregistrer</Button>
      </DialogFooter>
    </form>
  );
}

/** Dialogues globaux pilotés par `useUIStore`. */
export function AppDialogs() {
  const { dialog, dialogLetterId, closeDialog } = useUIStore();
  const onOpenChange = (open: boolean) => !open && closeDialog();

  return (
    <>
      <ExportDataDialog open={dialog === 'export-data'} onOpenChange={onOpenChange} />
      <ImportDataDialog open={dialog === 'import-data'} onOpenChange={onOpenChange} />
      <RenameLetterDialog open={dialog === 'rename-letter'} letterId={dialogLetterId} onOpenChange={onOpenChange} />
    </>
  );
}
