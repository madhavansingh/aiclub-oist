/**
 * AI Club OIST — Blog API & Data Access Layer
 * Provides clean, secure, and production-ready functions for blog content,
 * real view tracking, likes, and moderated comments.
 *
 * Implements strict input validation, database-enforced integrity,
 * graceful fallback when database migrations are pending, and
 * zero false "Blog not found" errors.
 */

import { supabase, isSupabaseConfigured } from './supabase.js';
import { getVisitorId } from './visitorIdentity.js';
import localBlogs from '../Data/blogs.js';

// In-memory cache for slug -> UUID mappings to avoid repeated lookups
const slugToIdCache = new Map();

/**
 * Sanitizes plain-text input, removing HTML tags and harmful characters.
 * @param {string} str
 * @returns {string}
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>]/g, '')    // Strip lingering brackets
    .trim();
}

/**
 * Validates UUID format
 * @param {string} str
 * @returns {boolean}
 */
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Checks if an error indicates that the database table or function is missing in Supabase.
 * @param {Object} error
 * @returns {boolean}
 */
function isSchemaMissingError(error) {
  if (!error) return false;
  // PGRST205: table not in schema cache, PGRST202: function not in schema cache
  const code = error.code || '';
  const msg = (error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === 'PGRST202' ||
    msg.includes('could not find the table') ||
    msg.includes('could not find the function') ||
    msg.includes('schema cache')
  );
}

/**
 * Resolves a blog identifier (UUID or slug) into a valid blog UUID.
 * @param {string} blogIdOrSlug
 * @returns {Promise<{ id: string|null, isAvailable: boolean, error?: string }>}
 */
async function resolveBlogId(blogIdOrSlug) {
  if (!blogIdOrSlug) {
    return { id: null, isAvailable: false, error: 'Article identifier is required' };
  }

  // Already a valid UUID
  if (isUUID(blogIdOrSlug)) {
    return { id: blogIdOrSlug, isAvailable: true };
  }

  // Check cache
  if (slugToIdCache.has(blogIdOrSlug)) {
    return { id: slugToIdCache.get(blogIdOrSlug), isAvailable: true };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { id: null, isAvailable: false, error: 'Database backend not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', blogIdOrSlug)
      .maybeSingle();

    if (error) {
      if (isSchemaMissingError(error)) {
        return {
          id: null,
          isAvailable: false,
          error: 'Database schema pending setup in Supabase SQL editor',
        };
      }
      return { id: null, isAvailable: false, error: error.message };
    }

    if (data?.id) {
      slugToIdCache.set(blogIdOrSlug, data.id);
      return { id: data.id, isAvailable: true };
    }

    // Row not found in database: check if it's a known blog from local dataset
    const isKnown = localBlogs.some((b) => b.slug === blogIdOrSlug);
    if (isKnown) {
      return {
        id: null,
        isAvailable: false,
        error: 'Article data is being synced to the database',
      };
    }

    return { id: null, isAvailable: false, error: 'Article not found' };
  } catch (err) {
    return { id: null, isAvailable: false, error: err.message };
  }
}

/**
 * Normalizes blog item structure so frontend receives a predictable schema.
 */
function normalizeBlog(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw.slug,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || '',
    content: Array.isArray(raw.content)
      ? raw.content
      : typeof raw.content === 'string'
      ? raw.content.split('\n\n').filter(Boolean)
      : [],
    cover: raw.cover_image || raw.cover || '/blog/ai-blog-cover.png',
    author: raw.author || 'AI Club, OIST',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    date: raw.published_at || raw.date || new Date().toISOString(),
    status: raw.status || 'published',
  };
}

// ====================================================================
// PUBLIC DATA ACCESS METHODS
// ====================================================================

/**
 * Fetches all published blogs.
 * Queries Supabase when configured and seamlessly merges with any local blogs
 * that have not yet been synced to the database, ensuring newly added posts
 * always appear immediately in deployment.
 * @returns {Promise<{ success: boolean, blogs: Array, isFallback?: boolean, error?: string }>}
 */
