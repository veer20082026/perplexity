import React from 'react';
import { CalculateResponse } from '../types';
import { Cpu, Hash, FileText, Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultsSectionProps {
  result: CalculateResponse;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  // Determine predictability interpretation
  const getPplBadge = (ppl: number) => {
    if (ppl < 40) {
      return {
        label: 'Highly Predictable',
        color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        description: 'Text follows very familiar vocabulary, common collocations, and standard syntax.',
      };
    } else if (ppl < 150) {
      return {
        label: 'Moderately Predictable',
        color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        description: 'Natural language with moderate lexical diversity, varied phrasing, or domain terminology.',
      };
    } else if (ppl < 600) {
      return {
        label: 'High Perplexity',
        color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        description: 'Text contains uncommon words, technical jargon, or unusual sentence constructions.',
      };
    } else {
      return {
        label: 'Very Surprising / Unusual',
        color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        description: 'Highly unpredictable to the model. Often indicates bizarre semantics, rare tokens, or random sequences.',
      };
    }
  };

  const badge = getPplBadge(result.perplexity);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        {/* Main Perplexity Score */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Perplexity Score
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
              {result.perplexity >= 100000 ? result.perplexity.toExponential(2) : result.perplexity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-xs">
              {badge.description}
            </div>
          </div>
        </div>

        {/* Model and Execution Tag */}
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Calculated via Pretrained <strong>{result.model}</strong></span>
          </div>
        </div>
      </div>

      {/* Metadata Metrics Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Model */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>Model Name</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {result.model}
          </div>
        </div>

        {/* Number of Tokens */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tokens</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {result.token_count}
          </div>
        </div>

        {/* Number of Words */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Words</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {result.word_count}
          </div>
        </div>

        {/* Average Negative Log-Likelihood */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>Average NLL</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {result.average_nll.toFixed(4)}
          </div>
        </div>

        {/* Calculation Time */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Calculation Time</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {result.calculation_time_ms.toFixed(1)} ms
          </div>
        </div>
      </div>

      {/* Truncation warning if text was clipped */}
      {result.truncated && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Note: Input exceeded GPT-2's 1024 token limit and was evaluated up to the maximum context length.</span>
        </div>
      )}
    </section>
  );
};
