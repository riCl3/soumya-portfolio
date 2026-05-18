let chunksCache = null

export async function loadChunks() {
  if (chunksCache) return chunksCache
  const res = await fetch('/embeddings/chunks.json')
  if (!res.ok) throw new Error('Failed to load knowledge base')
  chunksCache = await res.json()
  return chunksCache
}

export function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function retrieveChunks(queryEmbedding, chunks, topK = 4) {
  const scored = chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topK)
}