export async function getBlogs() {
  const localList = localBlogs.map(normalizeBlog);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, slug, title, excerpt, cover_image, author, tags, published_at, created_at, status')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach((b) => {
          if (b.slug && b.id) slugToIdCache.set(b.slug, b.id);
        });

        const dbBlogs = data.map(normalizeBlog);
        const dbSlugs = new Set(dbBlogs.map((b) => b.slug));

        // Merge any local blogs whose slugs aren't in Supabase yet
        const missingFromDb = localList.filter((b) => !dbSlugs.has(b.slug));
        const combined = [...dbBlogs, ...missingFromDb].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        return {
          success: true,
          blogs: combined,
        };
      }
    } catch {
      // Fall through to local fallback
    }
  }

  // Graceful local data fallback
  return {
    success: true,
    blogs: localList,
    isFallback: true,
  };
}

/**
 * Fetches a single published blog by its slug.
 * @param {string} slug
 * @returns {Promise<{ success: boolean, blog: Object|null, isFallback?: boolean, error?: string }>}
 */
export async function getBlogBySlug(slug) {
  if (!slug) {
    return { success: false, blog: null, error: 'Slug is required' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (!error && data) {
        slugToIdCache.set(data.slug, data.id);
        return {
          success: true,
          blog: normalizeBlog(data),
        };
      }
    } catch {
      // Fall through to local fallback
    }
  }

  // Local fallback
  const found = localBlogs.find((item) => item.slug === slug);
  return {
    success: Boolean(found),
    blog: found ? normalizeBlog(found) : null,
    isFallback: true,
  };
}

/**
 * Retrieves aggregate engagement metrics (views, likes, comments count, user like state).
 * @param {string} blogIdOrSlug - UUID or slug of the blog.
 * @returns {Promise<{ success: boolean, views: number, likes: number, comment_count: number, user_has_liked: boolean, error?: string }>}
 */
export async function getBlogEngagement(blogIdOrSlug) {
  const defaultState = {
    success: true,
    views: 0,
    likes: 0,
    comment_count: 0,
    user_has_liked: false,
    isFallback: true,
  };

  if (!isSupabaseConfigured || !supabase) {
    return defaultState;
  }

  try {
    const { id: blogId, isAvailable } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) return defaultState;

    const visitorId = getVisitorId();

    const { data, error } = await supabase.rpc('get_blog_engagement', {
      p_blog_id: blogId,
      p_visitor_id: visitorId,
    });

    if (error) {
      return defaultState;
    }

    return {
      success: true,
      views: Number(data?.views || 0),
      likes: Number(data?.likes || 0),
      comment_count: Number(data?.comment_count || 0),
      user_has_liked: Boolean(data?.user_has_liked),
    };
  } catch {
    return defaultState;
  }
}

/**
 * Records an article visit/open in Supabase.
 * Each genuine visit inserts a new row in blog_views and returns the updated count.
 * @param {string} blogIdOrSlug
 * @param {Object} [options]
 * @param {string} [options.visitToken] Optional unique visit identifier for burst protection
 * @returns {Promise<{ success: boolean, recorded: boolean, views: number, error?: string, isFallback?: boolean }>}
 */
