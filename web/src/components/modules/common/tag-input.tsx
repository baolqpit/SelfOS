'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = 'Nhập rồi nhấn Enter' }: Props) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-[var(--color-border)] p-1">
      {value.map((t) => (
        <Badge key={t} className="gap-1">
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x !== t))}
            className="hover:text-[var(--color-destructive)]"
          >
            <X size={10} />
          </button>
        </Badge>
      ))}
      <Input
        value={draft}
        placeholder={placeholder}
        className="h-7 flex-1 border-0 bg-transparent focus:ring-0 min-w-[8rem]"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
      />
    </div>
  );
}
