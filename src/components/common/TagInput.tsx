import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Ajouter...' }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const value = input.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className="flex min-h-8 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-1.5 py-1 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <Badge key={i} variant="secondary" className="h-6 gap-0.5 rounded-md pr-0.5 pl-2 font-normal">
          {tag}
          <button
            type="button"
            aria-label={`Retirer ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="h-6 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
