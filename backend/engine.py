import time
import math
import re
from typing import List, Dict, Any, Optional
import torch
import torch.nn.functional as F
from transformers import AutoModelForCausalLM, AutoTokenizer


class PerplexityEngine:
    def __init__(self, model_name: str = "gpt2"):
        self.model_name = model_name
        self.device = torch.device("mps" if torch.backends.mps.is_available() else ("cuda" if torch.cuda.is_available() else "cpu"))
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        self.load_error: Optional[str] = None

    def load_model(self):
        """Loads model and tokenizer into memory once. Handles offline cache gracefully."""
        try:
            print(f"Loading {self.model_name} on device: {self.device}...")
            # First try loading strictly from local cache to avoid network timeouts
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, local_files_only=True)
                self.model = AutoModelForCausalLM.from_pretrained(self.model_name, local_files_only=True)
            except Exception as offline_err:
                print(f"Local cache lookup failed ({offline_err}), attempting online download...")
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                self.model = AutoModelForCausalLM.from_pretrained(self.model_name)

            self.model.to(self.device)
            self.model.eval()
            self.is_loaded = True
            self.load_error = None
            print(f"Successfully loaded {self.model_name} on {self.device}.")
        except Exception as e:
            self.is_loaded = False
            self.load_error = str(e)
            print(f"Error loading model {self.model_name}: {e}")
            raise e

    def get_token_count(self, text: str) -> int:
        if not self.tokenizer or not text.strip():
            return 0
        tokens = self.tokenizer.encode(text, add_special_tokens=False)
        return len(tokens)

    def calculate(self, text: str) -> Dict[str, Any]:
        """
        Calculates the perplexity and token-by-token probabilities for input text.
        Formula:
          PPL = exp( - (1/N) * sum_{i=1}^N log P(token_i | previous tokens) )
        """
        if not self.is_loaded or self.model is None or self.tokenizer is None:
            raise RuntimeError(f"Model not loaded. Error: {self.load_error}")

        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Input text cannot be empty.")

        start_time = time.perf_counter()

        # Word count calculation using regex (words and numbers)
        word_list = re.findall(r"\b\w+\b", clean_text)
        word_count = len(word_list)

        # Tokenize input
        encodings = self.tokenizer(clean_text, return_tensors="pt", add_special_tokens=False)
        input_ids = encodings.input_ids.to(self.device)
        total_tokens = input_ids.size(1)

        if total_tokens == 0:
            raise ValueError("Text contains no valid tokens to process.")

        # Handle max length if text exceeds GPT-2's 1024 token context window
        max_length = self.model.config.n_positions if hasattr(self.model.config, "n_positions") else 1024
        # We prepend 1 BOS token, so maximum supported in single pass is max_length - 1
        truncated = False
        if total_tokens > max_length - 1:
            input_ids = input_ids[:, : max_length - 1]
            total_tokens = input_ids.size(1)
            truncated = True

        # Prepend BOS / EOS token (<|endoftext|>) so that even the very first token has conditioning context
        # This allows accurate evaluation of P(token_1 | <|endoftext|>) and handles single-token words seamlessly
        bos_id = self.tokenizer.bos_token_id if self.tokenizer.bos_token_id is not None else self.tokenizer.eos_token_id
        prefix = torch.tensor([[bos_id]], dtype=torch.long, device=self.device)
        full_input_ids = torch.cat([prefix, input_ids], dim=1)  # shape: (1, N + 1)

        with torch.no_grad():
            outputs = self.model(full_input_ids)
            logits = outputs.logits  # shape: (1, N + 1, vocab_size)

            # shift_logits: predictions for each token in input_ids
            # Index 0 of logits corresponds to predicting input_ids[0] given prefix
            shift_logits = logits[0, :-1, :]  # shape: (N, vocab_size)
            target_ids = full_input_ids[0, 1:]  # shape: (N,)

            # Calculate log probabilities over vocabulary using log_softmax
            log_probs = F.log_softmax(shift_logits, dim=-1)  # shape: (N, vocab_size)

            # Gather log prob of actual target tokens
            target_log_probs = torch.gather(log_probs, 1, target_ids.unsqueeze(-1)).squeeze(-1)  # shape: (N,)

            # Token probability: exp(log_prob)
            target_probs = torch.exp(target_log_probs)

            # Negative Log Likelihood (NLL) per token: -log P(token_i | context)
            token_nlls = -target_log_probs

            # Average NLL: (1/N) * sum(NLL)
            avg_nll = token_nlls.mean().item()

            # Perplexity: exp(avg_nll)
            # Avoid overflow if avg_nll is excessively high
            if avg_nll > 700:
                perplexity = float("inf")
            else:
                perplexity = math.exp(avg_nll)

        calc_time_ms = (time.perf_counter() - start_time) * 1000

        # Build token-by-token analysis
        token_analysis: List[Dict[str, Any]] = []
        for i in range(total_tokens):
            t_id = int(target_ids[i].item())
            # Decode individual token with leading/trailing spaces preserved
            raw_token_str = self.tokenizer.decode([t_id])
            prob_val = float(target_probs[i].item())
            log_prob_val = float(target_log_probs[i].item())
            nll_val = float(token_nlls[i].item())

            # Categorize surprise level:
            # High probability (predictable / low surprise): >= 10%
            # Medium probability (moderate): 1% <= prob < 10%
            # Low probability (surprising): < 1%
            if prob_val >= 0.10:
                category = "high"
                label = "Expected"
            elif prob_val >= 0.01:
                category = "medium"
                label = "Moderate"
            else:
                category = "low"
                label = "Surprising"

            token_analysis.append({
                "index": i + 1,
                "token": raw_token_str,
                "token_id": t_id,
                "probability": round(prob_val, 6),
                "probability_percent": round(prob_val * 100, 4),
                "log_probability": round(log_prob_val, 4),
                "nll": round(nll_val, 4),
                "category": category,
                "label": label,
            })

        return {
            "perplexity": round(perplexity, 2),
            "token_count": total_tokens,
            "word_count": word_count,
            "average_nll": round(avg_nll, 4),
            "model": "GPT-2",
            "device": str(self.device),
            "calculation_time_ms": round(calc_time_ms, 2),
            "truncated": truncated,
            "tokens": token_analysis,
        }