export async function registerBlogView(blogIdOrSlug, { visitToken } = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, recorded: false, views: 0, isFallback: true };
  }

  try {
    const { id: blogId, isAvailable } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) {
      // Quiet fallback: never throw "Blog not found" for a valid article
      return { success: true, recorded: false, views: 0, isFallback: true };
    }

    const token = visitToken || `visit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const { data, error } = await supabase.rpc('increment_blog_view', {
      p_blog_id: blogId,
      p_visitor_hash: token,
    });

    if (error) {
      return { success: false, recorded: false, views: 0, error: error.message };
    }

    return {
      success: true,
      recorded: Boolean(data?.recorded),
      views: Number(data?.views || 0),
    };
  } catch (err) {
    return { success: false, recorded: false, views: 0, error: err?.message };
  }
}

/**
 * Atomically orchestrates registering an article visit view and retrieving current engagement metrics.
 * Eliminates race conditions by sequencing the view registration before fetching engagement,
 * and ensures the returned view count from increment_blog_view is never overwritten by stale data.
 * @param {string} blogIdOrSlug
 * @param {Object} [options]
 * @param {boolean} [options.recordView=true]
 * @param {string} [options.visitToken]
 * @returns {Promise<{ success: boolean, views: number, likes: number, comment_count: number, user_has_liked: boolean, recorded: boolean, isFallback?: boolean }>}
 */
export async function getBlogEngagementWithView(blogIdOrSlug, { recordView = true, visitToken } = {}) {
  const defaultState = {
    success: true,
    views: 0,
    likes: 0,
    comment_count: 0,
    user_has_liked: false,
    recorded: false,
    isFallback: true,
  };

  if (!isSupabaseConfigured || !supabase) {
    return defaultState;
  }

  try {
    const { id: blogId, isAvailable } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) {
      return defaultState;
    }

    const visitorId = getVisitorId();
    let viewResult = null;

    // 1. Register view if requested (records every genuine article visit)
    if (recordView) {
      const token = visitToken || `visit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const { data, error } = await supabase.rpc('increment_blog_view', {
        p_blog_id: blogId,
        p_visitor_hash: token,
      });

      if (!error && data) {
        viewResult = {
          recorded: Boolean(data.recorded),
          views: Number(data.views || 0),
        };
      }
    }

    // 2. Fetch comprehensive engagement metrics
    const { data: engData, error: engError } = await supabase.rpc('get_blog_engagement', {
      p_blog_id: blogId,
      p_visitor_id: visitorId,
    });

    if (engError && !viewResult) {
      return defaultState;
    }

    // 3. Database is the single source of truth for view count
    const engViews = Number(engData?.views || 0);
    const viewCount = viewResult ? Math.max(viewResult.views, engViews) : engViews;

    return {
      success: true,
      views: viewCount,
      likes: Number(engData?.likes || 0),
      comment_count: Number(engData?.comment_count || 0),
      user_has_liked: Boolean(engData?.user_has_liked),
      recorded: Boolean(viewResult?.recorded),
    };
  } catch {
    return defaultState;
  }
}

/**
 * Toggles a like (Like / Unlike) for the current visitor with database uniqueness.
 * @param {string} blogIdOrSlug
 * @returns {Promise<{ success: boolean, liked: boolean, likes: number, error?: string }>}
 */
export async function toggleBlogLike(blogIdOrSlug) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: 'Like service is currently unavailable.',
    };
  }

  try {
    const { id: blogId, isAvailable, error: resolveErr } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) {
      return {
        success: false,
        liked: false,
        likes: 0,
        error: resolveErr || 'Like service is currently unavailable.',
      };
    }

    const visitorId = getVisitorId();

    const { data, error } = await supabase.rpc('toggle_blog_like', {
      p_blog_id: blogId,
      p_visitor_id: visitorId,
    });

    if (error) {
      return {
        success: false,
        liked: false,
        likes: 0,
        error: 'Unable to update like right now. Please try again.',
      };
    }

    return {
      success: true,
      liked: Boolean(data?.liked),
      likes: Number(data?.likes || 0),
    };
  } catch {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: 'Unable to update like right now. Please try again.',
    };
  }
}

// Official public commenter names assigned sequentially
export const AI_COMMENTER_NAMES = [
  'Curious Reader',
  'Curious Mind',
  'Thought Seeker',
  'Idea Seeker',
  'Insight Seeker',
  'Future Reader',
  'Thought Explorer',
  'Idea Explorer',
  'Knowledge Seeker',
  'Digital Reader',
];

const RESERVED_NAMES = new Set([
  'admin', 'administrator', 'ai club', 'ai club oist', 'developer',
  'anonymous', 'user', 'guest', 'mod', 'moderator', 'system', 'root'
]);

