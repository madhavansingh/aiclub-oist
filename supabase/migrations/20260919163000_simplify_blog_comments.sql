-- ====================================================================
-- AI CLUB OIST — MIGRATION: SIMPLIFY BLOG COMMENTS
-- File: supabase/migrations/20260919163000_simplify_blog_comments.sql
-- Description: Makes email column optional, updates add_blog_comment
--              procedure to accept 4 arguments (auto-generating creative
--              display names), and drops obsolete email validation checks.
-- ====================================================================

-- 1. Make email optional on blog_comments table
ALTER TABLE blog_comments ALTER COLUMN email DROP NOT NULL;
ALTER TABLE blog_comments ALTER COLUMN email SET DEFAULT NULL;

-- 2. Drop legacy 5-parameter function if it exists
DROP FUNCTION IF EXISTS add_blog_comment(UUID, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS add_blog_comment(UUID, TEXT, TEXT, TEXT);

-- 3. Create or replace the 4-parameter add_blog_comment RPC procedure
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
  v_generated_name TEXT;
  v_new_comment RECORD;
  v_recent_comment_count INT;
  v_prefixes TEXT[] := ARRAY[
    'Neon', 'Curious', 'Future', 'Pixel', 'Code', 'Digital', 'Tech', 'AI', 'Logic', 'Circuit',
    'Neural', 'Quantum', 'Cyber', 'Algorithmic', 'Binary', 'Deep', 'Vector', 'Matrix', 'Data', 'Silicon',
    'Cloud', 'Parallel', 'Tensor', 'Autonomous', 'Synthetic', 'Infinite', 'Pioneer', 'Visionary', 'Adaptive', 'Meta'
  ];
  v_nouns TEXT[] := ARRAY[
    'Thinker', 'Builder', 'Coder', 'Mind', 'Explorer', 'Dreamer', 'Wanderer', 'Observer', 'Crafter', 'Architect',
    'Voyager', 'Philosopher', 'Engineer', 'Researcher', 'Scholar', 'Innovator', 'Strategist', 'Navigator', 'Analyst',
    'Designer', 'Mechanic', 'Hacker', 'Creator', 'Seeker', 'Synthesizer', 'Operator', 'Specialist', 'Agent', 'Pioneer'
  ];
BEGIN
  -- 1. Verify blog exists and is published
  IF NOT EXISTS (SELECT 1 FROM blogs WHERE id = p_blog_id AND status = 'published') THEN
    RAISE EXCEPTION 'Blog not found or not published';
  END IF;

  -- 2. Validate comment length
  IF char_length(v_trimmed_comment) < 3 OR char_length(v_trimmed_comment) > 2000 THEN
    RAISE EXCEPTION 'Comment must be between 3 and 2000 characters';
  END IF;

  -- 3. Anti-spam: enforce 30-second cooldown per visitor
  SELECT COUNT(*) INTO v_recent_comment_count
  FROM blog_comments
  WHERE blog_id = p_blog_id
    AND visitor_id = p_visitor_id
    AND created_at > (NOW() - INTERVAL '30 seconds');

  IF v_recent_comment_count > 0 THEN
    RAISE EXCEPTION 'Please wait 30 seconds before submitting another comment';
  END IF;

  -- 4. Generate or sanitize creative public display alias
  IF p_display_name IS NOT NULL 
     AND char_length(trim(p_display_name)) >= 2 
     AND char_length(trim(p_display_name)) <= 50
     AND trim(p_display_name) NOT IN ('Admin', 'AI Club OIST', 'Developer', 'Anonymous', 'User', 'Guest', 'Mod') THEN
    v_generated_name := trim(p_display_name);
  ELSE
    v_generated_name := v_prefixes[1 + floor(random() * array_length(v_prefixes, 1))::int] || ' ' ||
                        v_nouns[1 + floor(random() * array_length(v_nouns, 1))::int] || ' · ' ||
                        (10 + floor(random() * 90))::text;
  END IF;

  -- 5. Insert comment without requiring personal email
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
    v_generated_name,
    NULL,
    v_trimmed_comment,
    'approved'
  )
  RETURNING id, blog_id, display_name, comment, status, created_at
  INTO v_new_comment;

  -- 6. Return inserted comment object
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
