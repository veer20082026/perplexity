import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { TokenAnalysis } from './components/TokenAnalysis';
import { EducationalSection } from './components/EducationalSection';
import { InfoModal } from './components/InfoModal';
import { CalculateResponse } from './types';
import { AlertCircle, GraduationCap } from 'lucide-react';

export function App() {
  const [inputText, setInputText] = useState('The cat sat on the mat.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [serverTokens, setServerTokens] = useState<number | null>(null);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check backend health on load
  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.model_loaded) {
          setModelReady(true);
        }
      })
      .catch((err) => {
        console.warn('Backend /health check failed:', err);
      });
  }, []);

  // Character count
  const charCount = inputText.length;

  // Word count using regex
  const wordCount = useMemo(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return 0;
    const matches = trimmed.match(/\b\w+\b/g);
    return matches ? matches.length : 0;
  }, [inputText]);

  // Debounced token count calculation from backend
  useEffect(() => {
    if (!inputText.trim()) {
      setServerTokens(0);
      return;
    }

    const timer = setTimeout(() => {
      fetch('/count-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.token_count === 'number') {
            setServerTokens(data.token_count);
          }
        })
        .catch(() => {
          // If server call fails, fallback to heuristic estimate
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Fallback heuristic token count if server count is pending
  const tokenCount = serverTokens !== null ? serverTokens : Math.max(0, Math.round(wordCount * 1.3));

  const handleCalculate = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setError('Please enter at least one word or character to calculate perplexity.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Server error: ${response.status}`);
      }

      setResult(data);
      setModelReady(true);
    } catch (err: any) {
      console.error('Calculation error:', err);
      setError(err.message || 'An unexpected error occurred during calculation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
    setServerTokens(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        onOpenInfo={() => setIsInfoOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        modelReady={modelReady}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <strong className="font-semibold block">Calculation Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <InputSection
          inputText={inputText}
          setInputText={(text) => {
            setInputText(text);
            if (error) setError(null);
          }}
          charCount={charCount}
          wordCount={wordCount}
          tokenCount={tokenCount}
          isLoading={isLoading}
          onCalculate={handleCalculate}
          onClear={handleClear}
        />

        {/* Results Section */}
        {result && <ResultsSection result={result} />}

        {/* Token-by-Token Analysis Section */}
        {result && <TokenAnalysis tokens={result.tokens} />}

        {/* Educational Explanation Section */}
        <EducationalSection />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Machine Learning & NLP Educational Tool • Perplexity Calculator</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Model: GPT-2 (124M Parameters)</span>
            <span>•</span>
            <span>PyTorch & Hugging Face Transformers</span>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
export default App;
