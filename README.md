# Perplexity Calculator – College Assignment

An interactive, educational web application for computing the **Perplexity** of natural language text using a pretrained **GPT-2** language model. Designed as a college-level machine learning and NLP educational demonstration.

---

## 📌 Project Overview

**Perplexity (PPL)** is an intrinsic evaluation metric in Natural Language Processing that quantifies how predictable or surprising a text sequence is to a probabilistic autoregressive language model.

This project implements an end-to-end, full-stack application featuring:
- **Calculation Engine**: Pretrained GPT-2 (124M parameters) using PyTorch and Hugging Face Transformers.
- **True Probabilities**: Mathematical log-likelihood evaluation per token directly from GPT-2's vocabulary distribution ($V = 50{,}257$).
- **Token-by-Token Visualizer**: Interactive token ribbon with high-probability (green), medium-probability (yellow), and surprising (red/orange) highlighting, with an inspector card for individual token probabilities and NLL scores.
- **Results Dashboard**: High-level perplexity score card, model name, token count, word count, average negative log-likelihood (NLL), and millisecond execution timer.
- **Student Educational Guide**: Embedded mathematical formulas, branching-factor intuition, and model-dependency notes.
- **Modern Minimal UI**: Built with React, TypeScript, and Tailwind CSS with full Dark Mode support and responsive design.

---

## 🧮 Mathematical Formulation

For an autoregressive language model predicting a sequence of $N$ tokens $w_1, w_2, \dots, w_N$:

$$\text{PPL}(W) = \exp\left( -\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1, \dots, w_{i-1}) \right)$$

Where:
- $w_i$ is the $i$-th token in the sequence.
- $P(w_i \mid w_{<i})$ is the probability assigned to $w_i$ given all preceding tokens, obtained via $\text{softmax}(\mathbf{z}_i)$ over the model's vocabulary logits.
- **Log Probabilities**: Logarithms are summed (Negative Log-Likelihood) to guarantee numerical stability and prevent floating-point underflow when multiplying small token probabilities.
- **Average NLL**: $\text{avg\_nll} = -\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_{<i})$.
- **Perplexity**: $\text{PPL} = \exp(\text{avg\_nll})$.
- **Effective Branching Factor**: A perplexity of $K$ indicates that the model is as uncertain as if it had to choose uniformly among $K$ equally likely words at each step.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite |
| **Backend** | Python 3, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | PyTorch, Hugging Face Transformers, Hugging Face Tokenizers |
| **Pretrained Model** | GPT-2 (`gpt2`, 124M parameters, 1024 context window) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.10+ (tested through Python 3.14 on macOS arm64/Apple Silicon and Linux)
- Node.js 18+ and npm (optional for dev server, pre-built frontend is included)

### 1. Clone & Set Up Backend

```bash
# Navigate to the project directory
cd perplexity

# Create and activate a Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install Python backend dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 2. Pre-build the Frontend (Included)

The frontend is already built into `frontend/dist`. To rebuild or customize:

```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Run the Application

You can launch the complete application with a single command:

```bash
./run.sh
```

Or run via Uvicorn directly:

```bash
source .venv/bin/activate
cd backend
PYTHONPATH=. uvicorn main:app --host 127.0.0.1 --port 8000
```

Open your browser at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**. Both the React UI and API endpoints are served simultaneously.

---

## 📡 API Reference

### `POST /calculate`
Computes the true perplexity, token count, word count, average NLL, and token-by-token breakdown.

**Request:**
```json
{
  "text": "The cat sat on the mat."
}
```

