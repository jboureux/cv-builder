import { LayoutList } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { AddButton, ItemCard, SectionHint } from '@/components/common/ItemCard';
import { TextField } from '@/components/common/fields';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import type { CustomSection } from '@/types/cv';

function CustomCard({
  sec,
  onUpdate,
  onRemove,
}: {
  sec: CustomSection;
  onUpdate: (s: CustomSection) => void;
  onRemove: () => void;
}) {
  const set = (key: keyof CustomSection, value: string) => onUpdate({ ...sec, [key]: value });
  const lines = sec.content.split('\n').filter((l) => l.trim()).length;

  return (
    <ItemCard
      title={sec.title || 'Nouvelle section'}
      subtitle={lines ? `${lines} élément${lines > 1 ? 's' : ''}` : undefined}
      defaultOpen={!sec.title}
      removeLabel="cette section"
      onRemove={onRemove}
    >
      <TextField
        label="Titre de la section"
        value={sec.title}
        onChange={(v) => set('title', v)}
        placeholder="Certifications, Langues, Bénévolat…"
      />
      <TextField
        label="Contenu"
        hint="une ligne = un point de liste"
        value={sec.content}
        onChange={(v) => set('content', v)}
        rows={5}
        placeholder={`AWS Certified Solutions Architect (2024)\nAnglais — Courant (TOEIC 945)\nEspagnol — Intermédiaire (B2)`}
        inputClassName="font-mono text-xs md:text-xs"
      />
    </ItemCard>
  );
}

export function CustomSectionForm() {
  const { data, addCustomSection, updateCustomSection, removeCustomSection, setSectionOrder } = useCVStore();

  const add = () => {
    const id = crypto.randomUUID();
    addCustomSection({ id, title: '', content: '' });
    setSectionOrder([...data.sectionOrder, { id: `sec-custom-${id}`, type: 'custom', customId: id, visible: true }]);
  };

  const remove = (id: string) => {
    removeCustomSection(id);
    setSectionOrder(data.sectionOrder.filter((s) => s.customId !== id));
  };

  if (data.customSections.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutList />
          </EmptyMedia>
          <EmptyTitle>Aucune section libre</EmptyTitle>
          <EmptyDescription>
            Ajoutez des sections sur mesure : certifications, langues, bénévolat, centres d'intérêt…
          </EmptyDescription>
        </EmptyHeader>
        <AddButton onClick={add}>Ajouter une section</AddButton>
      </Empty>
    );
  }

  return (
    <div className="space-y-2.5">
      <SectionHint>
        Chaque section apparaît dans le CV ; réglez sa position depuis <strong>Mise en page › Ordre des sections</strong>.
      </SectionHint>
      {data.customSections.map((sec) => (
        <CustomCard
          key={sec.id}
          sec={sec}
          onUpdate={(s) => updateCustomSection(sec.id, s)}
          onRemove={() => remove(sec.id)}
        />
      ))}
      <AddButton onClick={add}>Ajouter une section</AddButton>
    </div>
  );
}