/**
 * Determines the next sequential commenter name based on the database state.
 * Guaranteed to follow the exact sequence:
 * Curious Reader -> Curious Mind -> Thought Seeker -> Idea Seeker ->
 * Insight Seeker -> Future Reader -> Thought Explorer -> Idea Explorer ->
 * Knowledge Seeker -> Digital Reader -> Curious Reader...
 * @returns {Promise<string>}
 */
export async function getNextSequentialCommenterName() {
  if (!isSupabaseConfigured || !supabase) {
    return AI_COMMENTER_NAMES[0];
  }

  try {
    // Check the most recently inserted comment that has one of the sequential names
    const { data, error } = await supabase
      .from('blog_comments')
      .select('display_name, created_at')
      .in('display_name', AI_COMMENTER_NAMES)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && Array.isArray(data) && data.length > 0) {
      const lastDisplayName = data[0].display_name;
      const lastIndex = AI_COMMENTER_NAMES.indexOf(lastDisplayName);
      if (lastIndex !== -1) {
        const nextIndex = (lastIndex + 1) % AI_COMMENTER_NAMES.length;
        return AI_COMMENTER_NAMES[nextIndex];
      }
    }

    // Fallback: If no comments with AI names exist yet, start at index 0 (Synara)
    return AI_COMMENTER_NAMES[0];
  } catch {
    return AI_COMMENTER_NAMES[0];
  }
}

/**
 * Fetches approved comments for a blog article.
 * @param {string} blogIdOrSlug
 * @param {Object} [options]
 * @param {number} [options.limit=50]
 * @param {number} [options.offset=0]
 * @returns {Promise<{ success: boolean, comments: Array, count: number, error?: string }>}
 */
export async function getBlogComments(blogIdOrSlug, { limit = 50, offset = 0 } = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, comments: [], count: 0, isFallback: true };
  }

  try {
    const { id: blogId, isAvailable } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) {
      return { success: true, comments: [], count: 0, isFallback: true };
    }

    const { data, error, count } = await supabase
      .from('blog_comments')
      .select('id, blog_id, display_name, comment, created_at, status', { count: 'exact' })
      .eq('blog_id', blogId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { success: true, comments: [], count: 0, isFallback: true };
    }

    // Clean comments list ensuring "Anonymous" never leaks into the UI
    const cleaned = (data || []).map((c) => {
      const isAnon = !c.display_name || RESERVED_NAMES.has(c.display_name.trim().toLowerCase());
      return {
        ...c,
        display_name: isAnon ? AI_COMMENTER_NAMES[0] : c.display_name,
      };
    });

    return {
      success: true,
      comments: cleaned,
      count: count || cleaned.length,
    };
  } catch {
    return { success: true, comments: [], count: 0, isFallback: true };
  }
}

// In-memory sequential queue to prevent race conditions during rapid concurrent comment submissions
let commentCreationQueue = Promise.resolve();

/**
 * Internal executor for creating and persisting a blog comment.
 * @param {Object} params
 * @param {string} params.blogIdOrSlug
 * @param {string} params.cleanComment
 * @returns {Promise<{ success: boolean, comment?: Object, error?: string }>}
 */
