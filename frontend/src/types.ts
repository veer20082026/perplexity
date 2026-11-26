export interface TokenItem {
  index: number;
  token: string;
  token_id: number;
  probability: number;
  probability_percent: number;
  log_probability: number;
  nll: number;
  category: 'high' | 'medium' | 'low';
  label: string;
}

export interface CalculateResponse {
  perplexity: number;
  token_count: number;
  word_count: number;
  average_nll: number;
  model: string;
  device: string;
  calculation_time_ms: number;
  truncated: boolean;
  tokens: TokenItem[];
}

export interface TokenCountResponse {
  token_count: number;
  word_count: number;
  char_count: number;
}

export interface ExampleInput {
  id: string;
  title: string;
  category: 'natural' | 'academic' | 'creative' | 'unusual';
  text: string;
  description: string;
}
