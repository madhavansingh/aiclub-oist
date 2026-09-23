-- ====================================================================
-- AI CLUB OIST — MIGRATION: ADD WEEK 2 BLOG POST
-- Article: 🚨 AI UPDATE: Google Just Made a Big Move in Voice AI!
-- ====================================================================

INSERT INTO blogs (
  slug,
  title,
  excerpt,
  author,
  tags,
  cover_image,
  published_at,
  content,
  status
)
VALUES (
  'google-gemini-3-8-live-voice-ai-update',
  '🚨 AI UPDATE: Google Just Made a Big Move in Voice AI!',
  'Google has released Gemini 3.8 Live, a new voice model designed for more natural and cost-efficient conversational AI — with Extended Thinking that can reason while speaking.',
  'AI Club, OIST',
  ARRAY['AI', 'Voice AI', 'Gemini', 'Generative AI'],
  '/blog/ai-blog-cover.png',
  '2026-09-23 00:00:00+00',
  '[
    "🚨 AI UPDATE: Google just made a big move in Voice AI! 🎙️🤖",
    "Google has released Gemini 3.8 Live, a new voice model designed for more natural and cost-efficient conversational AI.",
    "But the really interesting part is Gemini 3.8 Live Extended Thinking.",
    "🧠 It can reason while speaking.",
    "Instead of a voice AI going silent while it “thinks” and then responding, the model can process information and continue the conversation more naturally.",
    "📊 Some benchmark results:",
    "🥇 82.6 on Artificial Analysis'' Speech-to-Speech Quality Index",
    "🔊 97.7% on Big Bench Audio",
    "🏦 35.1% on Sierra''s banking voice benchmark",
    "And that last number is important.",
    "It shows that understanding what someone says and actually completing a complicated real-world conversation are two different problems.",
    "💡 Why should students care?",
    "Voice AI is becoming a major area in AI/ML, Generative AI and Agentic AI.",
    "This opens opportunities for projects like:",
    "🎙️ AI voice assistants",
    "📞 Customer-support agents",
    "🏦 Banking assistants",
    "📅 Voice-based appointment booking",
    "🧑‍💻 AI interview assistants",
    "🌐 Multilingual voice agents",
    "The bigger lesson for anyone building AI projects:",
    "Don''t just focus on how powerful the model is. Focus on the task you''re giving it.",
    "A narrow task with a clear outcome can often be much easier to make reliable than a general-purpose voice agent.",
    "🚀 If you''re learning AI/ML, Voice AI + LLMs + Agents is definitely a space worth exploring."
  ]'::jsonb,
  'published'
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  tags = EXCLUDED.tags,
  author = EXCLUDED.author,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();
