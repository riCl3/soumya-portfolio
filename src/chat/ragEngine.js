import { loadChunks, retrieveChunks } from './retrieval.js'
import { SYSTEM_PROMPT, buildPromptWithContext } from './prompts.js'

let embedder = null
let embedderLoading = false
let onProgress = null

export function setProgressCallback(cb) {
  onProgress = cb
}

export async function loadEmbedder() {
  if (embedder) return embedder
  if (embedderLoading) {
    // Wait for existing load
    while (embedderLoading) {
      await new Promise(r => setTimeout(r, 100))
    }
    return embedder
  }

  embedderLoading = true
  try {
    // Load from CDN to avoid bundling 23MB WASM file
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3')
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: onProgress
    })
    return embedder
  } finally {
    embedderLoading = false
  }
}

export async function embedText(text) {
  const model = await loadEmbedder()
  const output = await model(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

export async function query(userMessage, chatHistory = []) {
  // Load chunks and embed question in parallel
  const [chunks, queryEmbedding] = await Promise.all([
    loadChunks(),
    embedText(userMessage)
  ])

  // Retrieve relevant chunks
  const retrieved = retrieveChunks(queryEmbedding, chunks, 4)

  // Filter out low-similarity results
  const relevant = retrieved.filter(c => c.score > 0.25)
  const contextText = relevant.length > 0
    ? buildPromptWithContext(relevant, userMessage)
    : `User question: ${userMessage}\n\n(Note: No highly relevant context found. Answer based on general knowledge about Soumya if possible, or suggest the user ask about specific topics.)`

  // Build messages for Gemini
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: contextText }
  ]

  // Call Edge Function
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to get response')
  }

  const data = await res.json()

  return {
    text: data.text,
    sources: relevant.map(c => ({ source: c.source, title: c.sourceTitle }))
  }
}
