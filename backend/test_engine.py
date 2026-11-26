import math
from engine import PerplexityEngine

def run_tests():
    print("=== Testing PerplexityEngine ===")
    engine = PerplexityEngine("gpt2")
    engine.load_model()
    assert engine.is_loaded, "Engine should be loaded"
    assert engine.tokenizer is not None, "Tokenizer should be loaded"
    assert engine.model is not None, "Model should be loaded"

    # Test 1: Standard sentence
    text1 = "The cat sat on the mat."
    res1 = engine.calculate(text1)
    print(f"\n[Test 1] '{text1}'")
    print(f"Perplexity: {res1['perplexity']}, Tokens: {res1['token_count']}, Avg NLL: {res1['average_nll']}")
    assert res1["token_count"] == 7
    assert res1["word_count"] == 6
    assert res1["perplexity"] > 0
    assert len(res1["tokens"]) == 7

    # Test 2: Single word
    text2 = "Hello"
    res2 = engine.calculate(text2)
    print(f"\n[Test 2] Single word: '{text2}'")
    print(f"Perplexity: {res2['perplexity']}, Tokens: {res2['token_count']}, Avg NLL: {res2['average_nll']}")
    assert res2["token_count"] == 1
    assert res2["perplexity"] > 0
    assert len(res2["tokens"]) == 1

    # Test 3: Common vs Unusual comparison
    common_text = "The sun rises in the east."
    unusual_text = "Purple elephants silently calculate underwater mathematics."
    res_common = engine.calculate(common_text)
    res_unusual = engine.calculate(unusual_text)
    print(f"\n[Test 3] Comparison:")
    print(f"Common: '{common_text}' -> PPL: {res_common['perplexity']}")
    print(f"Unusual: '{unusual_text}' -> PPL: {res_unusual['perplexity']}")
    assert res_unusual["perplexity"] > res_common["perplexity"], "Unusual text should have higher perplexity than common text"

    # Test 4: Token probabilities sanity
    for tok in res1["tokens"]:
        assert 0.0 <= tok["probability"] <= 1.0, f"Probability {tok['probability']} out of range"
        assert tok["log_probability"] <= 0.0, f"Log probability {tok['log_probability']} should be <= 0"
        assert tok["nll"] >= 0.0, f"NLL {tok['nll']} should be >= 0"

    # Test 5: Empty text error handling
    try:
        engine.calculate("   ")
        assert False, "Should have raised ValueError on empty input"
    except ValueError:
        print("\n[Test 5] Empty text raised ValueError as expected.")

    print("\nAll PerplexityEngine tests passed successfully!")

if __name__ == "__main__":
    run_tests()
