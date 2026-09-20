-- ====================================================================
-- AI CLUB OIST — MIGRATION: 10 SEQUENTIAL COMMENTER NAMES & CLEANUP
-- File: supabase/migrations/20260920000000_sequential_curious_reader_names_and_cleanup.sql
-- Description:
--   1. Updates add_blog_comment to sequentially assign names from the
--      new 10-name list:
--        1. Curious Reader
--        2. Curious Mind
--        3. Thought Seeker
--        4. Idea Seeker
--        5. Insight Seeker
--        6. Future Reader
--        7. Thought Explorer
--        8. Idea Explorer
--        9. Knowledge Seeker
--       10. Digital Reader
--      Wraps back to Curious Reader after the 10th name.
--   2. Provides clean_blog_comments() to delete test comments and reset
--      the sequence back to position 1.
--   3. Executes cleanup of existing development/test comments.
-- ====================================================================

-- 1. Create or reset the sequence
CREATE SEQUENCE IF NOT EXISTS blog_comment_name_seq START WITH 1 INCREMENT BY 1;

-- 2. Update add_blog_comment RPC procedure with new 10-name list
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
  -- Verify blog exists and is published
  IF NOT EXISTS (SELECT 1 FROM blogs WHERE id = p_blog_id AND status = 'published') THEN
    RAISE EXCEPTION 'Blog not found or not published';
  END IF;

  -- Validate comment length
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

  -- Deterministic Sequential Name Assignment
  IF p_display_name IS NOT NULL AND p_display_name = ANY(v_names) THEN
    v_assigned_name := p_display_name;
  ELSE
    v_seq_val := nextval('blog_comment_name_seq');
    v_name_index := ((v_seq_val - 1) % array_length(v_names, 1)) + 1;
    v_assigned_name := v_names[v_name_index];
  END IF;

  -- Insert comment without requiring personal email
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

-- 3. Procedure for safely cleaning comments and resetting sequence to 1
CREATE OR REPLACE FUNCTION clean_blog_comments()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  SELECT COUNT(*) INTO v_deleted_count FROM blog_comments;
  DELETE FROM blog_comments;

  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'blog_comment_name_seq') THEN
    ALTER SEQUENCE blog_comment_name_seq RESTART WITH 1;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_deleted_count,
    'message', 'All comments cleared and sequence reset to Curious Reader (index 1)'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION clean_blog_comments() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION add_blog_comment(UUID, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 4. Clean existing development comments and reset sequence
SELECT clean_blog_comments();
