import { useState } from 'react';

interface ExerciseNotesProps {
  notes: string | undefined;
  onChange: (note: string) => void;
}

export function ExerciseNotes({ notes, onChange }: ExerciseNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(notes ?? '');

  const handleChange = (text: string) => {
    setValue(text);
    onChange(text);
  };

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">Notes</span>
        {value && !isOpen && (
          <span className="text-xs text-slate-400 dark:text-slate-500 truncate ml-1">
            — {value}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {notes && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic px-1">
              {notes}
            </p>
          )}
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Add a note for this exercise..."
            rows={2}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}
