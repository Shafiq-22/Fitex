interface PromptSuggestionsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  'Create a workout plan',
  'How to improve my bench press',
  'Review my progress',
  'Nutrition tips for muscle gain',
  'Help with form',
  'Recovery advice',
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="text-left px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
