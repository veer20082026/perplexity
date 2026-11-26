import React from 'react';
import { Calculator, RotateCcw, Loader2, Sparkles, Hash, Type, FileText } from 'lucide-react';
import { ExampleInput } from '../types';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  charCount: number;
  wordCount: number;
  tokenCount: number;
  isLoading: boolean;
  onCalculate: () => void;
  onClear: () => void;
}

export const EXAMPLES: ExampleInput[] = [
  {
    id: 'ex-1',
    title: 'Example 1',
    category: 'natural',
    text: 'The sun rises in the east.',
    description: 'High predictability natural fact',
  },
  {
    id: 'ex-2',
    title: 'Example 2',
    category: 'natural',
    text: 'The cat sat on the mat.',
    description: 'Classic linguistic sentence',
  },
  {
    id: 'ex-3',
    title: 'Example 3',
    category: 'creative',
    text: 'Artificial intelligence is transforming the world.',
    description: 'Modern technology statement',
  },
  {
    id: 'ex-4',
    title: 'Example 4',
    category: 'academic',
    text: 'Quantum mechanics describes the behavior of particles at microscopic scales.',
    description: 'Domain-specific scientific passage',
  },
  {
    id: 'ex-5',
    title: 'Example 5',
    category: 'unusual',
    text: 'Purple elephants silently calculate underwater mathematics.',
    description: 'Nonsensical yet grammatical (high surprise)',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  charCount,
  wordCount,
  tokenCount,
  isLoading,
  onCalculate,
  onClear,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to trigger calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onCalculate();
      }
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header and Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <label htmlFor="perplexity-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>Input Text</span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
            (Word, sentence, or paragraph)
          </span>
        </label>

        {/* Live Counters */}
        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-1" title="Characters">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <span>{charCount} chars</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center space-x-1" title="Words">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{wordCount} words</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center space-x-1" title="GPT-2 Token Estimate">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{tokenCount} tokens</span>
          </div>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="mt-4 relative">
        <textarea
          id="perplexity-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a word, sentence, or paragraph to calculate perplexity..."
          rows={5}
          disabled={isLoading}
          className="w-full p-4 rounded-xl text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-sm sm:text-base leading-relaxed resize-y disabled:opacity-60"
        />
        <div className="absolute right-3 bottom-3 hidden sm:block text-[11px] text-slate-400 dark:text-slate-600 select-none">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">Enter</kbd>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onCalculate}
            disabled={isLoading || !inputText.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Probabilities...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Calculate Perplexity</span>
              </>
            )}
          </button>

          <button
            onClick={onClear}
            disabled={isLoading || !inputText}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Example Inputs</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setInputText(ex.text)}
              disabled={isLoading}
              className="text-left group px-3 py-2 rounded-xl text-xs bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
            >
              <div className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1.5">
                <span>{ex.title}:</span>
                <span className="font-normal text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  "{ex.text}"
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
