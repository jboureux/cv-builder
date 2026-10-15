import { Copy, FileText, MoreHorizontal, Pencil, Plus, Settings2, Trash2 } from 'lucide-react';
import { useAppStore, type AppMode } from '@/store/useAppStore';
import { useLetterStore, letterLabel } from '@/store/useLetterStore';
import { useCVStore } from '@/store/useCVStore';
import { useUIStore } from '@/store/useUIStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CV_SECTIONS, LETTER_SECTIONS, MODES } from './navigation';
import { useDocumentActions } from './useDocumentActions';

const formatUpdated = (ts: number) =>
  new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function LettersGroup() {
  const { letters, activeId, setActive } = useLetterStore();
  const { newLetter, duplicateLetter, renameLetter, removeLetter } = useDocumentActions();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Mes lettres</SidebarGroupLabel>
      <Tooltip>
        <TooltipTrigger render={<SidebarGroupAction onClick={newLetter} />}>
          <Plus />
          <span className="sr-only">Nouvelle lettre</span>
        </TooltipTrigger>
        <TooltipContent side="right">Nouvelle lettre</TooltipContent>
      </Tooltip>
      <SidebarGroupContent>
        <SidebarMenu>
          {letters.map((l) => {
            const label = letterLabel(l);
            return (
              <SidebarMenuItem key={l.id}>
                <SidebarMenuButton
                  isActive={l.id === activeId}
                  onClick={() => {
                    setActive(l.id);
                    if (isMobile) setOpenMobile(false);
                  }}
                  className="h-auto py-1.5"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{label}</span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {formatUpdated(l.updatedAt)}
                    </span>
                  </span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<SidebarMenuAction showOnHover className="top-1/2! -translate-y-1/2" />}>
                    <MoreHorizontal />
                    <span className="sr-only">Actions pour {label}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align={isMobile ? 'end' : 'start'} className="w-44">
                    <DropdownMenuItem onClick={() => renameLetter(l.id)}>
                      <Pencil />
                      Renommer…
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateLetter(l.id)}>
                      <Copy />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => removeLetter(l.id)}>
                      <Trash2 />
                      Supprimer…
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { mode, setMode, cvSection, letterSection, setCVSection, setLetterSection } = useAppStore();
  const letterCount = useLetterStore((s) => s.letters.length);
  const fullName = useCVStore((s) => s.data.personalInfo.fullName);
  const openSettings = useUIStore((s) => s.openSettings);
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnMobile = () => isMobile && setOpenMobile(false);
  const sections = mode === 'cv' ? CV_SECTIONS : LETTER_SECTIONS;
  const activeSection = mode === 'cv' ? cvSection : letterSection;

  return (
    <Sidebar variant="inset" collapsible="icon" className="no-print">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-4" />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading font-semibold">CV Builder</span>
                <span className="truncate text-xs text-muted-foreground">{fullName || 'Candidature'}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {(Object.keys(MODES) as AppMode[]).map((id) => {
                const { label, icon: Icon } = MODES[id];
                return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton isActive={mode === id} tooltip={label} onClick={() => setMode(id)}>
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {id === 'letter' && <SidebarMenuBadge>{letterCount}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{mode === 'cv' ? 'Sections du CV' : 'Lettre active'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sections.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    isActive={activeSection === id}
                    tooltip={label}
                    onClick={() => {
                      if (mode === 'cv') setCVSection(id as typeof cvSection);
                      else setLetterSection(id as typeof letterSection);
                      closeOnMobile();
                    }}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {mode === 'letter' && <LettersGroup />}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Mise en page"
              onClick={() => {
                openSettings(mode === 'cv' ? 'cv-theme' : 'letter-style');
                closeOnMobile();
              }}
            >
              <Settings2 />
              <span>{mode === 'cv' ? 'Mise en page du CV' : 'Paramètres des lettres'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
