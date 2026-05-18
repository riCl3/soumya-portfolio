## The Problem

Running LLM evaluations on a single GPU is fine for small models, but when you're benchmarking 70B+ parameter models across multiple tasks, you need distributed infrastructure.

## Architecture

We built a pipeline that:

- Distributes evaluation tasks across **100+ GPUs** using a custom job scheduler
- Uses **vLLM** for high-throughput inference
- Aggregates results in real-time via Redis streams

```python
# Simplified job distribution
for gpu_node in cluster.nodes:
    job = assign_benchmark_task(gpu_node, model, dataset)
    gpu_node.submit(job)
```

## Key Lessons

1. **Network is the bottleneck** - GPU compute is fast, but moving data between nodes is slow
2. **Batch sizing matters more than you think** - Finding the right batch size per GPU model is critical
3. **Monitor everything** - We built a Grafana dashboard that tracks per-GPU utilization in real-time

## Results

| Model | Single GPU | Distributed (100 GPUs) | Speedup |
|-------|-----------|----------------------|---------|
| LLaMA-70B | 12 hrs | 8 min | 90x |
| Mistral-7B | 45 min | 30 sec | 90x |

The speedup isn't perfectly linear due to communication overhead, but it's close enough for practical use.

## What's Next

We're working on auto-scaling the cluster based on evaluation queue depth. More on that in a future post.
