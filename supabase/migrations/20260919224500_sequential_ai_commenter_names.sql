-- ====================================================================
-- AI CLUB OIST — MIGRATION: SEQUENTIAL AI-INSPIRED COMMENTER NAMES
-- File: supabase/migrations/20260919224500_sequential_ai_commenter_names.sql
-- Description: Updates add_blog_comment to sequentially assign commenter
--              names from the fixed 15-name list:
--              Synara, Velix, Aivex, Nexara, Elvyn, Zyven, Auronix,
--              Veyrix, Nexion, Arvexa, Kyron, Eviron, Zorven, Nyvera, Avion.
--              Wraps back to Synara after Avion.
-- ====================================================================

-- 1. Create a persistent PostgreSQL sequence for atomic, race-condition-free assignment
CREATE SEQUENCE IF NOT EXISTS blog_comment_name_seq START WITH 1 INCREMENT BY 1;

-- 2. Update add_blog_comment RPC procedure
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
    'Synara', 'Velix', 'Aivex', 'Nexara', 'Elvyn',
    'Zyven', 'Auronix', 'Veyrix', 'Nexion', 'Arvexa',
    'Kyron', 'Eviron', 'Zorven', 'Nyvera', 'Avion'
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

  -- 4. Deterministic Sequential Name Assignment:
  -- If client provided a valid name from the approved 15-name list, accept it.
  -- Otherwise, atomically pull the next index from the database sequence (race-condition free).
  IF p_display_name IS NOT NULL AND p_display_name = ANY(v_names) THEN
    v_assigned_name := p_display_name;
  ELSE
    v_seq_val := nextval('blog_comment_name_seq');
    v_name_index := ((v_seq_val - 1) % array_length(v_names, 1)) + 1;
    v_assigned_name := v_names[v_name_index];
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
    v_assigned_name,
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
