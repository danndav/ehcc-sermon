'use client';

import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Hash, Minus, CheckSquare } from 'lucide-react';

interface FormattingToolbarProps {
  textareaId: string;
  content: string;
  onContentChange: (content: string) => void;
}

type FormatAction = {
  icon: typeof Bold;
  label: string;
  action: 'wrap' | 'prefix' | 'insert';
  before?: string;
  after?: string;
  prefix?: string;
  insert?: string;
};

const formatActions: FormatAction[] = [
  { icon: Bold, label: 'Bold', action: 'wrap', before: '**', after: '**' },
  { icon: Italic, label: 'Italic', action: 'wrap', before: '*', after: '*' },
  { icon: Heading1, label: 'Heading', action: 'prefix', prefix: '## ' },
  { icon: Heading2, label: 'Subheading', action: 'prefix', prefix: '### ' },
  { icon: List, label: 'Bullet list', action: 'prefix', prefix: '- ' },
  { icon: ListOrdered, label: 'Numbered list', action: 'prefix', prefix: '1. ' },
  { icon: CheckSquare, label: 'Checklist', action: 'prefix', prefix: '- [ ] ' },
  { icon: Quote, label: 'Quote', action: 'prefix', prefix: '> ' },
  { icon: Minus, label: 'Divider', action: 'insert', insert: '\n---\n' },
  { icon: Hash, label: 'Tag', action: 'insert', insert: '#' },
];

export function FormattingToolbar({ textareaId, content, onContentChange }: FormattingToolbarProps) {
  const applyFormat = (action: FormatAction) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newContent = content;
    let cursorPos = start;

    if (action.action === 'wrap') {
      const before = action.before || '';
      const after = action.after || '';
      if (selectedText) {
        newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
        cursorPos = end + before.length + after.length;
      } else {
        newContent = content.substring(0, start) + before + after + content.substring(end);
        cursorPos = start + before.length;
      }
    } else if (action.action === 'prefix') {
      const prefix = action.prefix || '';
      // Find the start of the current line
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
      cursorPos = start + prefix.length;
    } else if (action.action === 'insert') {
      const insert = action.insert || '';
      newContent = content.substring(0, start) + insert + content.substring(end);
      cursorPos = start + insert.length;
    }

    onContentChange(newContent);

    // Restore cursor position
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  return (
    <div className="flex items-center gap-0.5 px-1 py-1.5 border-b border-black/[0.06] bg-white overflow-x-auto scrollbar-none">
      {formatActions.map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => applyFormat(action)}
            title={action.label}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-[#4A1572] hover:bg-[#F3EAF9] transition-colors shrink-0"
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
