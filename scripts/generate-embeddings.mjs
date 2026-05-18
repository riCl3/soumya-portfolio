import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Load source data
const content = JSON.parse(readFileSync(join(ROOT, 'public/content.json'), 'utf-8'))

const blogDir = join(ROOT, 'public/blog/posts')
const blogFiles = readdirSync(blogDir).filter(f => f.endsWith('.md'))
const blogPosts = blogFiles.map(f => ({
  slug: f.replace('.md', ''),
  content: readFileSync(join(blogDir, f), 'utf-8')
}))

// Chunking: convert portfolio data into semantic text chunks
function generateChunks() {
  const chunks = []
  const { hero, experience, education, projects, skills } = content

  // Bio chunk
  chunks.push({
    id: 'bio',
    text: `${hero.name} is an ${hero.title}. ${hero.bio}`,
    source: 'profile',
    sourceTitle: 'About'
  })

  // Tagline chunk
  chunks.push({
    id: 'tagline',
    text: `${hero.name}'s professional tagline is "${hero.tagline}". ${hero.name} is based in ${hero.location}.`,
    source: 'profile',
    sourceTitle: 'Tagline'
  })

  // Experience chunks
  for (const exp of experience) {
    chunks.push({
      id: `exp-${exp.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      text: `${hero.name} works as ${exp.role} at ${exp.company} (${exp.period}). Key contributions: ${exp.highlights.join('; ')}.`,
      source: 'experience',
      sourceTitle: exp.company
    })
  }

  // Education chunk
  chunks.push({
    id: 'education',
    text: `${hero.name} is pursuing a ${education.degree} from ${education.institution} (${education.period}) with a CGPA of ${education.cgpa}.`,
    source: 'education',
    sourceTitle: 'Education'
  })

  // Project chunks
  for (const proj of projects) {
    chunks.push({
      id: `proj-${proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      text: `${hero.name} built "${proj.title}": ${proj.description} Technologies used: ${proj.tags.join(', ')}.`,
      source: 'project',
      sourceTitle: proj.title
    })
  }

  // Skills chunks (one per category)
  for (const [category, items] of Object.entries(skills)) {
    chunks.push({
      id: `skills-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      text: `${hero.name}'s ${category} skills include: ${items.join(', ')}.`,
      source: 'skills',
      sourceTitle: category
    })
  }

  // Blog post chunks
  for (const post of blogPosts) {
    const sections = post.content.split(/^## /m).filter(Boolean)
    for (const section of sections) {
      const lines = section.trim().split('\n')
      const heading = lines[0].trim()
      const body = lines.slice(1).join('\n').trim()
      if (body.length > 20) {
        chunks.push({
          id: `blog-${post.slug}-${heading.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          text: `From ${hero.name}'s blog post "${post.slug.replace(/-/g, ' ')}", section "${heading}": ${body.replace(/[#*`|\[\]]/g, '').replace(/\n+/g, ' ').slice(0, 500)}`,
          source: 'blog',
          sourceTitle: heading
        })
      }
    }
  }

  // General Q&A chunks for common recruiter questions
  chunks.push({
    id: 'general-contact',
    text: `To contact ${hero.name}, you can reach out via GitHub (github.com/riCl3), LinkedIn (linkedin.com/in/soumya-das-nit), or email (soumyaric2@gmail.com). ${hero.name} is open to AI Engineer roles.`,
    source: 'contact',
    sourceTitle: 'Contact'
  })

  chunks.push({
    id: 'general-availability',
    text: `${hero.name} is currently an ${hero.role || 'AI Engineer Intern'} at SuperAlign.ai and is open to new opportunities in AI Engineering, ML Infrastructure, and LLM systems. ${hero.name} has experience with distributed systems, ONNX deployment, and LLM benchmarking.`,
    source: 'availability',
    sourceTitle: 'Availability'
  })

  return chunks
}

// Main
async function main() {
  console.log('Generating chunks from portfolio data...')
  const chunks = generateChunks()
  console.log(`Created ${chunks.length} chunks`)

  console.log('Loading embedding model (all-MiniLM-L6-v2)...')
  const { pipeline } = await import('@huggingface/transformers')
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    dtype: 'q8'
  })

  console.log('Computing embeddings...')
  const texts = chunks.map(c => c.text)
  const output = await extractor(texts, { pooling: 'mean', normalize: true })

  // Attach embeddings to chunks
  const dim = output.dims[1]
  for (let i = 0; i < chunks.length; i++) {
    const start = i * dim
    const end = start + dim
    chunks[i].embedding = Array.from(output.data.slice(start, end))
  }

  const outPath = join(ROOT, 'public/embeddings/chunks.json')
  writeFileSync(outPath, JSON.stringify(chunks, null, 2))
  console.log(`Wrote ${chunks.length} chunks with embeddings to ${outPath}`)
  console.log(`File size: ${(Buffer.byteLength(JSON.stringify(chunks)) / 1024).toFixed(1)} KB`)
}

main().catch(err => {
  console.error('Failed to generate embeddings:', err)
  process.exit(1)
})
