import React from 'react';
import { BookOpen, Compass, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Educational Guide: What is Perplexity?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A comprehensive overview of language model evaluation and predictability metrics.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* Core Definition */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            1. Core Concept & Uncertainty
          </h3>
          <p>
            Perplexity measures how uncertain a language model is when predicting the next token in a sequence. You can think of it as the <strong>effective branching factor</strong>: a perplexity of 24 means that, on average, the model is as confused as if it were choosing uniformly among 24 equally likely candidate tokens at each position.
          </p>
        </div>

        {/* The Math */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            2. The Mathematical Formulation
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 font-mono text-center text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
            PPL = exp( − (1/N) × Σ log P(tokenᵢ | context) )
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log probabilities are summed to avoid numerical underflow from multiplying small floating-point probabilities together across long sequences.
          </p>
        </div>

        {/* Interpretation */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-indigo-500" />
            3. Interpretation Guidelines
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span>
                <strong>Lower Perplexity:</strong> The text is more predictable to the model. Sentences with common grammatical structures and familiar collocations yield lower scores.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span>
                <strong>Higher Perplexity:</strong> The text is less predictable or more surprising. Grammatical errors, rare vocabulary, or semantically strange phrasing yield higher scores.
              </span>
            </li>
          </ul>
        </div>

        {/* Crucial Caveat */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            4. Model-Dependent Nature
          </h3>
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
            <p>
              <strong>Important Rule:</strong> Perplexity is strictly model-dependent and tokenizer-dependent.
            </p>
            <p>
              Because different models use different tokenizers (e.g. byte-level BPE in GPT-2 with 50,257 tokens vs Llama or SentencePiece), scores from different language models are not directly comparable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
