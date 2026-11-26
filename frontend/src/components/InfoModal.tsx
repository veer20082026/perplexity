import React from 'react';
import { X, BookOpen, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Understanding Perplexity in NLP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Section 1: Definition */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              What is Perplexity?
            </h3>
            <p className="mt-2">
              Perplexity (PPL) is a standard intrinsic evaluation metric in Natural Language Processing (NLP). It measures how well a probabilistic language model predicts a sample of text—or equivalently, <strong>how surprised</strong> the model is when reading the sequence.
            </p>
          </div>

          {/* Section 2: Mathematical Formula */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Mathematical Definition
            </h4>
            <div className="py-2 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm sm:text-base">
              PPL = exp( − (1/N) × Σ log P(tokenᵢ | token₁ ... tokenᵢ₋₁) )
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Where <code className="text-slate-700 dark:text-slate-300 font-mono">N</code> is the number of tokens, and <code className="text-slate-700 dark:text-slate-300 font-mono">log P(tokenᵢ | context)</code> is the log probability assigned to the actual next token.
            </p>
          </div>

          {/* Section 3: Intuitive Interpretation */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Intuitive Interpretation
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">
                  ↓ Lower Perplexity
                </div>
                <p className="text-xs text-emerald-700/90 dark:text-emerald-400 mt-1">
                  The text is familiar, fluent, and highly predictable to the model. Expected phrases and common grammar score lower.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
                <div className="font-semibold text-rose-800 dark:text-rose-300 text-xs sm:text-sm">
                  ↑ Higher Perplexity
                </div>
                <p className="text-xs text-rose-700/90 dark:text-rose-400 mt-1">
                  The text is surprising, unusual, ungrammatical, or nonsensical to the model. Rare words and disjointed syntax score higher.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Model Dependence Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <strong className="font-semibold">Important Caveat:</strong> Perplexity is strictly model-dependent and tokenizer-dependent. Scores cannot be directly compared across different models or different vocabularies.
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
