## Why Edge Deployment?

Running NLP models in the browser eliminates server costs and latency. With ONNX Runtime Web, you can run transformer models directly in the user's browser.

## The Pipeline

1. Train model in PyTorch
2. Export to ONNX format with dynamic quantization
3. Load in browser via `onnxruntime-web`

```python
# Export to ONNX
import torch
model = load_model("deberta-v3-base")
dummy_input = tokenizer("sample text", return_tensors="pt")
torch.onnx.export(model, dummy_input, "model.onnx", opset_version=14)
```

## Performance

After quantization, the model runs at **~50ms per inference** on modern browsers. That's fast enough for real-time text classification.

## Browser Compatibility

- Chrome: Full support with WebGPU backend
- Firefox: WASM fallback (slower but works)
- Safari: WASM only, ~2x slower than Chrome

## Takeaways

- Quantization is essential - the full-precision model is too large for browsers
- WebGPU is the future, but WASM is the safe fallback
- Cache the model binary - it's 40-100MB depending on the model
