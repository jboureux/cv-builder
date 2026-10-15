import type { CVData } from '../../types/cv';
import { CVDocument } from './CVDocument';
import { PagePreview } from './PagePreview';

interface Props {
  data: CVData;
  documentRef: React.RefObject<HTMLDivElement | null>;
}

export function CVPreview({ data, documentRef }: Props) {
  return (
    <PagePreview>
      <CVDocument ref={documentRef} data={data} />
    </PagePreview>
  );
}