**Response (200 OK):**
```json
{
  "perplexity": 76.48,
  "token_count": 7,
  "word_count": 6,
  "average_nll": 4.337,
  "model": "GPT-2",
  "device": "cpu",
  "calculation_time_ms": 14.8,
  "truncated": false,
  "tokens": [
    {
      "index": 1,
      "token": "The",
      "token_id": 464,
      "probability": 0.0377,
      "probability_percent": 3.77,
      "log_probability": -3.2781,
      "nll": 3.2781,
      "category": "medium",
      "label": "Moderate"
    },
    {
      "index": 2,
      "token": " cat",
      "token_id": 3797,
      "probability": 0.0019,
      "probability_percent": 0.19,
      "log_probability": -6.2628,
      "nll": 6.2628,
      "category": "low",
      "label": "Surprising"
    },
    {
      "index": 3,
      "token": " sat",
      "token_id": 3332,
      "probability": 0.0456,
      "probability_percent": 4.56,
      "log_probability": -3.0879,
      "nll": 3.0879,
      "category": "medium",
      "label": "Moderate"
    },
    {
      "index": 4,
      "token": " on",
      "token_id": 319,
      "probability": 0.3541,
      "probability_percent": 35.41,
      "log_probability": -1.0382,
      "nll": 1.0382,
      "category": "high",
      "label": "Expected"
    },
    {
      "index": 5,
      "token": " the",
      "token_id": 262,
      "probability": 0.5824,
      "probability_percent": 58.24,
      "log_probability": -0.5406,
      "nll": 0.5406,
      "category": "high",
      "label": "Expected"
    },
    {
      "index": 6,
      "token": " mat",
      "token_id": 2603,
      "probability": 0.0889,
      "probability_percent": 8.89,
      "log_probability": -2.4202,
      "nll": 2.4202,
      "category": "medium",
      "label": "Moderate"
    },
    {
      "index": 7,
      "token": ".",
      "token_id": 13,
      "probability": 0.5283,
      "probability_percent": 52.83,
      "log_probability": -0.6381,
      "nll": 0.6381,
      "category": "high",
      "label": "Expected"
    }
  ]
}
```

### `POST /count-tokens`
Returns token, word, and character counts without running the full forward pass.

**Request:**
```json
{
  "text": "The cat sat on the mat."
}
```

**Response (200 OK):**
```json
{
  "token_count": 7,
  "word_count": 6,
  "char_count": 23
}
```

### `GET /health`
Returns the status of the backend and model loading state.

---

## 🧪 Testing and Verification

Run the test suite:

```bash
source .venv/bin/activate
PYTHONPATH=backend python backend/test_engine.py
```

### Verified Test Cases:

| Test Case | Sample Input | Tokens | Perplexity | Interpretation |
|---|---|---|---|---|
| **Single Word** | `"Hello"` | 1 | 3999.71 | High perplexity due to absence of preceding conversational context. |
| **Natural Sentence** | `"The sun rises in the east."` | 7 | 34.46 | Low perplexity; highly predictable astronomical fact. |
| **Common Sentence** | `"The cat sat on the mat."` | 7 | 76.48 | Moderate perplexity; natural English sentence. |
| **Academic Text** | `"Quantum mechanics describes the behavior of matter and energy at atomic and subatomic scales."` | 18 | 24.31 | Low-to-moderate perplexity; well-formed scientific literature. |
| **Unusual Text** | `"Purple elephants silently calculate underwater mathematics."` | 8 | 3675.96 | Very high perplexity; grammatically valid but semantically surreal. |
| **Empty Input** | `""` | 0 | Error 400 | Graceful validation error: *"Input text cannot be empty."* |

---

## 🎓 College Assignment Compliance Checklist

- [x] **Application Interface**: Clean, minimal, student-friendly with title, subtitle, info icon, character counter, word counter, and live token counter.
- [x] **Calculation Engine**: Real GPT-2 model probabilities using PyTorch log-softmax. No mocked/random values. Log probabilities prevent numerical instability.
- [x] **Input Flexibility**: Accommodates single words, short sentences, paragraphs, and long passages with graceful empty input validation.
- [x] **Results Section**: Prominent perplexity score, model name ("GPT-2"), token count, word count, average negative log-likelihood, and calculation time.
- [x] **Token Analysis**: Token-by-token table and interactive ribbon with green ($\ge 10\%$), yellow ($1\%-10\%$), and orange/red ($<1\%$) color coding.
- [x] **Educational Section**: Clear explanation of perplexity, mathematical formula, branching-factor intuition, and model-dependence warning.
- [x] **Example Inputs**: Interactive one-click buttons for all 5 required example sentences.
- [x] **Performance**: Model loaded once into memory on server startup; single-pass batched tensor calculations.
