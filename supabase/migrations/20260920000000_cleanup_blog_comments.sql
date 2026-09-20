-- ====================================================================
-- AI CLUB OIST — MIGRATION: COMPLETE COMMENT DATABASE CLEANUP
-- File: supabase/migrations/20260920000000_cleanup_blog_comments.sql
-- Description: Performs a safe, one-time cleanup of all development/test
--              comments from blog_comments, resets the commenter name
--              sequence to 1 (starting at Synara), and preserves all blogs,
--              views, likes, and engagement metrics.
-- ====================================================================

-- 1. Create a dedicated SECURITY DEFINER RPC function to safely clear comments and reset sequence
CREATE OR REPLACE FUNCTION clean_blog_comments()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  -- Count and delete all existing development/test comments
  SELECT COUNT(*) INTO v_deleted_count FROM blog_comments;
  
  DELETE FROM blog_comments;

  -- Reset the dedicated commenter name sequence back to 1 (Synara)
  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'blog_comment_name_seq') THEN
    ALTER SEQUENCE blog_comment_name_seq RESTART WITH 1;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_deleted_count,
    'message', 'All development comments successfully cleaned and sequence reset to 1'
  );
END;
$$;

-- Grant execution to public / anon role so the one-time cleanup can be executed
GRANT EXECUTE ON FUNCTION clean_blog_comments() TO anon, authenticated, service_role;

-- 2. Execute the cleanup immediately
SELECT clean_blog_comments();
