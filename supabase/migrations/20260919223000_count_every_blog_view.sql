-- ====================================================================
-- AI CLUB OIST — MIGRATION: COUNT EVERY ARTICLE VISIT AS A VIEW
-- File: supabase/migrations/20260919223000_count_every_blog_view.sql
-- Description: Updates increment_blog_view to register every genuine
--              article visit as a new row in blog_views without
--              visitor-based 12-hour deduplication.
-- ====================================================================

-- Update increment_blog_view function
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
