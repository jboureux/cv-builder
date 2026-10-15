import { useTheme } from 'next-themes';
import {
  Copy,
  Download,
  Eye,
  FilePlus2,
  FileDown,
  FileUp,
  ListOrdered,
  Palette,
  PenTool,
  Pencil,
  PencilLine,
  RotateCcw,
  Trash2,
  Type,
  UserRound,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useActiveLetter, letterLabel } from '@/store/useLetterStore';
import { useUIStore } from '@/store/useUIStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CV_SECTIONS, LETTER_SECTIONS, MODES } from './navigation';
import { useDocumentActions } from './useDocumentActions';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD_KEY = isMac ? '⌘' : 'Ctrl+';

function FileMenu({ onPrint }: { onPrint: () => void }) {
  const mode = useAppStore((s) => s.mode);
  const openDialog = useUIStore((s) => s.openDialog);
  const letter = useActiveLetter();
  const { resetCV, newLetter, duplicateLetter, renameLetter, removeLetter } = useDocumentActions();

  return (
    <MenubarMenu>
      <MenubarTrigger className="whitespace-nowrap">Fichier</MenubarTrigger>
      <MenubarContent className="w-60">
        {mode === 'letter' && (
          <>
            <MenubarItem onClick={newLetter}>
              <FilePlus2 />
              Nouvelle lettre
            </MenubarItem>
            <MenubarItem onClick={() => duplicateLetter(letter.id)}>
              <Copy />
              Dupliquer la lettre
            </MenubarItem>
            <MenubarItem onClick={() => renameLetter(letter.id)}>
              <Pencil />
              Renommer…
            </MenubarItem>
            <MenubarSeparator />
          </>
        )}
        <MenubarItem onClick={onPrint}>
          <Download />
          Exporter en PDF
          <MenubarShortcut>{MOD_KEY}P</MenubarShortcut>
        </MenubarItem>
        {mode === 'cv' ? (
          <>
            <MenubarSeparator />
            <MenubarItem onClick={() => openDialog('export-data')}>
              <FileDown />
              Exporter les données…
            </MenubarItem>
            <MenubarItem onClick={() => openDialog('import-data')}>
              <FileUp />
              Importer des données…
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive" onClick={resetCV}>
              <RotateCcw />
              Réinitialiser le CV…
            </MenubarItem>
          </>
        ) : (
          <>
            <MenubarSeparator />
            <MenubarItem variant="destructive" onClick={() => removeLetter(letter.id)}>
              <Trash2 />
              Supprimer la lettre…
            </MenubarItem>
          </>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
}

function ViewMenu() {
  const { showEditor, setShowEditor, showPageBreaks, setShowPageBreaks } = useAppStore();
  const { open, toggleSidebar, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <MenubarMenu>
      <MenubarTrigger className="whitespace-nowrap">Affichage</MenubarTrigger>
      <MenubarContent className="w-60">
        {!isMobile && (
          <MenubarCheckboxItem checked={open} onCheckedChange={toggleSidebar}>
            Barre latérale
            <MenubarShortcut>{MOD_KEY}B</MenubarShortcut>
          </MenubarCheckboxItem>
        )}
        <MenubarCheckboxItem checked={showEditor} onCheckedChange={setShowEditor}>
          Panneau d'édition
          <MenubarShortcut>{MOD_KEY}E</MenubarShortcut>
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={showPageBreaks} onCheckedChange={setShowPageBreaks}>
          Repères de saut de page
        </MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Apparence</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarRadioGroup value={theme ?? 'system'} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Clair</MenubarRadioItem>
              <MenubarRadioItem value="dark">Sombre</MenubarRadioItem>
              <MenubarRadioItem value="system">Système</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  );
}

function LayoutMenu() {
  const mode = useAppStore((s) => s.mode);
  const openSettings = useUIStore((s) => s.openSettings);

  return (
    <MenubarMenu>
      <MenubarTrigger className="whitespace-nowrap">Mise en page</MenubarTrigger>
      <MenubarContent className="w-60">
        {mode === 'cv' ? (
          <>
            <MenubarItem onClick={() => openSettings('cv-theme')}>
              <Palette />
              Couleur & police…
            </MenubarItem>
            <MenubarItem onClick={() => openSettings('cv-sections')}>
              <ListOrdered />
              Ordre des sections…
            </MenubarItem>
          </>
        ) : (
          <>
            <MenubarItem onClick={() => openSettings('letter-sender')}>
              <UserRound />
              Expéditeur & logo…
            </MenubarItem>
            <MenubarItem onClick={() => openSettings('letter-signature')}>
              <PenTool />
              Signature…
            </MenubarItem>
            <MenubarItem onClick={() => openSettings('letter-style')}>
              <Type />
              Style du document…
            </MenubarItem>
          </>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
}

function Location() {
  const { mode, cvSection, letterSection } = useAppStore();
  const letter = useActiveLetter();
  const section =
    mode === 'cv'
      ? CV_SECTIONS.find((s) => s.id === cvSection)
      : LETTER_SECTIONS.find((s) => s.id === letterSection);

  return (
    <Breadcrumb className="min-w-0 max-md:hidden">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="shrink-0">{MODES[mode].label}</BreadcrumbItem>
        {mode === 'letter' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <span className="truncate">{letterLabel(letter)}</span>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbPage>{section?.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Sur mobile, bascule entre le formulaire et l'aperçu du document. */
function MobileViewToggle() {
  const { showEditor, setShowEditor } = useAppStore();
  return (
    <Button
      variant="outline"
      size="sm"
      className="md:hidden max-sm:size-7 max-sm:px-0"
      aria-label={showEditor ? 'Aperçu' : 'Éditer'}
      onClick={() => setShowEditor(!showEditor)}
    >
      {showEditor ? <Eye /> : <PencilLine />}
      <span className="max-sm:hidden">{showEditor ? 'Aperçu' : 'Éditer'}</span>
    </Button>
  );
}

export function AppHeader({ onPrint }: { onPrint: () => void }) {
  return (
    <header className="no-print flex h-12 shrink-0 items-center gap-1 border-b px-2 sm:gap-2 sm:px-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-center max-sm:hidden" />
      <Menubar className="h-8 border-none bg-transparent p-0 shadow-none">
        <FileMenu onPrint={onPrint} />
        <ViewMenu />
        <LayoutMenu />
      </Menubar>
      <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-center max-md:hidden" />
      <Location />
      <div className="ml-auto flex items-center gap-2">
        <MobileViewToggle />
        <Tooltip>
          <TooltipTrigger render={<Button size="sm" onClick={onPrint} aria-label="Exporter PDF" className="max-sm:size-7 max-sm:px-0" />}>
            <Download />
            <span className="max-sm:hidden">Exporter PDF</span>
          </TooltipTrigger>
          <TooltipContent>
            <KbdGroup>
              <Kbd>{MOD_KEY.replace('+', '')}</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
