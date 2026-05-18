export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    })
  }

  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      })
    }

    // Convert OpenAI-style messages to Gemini format
    const systemInstruction = messages.find(m => m.role === 'system')?.content || ''
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const contents = conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error('Gemini API error:', geminiRes.status, errText)

      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
          status: 429,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      })
    }

    const data = await geminiRes.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.'

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Chat handler error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    })
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}
