import React, { useState } from 'react';
import { TokenItem } from '../types';
import { Search, Layers } from 'lucide-react';

interface TokenAnalysisProps {
  tokens: TokenItem[];
}

export const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(tokens[0] || null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Count categories
  const highCount = tokens.filter((t) => t.category === 'high').length;
  const mediumCount = tokens.filter((t) => t.category === 'medium').length;
  const lowCount = tokens.filter((t) => t.category === 'low').length;

  // Filtered tokens
  const filteredTokens = tokens.filter((t) => {
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch = t.token.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStyles = (category: 'high' | 'medium' | 'low', isSelected: boolean = false) => {
    switch (category) {
      case 'high':
        return isSelected
          ? 'bg-emerald-500 text-white ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800';
      case 'medium':
        return isSelected
          ? 'bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800';
      case 'low':
        return isSelected
          ? 'bg-rose-500 text-white ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'bg-rose-100/80 text-rose-900 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800';
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Token-by-Token Analysis</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Probability assigned to each token conditioned on all preceding text context.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-medium">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            High (&ge;10%)
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Medium (1-10%)
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>
            Low (&lt;1%)
          </span>
        </div>
      </div>

      {/* Interactive Visual Token Ribbon */}
      <div className="mt-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center justify-between">
          <span>Click any token to inspect model predictions</span>
          <span className="text-[11px] font-normal text-slate-400">Total {tokens.length} tokens</span>
        </div>

        <div className="flex flex-wrap gap-1.5 font-mono text-sm leading-relaxed max-h-56 overflow-y-auto p-1">
          {tokens.map((tok) => {
            const isSelected = selectedToken?.index === tok.index;
            const displayToken = tok.token.replace(/\n/g, '↵\n').replace(/ /g, '·');
            return (
              <button
                key={tok.index}
                onClick={() => setSelectedToken(tok)}
                className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${getCategoryStyles(
                  tok.category,
                  isSelected
                )}`}
                title={`Token #${tok.index}: "${tok.token}" | P = ${(tok.probability * 100).toFixed(2)}% | NLL = ${tok.nll}`}
              >
                {displayToken}
              </button>
            );
          })}
        </div>

        {/* Selected Token Inspector Card */}
        {selectedToken && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-sans">Token #{selectedToken.index}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                "{selectedToken.token}"
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">ID: {selectedToken.token_id}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-sans">Predicted Probability</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                {(selectedToken.probability * 100).toFixed(4)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                P = {selectedToken.probability.toFixed(6)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-sans">Log Probability</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                {selectedToken.log_probability.toFixed(4)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                log P(token | context)
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-sans">Surprise (NLL)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
                {selectedToken.nll.toFixed(4)}
              </span>
              <span className="text-[11px] font-semibold block mt-0.5">
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  selectedToken.category === 'high' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  selectedToken.category === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {selectedToken.label}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterCategory === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({tokens.length})
          </button>
          <button
            onClick={() => setFilterCategory('high')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterCategory === 'high'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40'
            }`}
          >
            High ({highCount})
          </button>
          <button
            onClick={() => setFilterCategory('medium')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterCategory === 'medium'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-950/40'
            }`}
          >
            Medium ({mediumCount})
          </button>
          <button
            onClick={() => setFilterCategory('low')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterCategory === 'low'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-950/40'
            }`}
          >
            Surprising ({lowCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Token Analysis Table */}
      <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 font-semibold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                <th className="py-2.5 px-3.5">Token</th>
                <th className="py-2.5 px-3.5">Predicted Probability</th>
                <th className="py-2.5 px-3.5">Log Probability</th>
                <th className="py-2.5 px-3.5">NLL (Surprise)</th>
                <th className="py-2.5 px-3.5 text-right">Predictability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No tokens match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((tok) => {
                  const isSelected = selectedToken?.index === tok.index;
                  return (
                    <tr
                      key={tok.index}
                      onClick={() => setSelectedToken(tok)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2.5 px-3.5 text-center text-slate-400 font-sans">
                        {tok.index}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-100">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 inline-block">
                          {tok.token.replace(/\n/g, '↵').replace(/ /g, '·')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-16 font-semibold text-slate-800 dark:text-slate-200">
                            {(tok.probability * 100).toFixed(2)}%
                          </span>
                          <div className="w-16 sm:w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                tok.category === 'high'
                                  ? 'bg-emerald-500'
                                  : tok.category === 'medium'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, tok.probability * 100 * 2)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">
                        {tok.log_probability.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">
                        {tok.nll.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            tok.category === 'high'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : tok.category === 'medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {tok.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
