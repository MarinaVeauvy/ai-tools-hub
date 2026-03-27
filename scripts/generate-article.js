// Generate and publish English AI tool review articles as static HTML
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const AMAZON_TAG = 'marinaveauv04-20';
const ADSENSE_ID = 'ca-pub-9764757165289980';
const fs = require('fs');
const path = require('path');

const TOPICS = [
  'Best AI Writing Tools 2026: Complete Comparison',
  'ChatGPT vs Claude vs Gemini: Which AI Is Best for Work?',
  'Best Free AI Tools for Small Business Owners',
  'Top 10 AI Productivity Tools That Actually Save Time',
  'Best AI Image Generators 2026: Midjourney vs DALL-E vs Stable Diffusion',
  'How to Use AI to Automate Your Business in 2026',
  'Best AI Tools for Content Creation: Complete Guide',
  'Top AI Coding Assistants: GitHub Copilot vs Cursor vs Claude',
  'Best AI Email Writing Tools for Professionals',
  'AI Tools for Social Media Management: Top Picks 2026',
  'Best AI Video Editing Tools for Beginners',
  'How to Make Money with AI Tools in 2026',
  'Best AI Tools for Data Analysis and Visualization',
  'Top AI Chatbots for Customer Service 2026',
  'Best AI Presentation Tools: Beautiful.ai vs Gamma vs Tome',
  'AI Tools for SEO: Complete Guide to Ranking Higher',
  'Best AI Translation Tools: Beyond Google Translate',
  'Top AI Tools for Freelancers and Solopreneurs',
  'AI Tools for Real Estate Agents: Listings, Marketing, CRM',
  'Best AI Note-Taking Apps: Notion AI vs Mem vs Reflect',
  'How to Build a Passive Income with AI Tools',
  'Best AI Tools for Teachers and Educators 2026',
  'AI Tools for Graphic Design: Canva AI vs Adobe Firefly',
  'Top AI Research Tools for Students and Academics',
  'Best AI Meeting Assistants: Otter vs Fireflies vs Fathom',
];

async function generateArticle(topic) {
  const prompt = `You are an expert AI tools reviewer. Write a comprehensive article.

TOPIC: ${topic}
AUDIENCE: Tech-savvy professionals, entrepreneurs, and business owners
LANGUAGE: English (US)

REQUIREMENTS:
- 2000-3000 words
- SEO optimized with the topic as primary keyword
- Include practical comparisons with pricing
- Pros and cons for each tool mentioned
- Include 2-3 Amazon affiliate links to relevant books: https://www.amazon.com/dp/{ASIN}?tag=${AMAZON_TAG}
  - Use real ASINs: 0593418484 (Atomic Habits), 0062316095 (Sapiens), 0062457713 (The Subtle Art), 0735211299 (Atomic Habits hardcover), 1591847818 (The Hard Thing About Hard Things), 0062960067 (AI Superpowers by Kai-Fu Lee)
- HTML formatted (H2, H3, tables, lists, paragraphs)
- Include a "Bottom Line" section at the end
- Do NOT include <html>, <head>, <body> tags — article content only

Respond with JSON:
{
  "title": "Article Title",
  "slug": "article-slug-here",
  "excerpt": "Meta description 150-160 chars",
  "content": "<h2>Section</h2><p>Content...</p>"
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['title', 'slug', 'excerpt', 'content'],
        },
      },
    }),
  });

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini empty: ' + JSON.stringify(data).substring(0, 200));
  return JSON.parse(text);
}

function buildHTML(article) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} — AI Tools Hub</title>
    <meta name="description" content="${article.excerpt}">
    <meta name="google-adsense-account" content="${ADSENSE_ID}">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0f0f1a; color: #d0d0d0; line-height: 1.8; }
        .container { max-width: 780px; margin: 0 auto; padding: 40px 20px; }
        a { color: #7c3aed; }
        h1 { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 16px; line-height: 1.2; }
        h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 32px 0 12px; padding-top: 16px; border-top: 1px solid #222; }
        h3 { font-size: 18px; font-weight: 600; color: #e0e0e0; margin: 20px 0 8px; }
        p { margin-bottom: 16px; }
        ul, ol { margin: 0 0 16px 24px; }
        li { margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 10px 14px; border: 1px solid #222; text-align: left; font-size: 14px; }
        th { background: #1a1a2e; color: #fff; font-weight: 600; }
        td { background: #111122; }
        .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
        .back { display: inline-block; color: #7c3aed; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
        .back:hover { text-decoration: underline; }
        .affiliate-note { background: #1a1a2e; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #666; margin-top: 40px; border-left: 3px solid #7c3aed; }
        footer { text-align: center; padding: 40px 20px; color: #444; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="../index.html" class="back">&larr; Back to AI Tools Hub</a>
        <h1>${article.title}</h1>
        <div class="meta">Updated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; AI Tools Hub</div>
        ${article.content}
        <div class="affiliate-note">
            <strong>Disclosure:</strong> Some links in this article are affiliate links. We may earn a commission at no extra cost to you. This helps us keep creating free content.
        </div>
    </div>
    <footer>AI Tools Hub &copy; 2026 | Independent AI Tool Reviews</footer>
</body>
</html>`;
}

function updateIndex(articles) {
  const indexPath = path.join(__dirname, '..', 'index.html');
  let index = fs.readFileSync(indexPath, 'utf8');

  const cards = articles.map(a => `
                <div class="article-card">
                    <span class="tag">Review</span>
                    <h3><a href="articles/${a.slug}.html">${a.title}</a></h3>
                    <p>${a.excerpt}</p>
                    <div class="meta">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>`).join('\n');

  index = index.replace(
    /<div class="article-grid" id="article-grid">[\s\S]*?<\/div>\s*<\/section>/,
    `<div class="article-grid" id="article-grid">\n${cards}\n            </div>\n        </section>`
  );

  fs.writeFileSync(indexPath, index);
  console.log('Index updated with ' + articles.length + ' articles');
}

async function main() {
  const count = parseInt(process.env.ARTICLE_COUNT || '3');
  console.log(`Generating ${count} articles...`);

  const articlesDir = path.join(__dirname, '..', 'articles');
  const existing = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));

  const available = TOPICS.filter(t => {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return !existing.includes(slug);
  });

  const published = [];
  for (let i = 0; i < Math.min(count, available.length); i++) {
    const topic = available[i];
    console.log(`\n[${i + 1}/${count}] ${topic}`);

    try {
      const article = await generateArticle(topic);
      const html = buildHTML(article);
      const filePath = path.join(articlesDir, article.slug + '.html');
      fs.writeFileSync(filePath, html);
      console.log(`  ✅ Saved: articles/${article.slug}.html`);
      published.push(article);
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }

    if (i < count - 1) await new Promise(r => setTimeout(r, 3000));
  }

  // Update index with all articles (existing + new)
  const allArticles = [];
  for (const file of fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'))) {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
    const titleMatch = content.match(/<title>(.*?) — AI Tools Hub<\/title>/);
    const descMatch = content.match(/<meta name="description" content="(.*?)">/);
    if (titleMatch) {
      allArticles.push({
        title: titleMatch[1],
        slug: file.replace('.html', ''),
        excerpt: descMatch ? descMatch[1] : '',
      });
    }
  }

  if (allArticles.length > 0) updateIndex(allArticles);

  console.log(`\n📊 Result: ${published.length}/${count} articles published. Total: ${allArticles.length}`);
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
