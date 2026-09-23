-- ====================================================================
-- AI CLUB OIST — BLOG BACKEND & ENGAGEMENT DATABASE SCHEMA
-- PostgreSQL / Supabase Schema Definition
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLE: blogs
-- Stores all blog articles with slug, metadata, and JSONB content paragraphs.
-- ====================================================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image TEXT,
  author TEXT NOT NULL DEFAULT 'AI Club, OIST',
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for blogs
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON blogs(status, published_at DESC);

-- ====================================================================
-- 3. TABLE: blog_views
-- Records individual genuine page views with anti-duplication tracking.
-- ====================================================================
CREATE TABLE IF NOT EXISTS blog_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for blog_views
CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_dedup ON blog_views(blog_id, visitor_hash, created_at DESC);

-- ====================================================================
-- 4. TABLE: blog_likes
-- Records distinct visitor likes with database-enforced uniqueness.
-- ====================================================================
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_blog_likes_blog_visitor UNIQUE (blog_id, visitor_id)
);

-- Indexes for blog_likes
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_visitor_id ON blog_likes(visitor_id);

-- ====================================================================
-- 5. TABLE: blog_comments
-- Records moderated visitor comments with length and status constraints.
-- ====================================================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  display_name VARCHAR(50) NOT NULL CHECK (char_length(trim(display_name)) >= 2),
  email VARCHAR(255) NULL DEFAULT NULL,
  comment VARCHAR(2000) NOT NULL CHECK (char_length(trim(comment)) >= 3),
  status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for blog_comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_approved ON blog_comments(blog_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_visitor ON blog_comments(visitor_id);

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- BLOGS POLICIES:
-- Public can read all published blogs
DROP POLICY IF EXISTS "Allow public read published blogs" ON blogs;
CREATE POLICY "Allow public read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

-- Only service_role can write or update blogs
DROP POLICY IF EXISTS "Allow service_role write blogs" ON blogs;
CREATE POLICY "Allow service_role write blogs" ON blogs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- BLOG VIEWS POLICIES:
-- Insert is allowed through the increment_blog_view RPC function (SECURITY DEFINER)
-- Direct SELECT is restricted to protect visitor privacy
DROP POLICY IF EXISTS "Allow public insert blog_views" ON blog_views;
CREATE POLICY "Allow public insert blog_views" ON blog_views
  FOR INSERT WITH CHECK (true);

-- BLOG LIKES POLICIES:
-- Public can read likes count and check their own like status
DROP POLICY IF EXISTS "Allow public read blog_likes" ON blog_likes;
CREATE POLICY "Allow public read blog_likes" ON blog_likes
  FOR SELECT USING (true);

-- Visitors can insert their own like (unique constraint prevents duplication)
DROP POLICY IF EXISTS "Allow visitor insert blog_likes" ON blog_likes;
CREATE POLICY "Allow visitor insert blog_likes" ON blog_likes
  FOR INSERT WITH CHECK (char_length(trim(visitor_id)) > 0);

-- Visitors can remove their own like
DROP POLICY IF EXISTS "Allow visitor delete blog_likes" ON blog_likes;
CREATE POLICY "Allow visitor delete blog_likes" ON blog_likes
  FOR DELETE USING (char_length(trim(visitor_id)) > 0);

-- BLOG COMMENTS POLICIES:
-- Public can view only approved comments
DROP POLICY IF EXISTS "Allow public read approved comments" ON blog_comments;
CREATE POLICY "Allow public read approved comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

-- Public can submit comments conforming to length checks
DROP POLICY IF EXISTS "Allow public submit comments" ON blog_comments;
CREATE POLICY "Allow public submit comments" ON blog_comments
  FOR INSERT WITH CHECK (
    char_length(trim(display_name)) >= 2 AND
    char_length(trim(display_name)) <= 50 AND
    char_length(trim(comment)) >= 3 AND
    char_length(trim(comment)) <= 2000
  );

-- ====================================================================
-- 7. ATOMIC FUNCTIONS / RPC PROCEDURES
-- ====================================================================

-- 7.1 ARTICLE VISIT VIEW TRACKING (COUNTS EVERY GENUINE VISIT)
CREATE OR REPLACE FUNCTION increment_blog_view(
  p_blog_id UUID,
  p_visitor_hash TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_views BIGINT;
  v_recent_burst_count INT;
BEGIN
  -- 1. Verify blog exists and is published
  IF NOT EXISTS (SELECT 1 FROM blogs WHERE id = p_blog_id AND status = 'published') THEN
    RAISE EXCEPTION 'Blog not found or not published';
  END IF;

  -- 2. Anti-abuse burst guard:
  -- Prevent automated scripts calling thousands of times per second with identical tokens.
  -- Sub-second bursts (< 1s) with the exact same token are debounced, while normal visits,
  -- repeat visits, and refreshes are cleanly recorded as new views.
  IF p_visitor_hash IS NOT NULL AND p_visitor_hash <> '' THEN
    SELECT COUNT(*) INTO v_recent_burst_count
    FROM blog_views
    WHERE blog_id = p_blog_id
      AND visitor_hash = p_visitor_hash
      AND created_at > (NOW() - INTERVAL '1 second');

    IF v_recent_burst_count > 0 THEN
      SELECT COUNT(*) INTO v_total_views FROM blog_views WHERE blog_id = p_blog_id;
      RETURN jsonb_build_object(
        'recorded', false,
        'views', v_total_views
      );
    END IF;
  END IF;

  -- 3. Record a new view row for this genuine article visit
  INSERT INTO blog_views (blog_id, visitor_hash)
  VALUES (
    p_blog_id,
    COALESCE(p_visitor_hash, 'visit_' || gen_random_uuid()::text)
  );

  -- 4. Return the real-time total view count
  SELECT COUNT(*) INTO v_total_views
  FROM blog_views
  WHERE blog_id = p_blog_id;

  RETURN jsonb_build_object(
    'recorded', true,
    'views', v_total_views
  );
END;
$$;

-- 7.2 ATOMIC LIKE TOGGLE (LIKE / UNLIKE WITH CONCURRENCY SAFETY)
CREATE OR REPLACE FUNCTION toggle_blog_like(
  p_blog_id UUID,
  p_visitor_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_id UUID;
  v_has_liked BOOLEAN;
  v_total_likes BIGINT;
BEGIN
  -- Verify blog exists and is published
  IF NOT EXISTS (SELECT 1 FROM blogs WHERE id = p_blog_id AND status = 'published') THEN
    RAISE EXCEPTION 'Blog not found or not published';
  END IF;

  -- Check existing like
  SELECT id INTO v_existing_id
  FROM blog_likes
  WHERE blog_id = p_blog_id AND visitor_id = p_visitor_id;

  IF v_existing_id IS NOT NULL THEN
    -- Remove like
    DELETE FROM blog_likes WHERE id = v_existing_id;
    v_has_liked := FALSE;
  ELSE
    -- Add like
    INSERT INTO blog_likes (blog_id, visitor_id)
    VALUES (p_blog_id, p_visitor_id);
    v_has_liked := TRUE;
  END IF;

  -- Return updated total count
  SELECT COUNT(*) INTO v_total_likes
  FROM blog_likes
  WHERE blog_id = p_blog_id;

  RETURN jsonb_build_object(
    'liked', v_has_liked,
    'likes', v_total_likes
  );
END;
$$;

-- 7.3 COMPREHENSIVE ENGAGEMENT METRICS QUERY
CREATE OR REPLACE FUNCTION get_blog_engagement(
  p_blog_id UUID,
  p_visitor_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_views BIGINT;
  v_likes BIGINT;
  v_comments BIGINT;
  v_liked BOOLEAN := FALSE;
BEGIN
  SELECT COUNT(*) INTO v_views FROM blog_views WHERE blog_id = p_blog_id;
  SELECT COUNT(*) INTO v_likes FROM blog_likes WHERE blog_id = p_blog_id;
  SELECT COUNT(*) INTO v_comments FROM blog_comments WHERE blog_id = p_blog_id AND status = 'approved';

  IF p_visitor_id IS NOT NULL AND char_length(p_visitor_id) > 0 THEN
    SELECT EXISTS (
      SELECT 1 FROM blog_likes WHERE blog_id = p_blog_id AND visitor_id = p_visitor_id
    ) INTO v_liked;
  END IF;

  RETURN jsonb_build_object(
    'views', v_views,
    'likes', v_likes,
    'comment_count', v_comments,
    'user_has_liked', v_liked
  );
END;
$$;

-- 7.4 SEQUENTIAL AI COMMENTER NAMES PROCEDURE
CREATE SEQUENCE IF NOT EXISTS blog_comment_name_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION add_blog_comment(
  p_blog_id UUID,
  p_visitor_id TEXT,
  p_comment TEXT,
  p_display_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trimmed_comment TEXT := trim(p_comment);
  v_assigned_name TEXT;
  v_new_comment RECORD;
  v_recent_comment_count INT;
  v_seq_val BIGINT;
  v_name_index INT;
  v_names TEXT[] := ARRAY[
    'Curious Reader',
    'Curious Mind',
    'Thought Seeker',
    'Idea Seeker',
    'Insight Seeker',
    'Future Reader',
    'Thought Explorer',
    'Idea Explorer',
    'Knowledge Seeker',
    'Digital Reader'
  ];
BEGIN
  -- Validate blog
  IF NOT EXISTS (SELECT 1 FROM blogs WHERE id = p_blog_id AND status = 'published') THEN
    RAISE EXCEPTION 'Blog not found or not published';
  END IF;

  -- Validate comment body
  IF char_length(v_trimmed_comment) < 3 OR char_length(v_trimmed_comment) > 2000 THEN
    RAISE EXCEPTION 'Comment must be between 3 and 2000 characters';
  END IF;

  -- Anti-spam: enforce 30-second cooldown per visitor
  SELECT COUNT(*) INTO v_recent_comment_count
  FROM blog_comments
  WHERE blog_id = p_blog_id
    AND visitor_id = p_visitor_id
    AND created_at > (NOW() - INTERVAL '30 seconds');

  IF v_recent_comment_count > 0 THEN
    RAISE EXCEPTION 'Please wait 30 seconds before submitting another comment';
  END IF;

  -- Deterministic Sequential Name Assignment:
  -- If client provided a valid name from the approved 15-name list, accept it.
  -- Otherwise, atomically pull next index from the database sequence (race-condition free).
  IF p_display_name IS NOT NULL AND p_display_name = ANY(v_names) THEN
    v_assigned_name := p_display_name;
  ELSE
    v_seq_val := nextval('blog_comment_name_seq');
    v_name_index := ((v_seq_val - 1) % array_length(v_names, 1)) + 1;
    v_assigned_name := v_names[v_name_index];
  END IF;

  INSERT INTO blog_comments (
    blog_id,
    visitor_id,
    display_name,
    email,
    comment,
    status
  )
  VALUES (
    p_blog_id,
    p_visitor_id,
    v_assigned_name,
    NULL,
    v_trimmed_comment,
    'approved'
  )
  RETURNING id, blog_id, display_name, comment, status, created_at
  INTO v_new_comment;

  RETURN jsonb_build_object(
    'id', v_new_comment.id,
    'blog_id', v_new_comment.blog_id,
    'display_name', v_new_comment.display_name,
    'comment', v_new_comment.comment,
    'status', v_new_comment.status,
    'created_at', v_new_comment.created_at
  );
END;
$$;

-- ====================================================================
-- 8. INITIAL DATA SEED MIGRATION
-- Preserves existing AI Club OIST blog article.
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
  'the-silent-shift-how-ai-stopped-just-talking-and-started-working',
  'The Silent Shift: How AI Quietly Stopped Just Talking — and Started Working',
  'AI is quietly moving beyond chatbots. Agents can now plan, use tools, check their work, and complete tasks — changing what it means to actually know AI.',
  'AI Club, OIST',
  ARRAY['AI', 'AI Agents', 'Future of AI'],
  '/blog/ai-blog-cover.png',
  '2026-09-14 00:00:00+00',
  '[
    "A deep dive by AI Club, OIST.",
    "There''s a version of AI everyone already knows. You type a question. It types back an answer. Simple, useful, and — until recently — the whole story. That story just changed.",
    "In 2024, roughly 1 in 3 new enterprise applications had any form of AI agent built into them. By 2026, that number has jumped to nearly 4 in 5. The global market for these systems has crossed $10.9 billion, growing by over 40% in a single year.",
    "This isn''t a new chatbot. It''s a new category of AI — one that doesn''t just respond, it acts. And if you''re studying AI/ML right now, this is the shift that will define what “knowing AI” means for the next five years.",
    "Chatbot vs. Agent — The Line Most People Miss",
    "“A chatbot answers when you ask. An agent works until the job is done.” That one line is the entire shift, so let''s unpack it.",
    "A chatbot waits for your prompt, gives one response, and stops. You''re doing all the thinking — the AI is just a very fast typist.",
    "An AI agent works differently. Give it a goal, and it will:",
    "• Break the goal into steps",
    "• Use tools (search, code, apps, databases) to complete each step",
    "• Check its own output before moving forward",
    "• Loop a human back in only when a real decision is needed",
    "In short: a chatbot gives you an answer. An agent gives you a finished task.",
    "Why This Isn''t Hype — It''s Already Happening",
    "This isn''t a “someday” technology. It''s already reshaping real industries:",
    "• Banking & insurance lead adoption, with nearly half of organizations already running agents in live production — not pilot testing, actual deployed systems.",
    "• The average enterprise deployment pays for itself in just over 5 months.",
    "• Workers using AI agents in production environments are reporting several hours saved per week — real time, not projected time.",
    "And yet — here''s the part most explainer posts skip: Adoption is fast. Trust is not.",
    "Most companies that experiment with agents never scale them. The gap isn''t technical capability — it''s confidence.",
    "Businesses are still learning how much autonomy they''re comfortable handing over, and how to verify an AI''s decisions before trusting them fully.",
    "That gap — between “we built one” and “we trust one” — is exactly where the most important work in AI is happening right now.",
    "Why AI/ML Students Should Care — Right Now",
    "Here''s the uncomfortable truth: knowing how to prompt an AI is quickly becoming a baseline skill, not a differentiating one.",
    "The next wave of opportunity is in a different question: Can you design, monitor, and govern a system that acts on its own?",
    "That means understanding:",
    "• How agents plan multi-step tasks",
    "• How they use external tools and APIs",
    "• How to build in checks so they don''t go wrong silently",
    "• How to evaluate whether an agent''s decision was actually correct",
    "This is a fundamentally different skill from “using ChatGPT well” — and it''s the skill recruiters are starting to filter for.",
    "What This Means for AI Club, OIST",
    "We''re not just tracking what AI can generate anymore — we''re tracking what it can now do on its own, and what that demands from the people who build, monitor, and trust these systems.",
    "Expect more of our sessions, projects, and discussions this year to move in that direction — from “how do I get a good output from AI” to “how do I build and trust a system that works on its own.”",
    "A Question Worth Sitting With",
    "Would you trust an AI agent to complete a real task on its own — or do you still want a human checking every step?",
    "That answer — more than any tool or model — is what will define how you use AI for the rest of your career."
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
  updated_at = NOW();

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