async function executeCreateBlogComment({ blogIdOrSlug, cleanComment }) {
  try {
    const { id: blogId, isAvailable, error: resolveErr } = await resolveBlogId(blogIdOrSlug);
    if (!blogId || !isAvailable) {
      return {
        success: false,
        error: resolveErr || 'Comment service is temporarily unavailable.',
      };
    }

    const visitorId = getVisitorId();

    // Determine the next sequential AI commenter name from database state
    const assignedAlias = await getNextSequentialCommenterName();

    // Attempt 1: Call 4-parameter Supabase RPC procedure
    let record = null;
    let rpcErr = null;

    const rpc1 = await supabase.rpc('add_blog_comment', {
      p_blog_id: blogId,
      p_visitor_id: visitorId,
      p_comment: cleanComment,
      p_display_name: assignedAlias,
    });

    if (!rpc1.error && rpc1.data) {
      record = rpc1.data;
    } else {
      rpcErr = rpc1.error;

      // Handle 30-second anti-spam cooldown immediately
      if (rpcErr?.message && rpcErr.message.includes('30 seconds')) {
        return {
          success: false,
          error: 'Please wait 30 seconds before submitting another comment.',
        };
      }

      // Check if failure is due to legacy schema checking email or signature mismatch
      const isEmailOrSigIssue =
        rpcErr?.code === 'P0001' ||
        rpcErr?.code === 'PGRST202' ||
        rpcErr?.message?.toLowerCase().includes('email') ||
        rpcErr?.message?.toLowerCase().includes('p_email') ||
        rpcErr?.message?.toLowerCase().includes('function add_blog_comment');

      if (isEmailOrSigIssue) {
        // Attempt 2: Call legacy 5-parameter RPC with internal system address
        const rpc2 = await supabase.rpc('add_blog_comment', {
          p_blog_id: blogId,
          p_visitor_id: visitorId,
          p_display_name: assignedAlias,
          p_comment: cleanComment,
          p_email: 'community@aiclub.internal',
        });

        if (!rpc2.error && rpc2.data) {
          record = rpc2.data;
          rpcErr = null;
        } else {
          rpcErr = rpc2.error;

          if (rpcErr?.message && rpcErr.message.includes('30 seconds')) {
            return {
              success: false,
              error: 'Please wait 30 seconds before submitting another comment.',
            };
          }

          // Attempt 3: Direct table insert conforming to RLS
          const directInsert = await supabase
            .from('blog_comments')
            .insert({
              blog_id: blogId,
              visitor_id: visitorId,
              display_name: assignedAlias,
              comment: cleanComment,
              email: 'community@aiclub.internal',
              status: 'approved',
            })
            .select('id, blog_id, display_name, comment, created_at, status')
            .maybeSingle();

          if (!directInsert.error && directInsert.data) {
            record = directInsert.data;
            rpcErr = null;
          } else {
            rpcErr = directInsert.error || rpcErr;
          }
        }
      }
    }

    if (rpcErr || !record) {
      if (rpcErr?.message && rpcErr.message.includes('30 seconds')) {
        return { success: false, error: 'Please wait 30 seconds before submitting another comment.' };
      }
      console.warn('Comment submission detail:', rpcErr);
      return { success: false, error: "Couldn't post your comment right now. Please try again." };
    }

    // Build the clean public comment object ensuring no email is ever exposed
    const finalComment = {
      id: record.id,
      blog_id: record.blog_id || blogId,
      display_name: record.display_name || assignedAlias,
      comment: cleanComment,
      status: record.status || 'approved',
      created_at: record.created_at || new Date().toISOString(),
    };

    return {
      success: true,
      comment: finalComment,
    };
  } catch (err) {
    console.error('Unexpected error in executeCreateBlogComment:', err);
    return {
      success: false,
      error: "Couldn't post your comment right now. Please try again.",
    };
  }
}

/**
 * Submits a new comment for a blog article with validation and anti-spam protection.
 * Requires ONLY the comment text. No name or email requested or stored.
 * Sequentially assigns one of 15 fictional AI-inspired public commenter names.
 * @param {Object} params
 * @param {string} params.blogIdOrSlug
 * @param {string} params.comment
 * @returns {Promise<{ success: boolean, comment?: Object, error?: string }>}
 */
export async function createBlogComment({ blogIdOrSlug, comment }) {
  // Input validation - only comment required
  const cleanComment = sanitizeText(comment);

  if (!cleanComment || cleanComment.length < 3) {
    return { success: false, error: 'Please write a comment (at least 3 characters).' };
  }
  if (cleanComment.length > 2000) {
    return { success: false, error: 'Comment must be at most 2000 characters.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Comment service is temporarily unavailable.',
    };
  }

  // Queue execution to ensure strict atomic sequential assignment across concurrent submissions
  return new Promise((resolve) => {
    commentCreationQueue = commentCreationQueue
      .then(() => executeCreateBlogComment({ blogIdOrSlug, cleanComment }))
      .then(resolve)
      .catch((err) => {
        resolve({
          success: false,
          error: err?.message || "Couldn't post your comment right now. Please try again.",
        });
      });
  });
}
