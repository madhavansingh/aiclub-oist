import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import "./BlogPage.css";
import BackButton from "../backButton/backButton";
import {
  getBlogBySlug,
  getBlogEngagement,
  getBlogEngagementWithView,
  toggleBlogLike,
  getBlogComments,
  createBlogComment,
} from "../../services/blogService.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatCommentDate = (value) => {
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

/* Restrained Editorial SVG Icons */
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    className="blog-like-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lenis = useLenis();

  // Article state
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);

  // Engagement state
  const [engagement, setEngagement] = useState({
    views: 0,
    likes: 0,
    comment_count: 0,
    user_has_liked: false,
  });
  const [engagementLoading, setEngagementLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [likeNotice, setLikeNotice] = useState(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  // Comment form state (Only Comment required)
  const [formComment, setFormComment] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  // In-flight engagement request tracking per slug to handle React 18 StrictMode cleanly
  const engagementTaskRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [slug, lenis]);

  // Load article content
  useEffect(() => {
    let isMounted = true;
    setPostLoading(true);

    async function loadArticle() {
      try {
        const res = await getBlogBySlug(slug);
        if (isMounted) {
          if (res.success && res.blog) {
            setPost(res.blog);
          } else {
            setPost(null);
          }
        }
      } catch (err) {
        console.error("Error loading blog article:", err);
        if (isMounted) setPost(null);
      } finally {
        if (isMounted) setPostLoading(false);
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Load engagement metrics and record an article visit view
  useEffect(() => {
    let isMounted = true;
    setEngagementLoading(true);

    // Reuse in-flight promise for the same slug to handle React 18 StrictMode cleanly
    // without triggering duplicate database RPCs or dropped state updates
    if (!engagementTaskRef.current || engagementTaskRef.current.slug !== slug) {
      const visitToken = `visit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      engagementTaskRef.current = {
        slug,
        visitToken,
        promise: getBlogEngagementWithView(slug, { recordView: true, visitToken }),
      };
    }

    engagementTaskRef.current.promise
      .then((res) => {
        if (isMounted && res && res.success) {
          setEngagement({
            views: res.views,
            likes: res.likes,
            comment_count: res.comment_count,
            user_has_liked: res.user_has_liked,
          });
        }
      })
      .catch((err) => {
        console.error("Error retrieving article engagement:", err);
      })
      .finally(() => {
        if (isMounted) {
          setEngagementLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Load approved comments
  useEffect(() => {
    let isMounted = true;
    setCommentsLoading(true);
    setCommentsError(null);

    async function loadComments() {
      try {
        const res = await getBlogComments(slug);
        if (isMounted) {
          if (res.success && Array.isArray(res.comments)) {
            setComments(res.comments);
          }
        }
      } catch (err) {
        console.error("Error retrieving comments:", err);
        if (isMounted) {
          setCommentsError("Comments couldn't be loaded right now.");
        }
      } finally {
        if (isMounted) setCommentsLoading(false);
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Like button handler with atomic feedback and safe error handling
  const handleToggleLike = async () => {
    if (isLiking || !slug) return;
    setIsLiking(true);
    setLikeNotice(null);

    try {
      const res = await toggleBlogLike(slug);
      if (res.success) {
        setEngagement((prev) => ({
          ...prev,
          likes: res.likes,
          user_has_liked: res.liked,
        }));
      } else {
        setLikeNotice(res.error || "Unable to update like right now.");
        setTimeout(() => setLikeNotice(null), 4000);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setLikeNotice("Couldn't update like right now. Please try again.");
      setTimeout(() => setLikeNotice(null), 4000);
    } finally {
      setIsLiking(false);
    }
  };

  // Comment submission handler requiring ONLY the comment text
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanComment = formComment.trim();

    if (!cleanComment) {
      setFormError("Comment cannot be empty.");
      return;
    }
    if (cleanComment.length < 3) {
      setFormError("Comment must be at least 3 characters.");
      return;
    }

    setFormSubmitting(true);

    try {
      const res = await createBlogComment({
        blogIdOrSlug: slug,
        comment: cleanComment,
      });

      if (res.success) {
        setFormComment("");

        if (res.comment && res.comment.status === "approved") {
          setComments((prev) => [res.comment, ...prev]);

          // Sync database source of truth for engagement metrics
          try {
            const freshMetrics = await getBlogEngagement(slug);
            if (freshMetrics && freshMetrics.success) {
              setEngagement((prev) => ({
                ...prev,
                comment_count: freshMetrics.comment_count,
              }));
            } else {
              setEngagement((prev) => ({
                ...prev,
                comment_count: (prev.comment_count || 0) + 1,
              }));
            }
          } catch {
            setEngagement((prev) => ({
              ...prev,
              comment_count: (prev.comment_count || 0) + 1,
            }));
          }

          setFormSuccess("Thank you! Your comment has been posted.");
        } else {
          setFormSuccess("Thank you! Your comment has been received.");
        }

        setTimeout(() => {
          setFormSuccess(null);
        }, 5000);
      } else {
        setFormError(res.error || "Couldn't post your comment right now. Please try again.");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setFormError("Couldn't post your comment right now. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Article loading skeleton
  if (postLoading) {
    return (
      <>
        <BackButton textDisplay={true} filter="invert(1)" />
        <div className="blog-wrap">
          <article className="blog-post" style={{ minHeight: "400px" }}>
            <div className="blog-skeleton-bar" style={{ width: "100%", height: "260px", marginBottom: "24px" }} />
            <div className="blog-skeleton-bar" style={{ width: "35%", height: "18px", marginBottom: "16px" }} />
            <div className="blog-skeleton-bar" style={{ width: "80%", height: "32px", marginBottom: "24px" }} />
            <div className="blog-skeleton-bar" style={{ width: "100%", height: "120px", marginBottom: "16px" }} />
          </article>
        </div>
      </>
    );
  }

  // Not found state (rendered ONLY if the article lookup genuinely fails)
  if (!post) {
    return (
      <>
        <BackButton textDisplay={true} filter="invert(1)" />
        <div className="blog-wrap">
          <div className="blog-hero">
            <h1 className="blog-title">Missing</h1>
            <p className="blog-desc">That post is not in the list yet.</p>
            <button
              type="button"
              className="blog-back-link"
              onClick={() => navigate("/blog")}
            >
              All posts
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackButton textDisplay={true} filter="invert(1)" />
      <div className="blog-wrap">
        <article className="blog-post">
          {post.cover && (
            <div className="blog-post-cover">
              <img src={post.cover} alt={post.title} />
            </div>
          )}

          <div className="blog-card-meta">
            <span>{formatDate(post.date)}</span>
            <span className="blog-dot">·</span>
            <span>{post.author}</span>
          </div>

          <h1 className="blog-post-title">{post.title}</h1>

          {post.tags?.length > 0 && (
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          <div className="blog-post-body">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* ====================================================
              REFINED EDITORIAL ENGAGEMENT ROW
              ==================================================== */}
          <div className="blog-engagement-row">
            <div className="blog-engagement-views" title="Article Views">
              <EyeIcon />
              <span>
                {engagementLoading
                  ? "..."
                  : `${engagement.views.toLocaleString()} ${
                      engagement.views === 1 ? "view" : "views"
                    }`}
              </span>
            </div>

            <button
              type="button"
              className={`blog-like-toggle ${
                engagement.user_has_liked ? "liked" : ""
              }`}
              onClick={handleToggleLike}
              disabled={isLiking}
              aria-label={
                engagement.user_has_liked
                  ? "Unlike this article"
                  : "Like this article"
              }
            >
              <HeartIcon filled={engagement.user_has_liked} />
              <span className="blog-like-count">
                {engagementLoading ? "..." : engagement.likes.toLocaleString()}
              </span>
              <span className="blog-like-text">
                {engagement.likes === 1 ? "like" : "likes"}
              </span>
            </button>
          </div>

          {likeNotice && (
            <div className="blog-engagement-notice" role="alert">
              {likeNotice}
            </div>
          )}

          {/* ====================================================
              EDITORIAL COMMENTS SECTION
              ==================================================== */}
          <section className="blog-comments-area" aria-label="Comments">
            <div className="blog-comments-title-row">
              <h2 className="blog-comments-heading">COMMENTS</h2>
              <span className="blog-comments-counter">{comments.length}</span>
            </div>

            {/* Comments Thread */}
            <div className="blog-comments-stream">
              {commentsLoading ? (
                <div className="blog-comments-skeleton-feed">
                  <div className="blog-skeleton-bar" style={{ width: "35%", height: "14px", marginBottom: "8px" }} />
                  <div className="blog-skeleton-bar" style={{ width: "80%", height: "12px", marginBottom: "20px" }} />
                </div>
              ) : commentsError ? (
                <div className="blog-comments-notice">
                  {commentsError}
                </div>
              ) : comments.length === 0 ? (
                <div className="blog-comments-zero">
                  No comments yet. Start the conversation.
                </div>
              ) : (
                comments.map((item) => (
                  <article key={item.id} className="blog-comment-entry">
                    <div className="blog-comment-byline">
                      <span className="blog-comment-name">
                        <span className="blog-alias-accent" aria-hidden="true">•</span>
                        {item.display_name}
                      </span>
                      <span className="blog-comment-timestamp">
                        {formatCommentDate(item.created_at)}
                      </span>
                    </div>
                    {/* Rendered as pure text with line breaks preserved; zero HTML execution */}
                    <p className="blog-comment-body">{item.comment}</p>
                  </article>
                ))
              )}
            </div>

            {/* Editorial Comment Form */}
            <div className="blog-comment-form-container">
              <h3 className="blog-comment-form-title">Join the conversation</h3>

              <form
                className="blog-comment-form-clean"
                onSubmit={handleCommentSubmit}
                noValidate
              >
                <div className="blog-field-wrap">
                  <label htmlFor="blog-comment-field" className="blog-field-label">
                    Comment *
                  </label>
                  <textarea
                    id="blog-comment-field"
                    className="blog-clean-textarea"
                    placeholder="Write your comment..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    required
                    disabled={formSubmitting}
                  />
                </div>

                {formError && (
                  <div className="blog-form-msg error" role="alert">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="blog-form-msg success" role="status">
                    {formSuccess}
                  </div>
                )}

                <div className="blog-form-actions">
                  <button
                    type="submit"
                    className="blog-submit-button"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <button
            type="button"
            className="blog-back-link"
            onClick={() => navigate("/blog")}
          >
            All posts
          </button>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
