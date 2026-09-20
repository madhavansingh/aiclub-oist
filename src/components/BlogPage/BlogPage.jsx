import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import "./BlogPage.css";
import BackButton from "../backButton/backButton";
import { getBlogs } from "../../services/blogService.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const BlogPage = () => {
  const navigate = useNavigate();
  const lenis = useLenis();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  useEffect(() => {
    let isMounted = true;
    async function loadPosts() {
      try {
        const res = await getBlogs();
        if (isMounted && res.success && Array.isArray(res.blogs)) {
          const sorted = [...res.blogs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setPosts(sorted);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <BackButton textDisplay={true} filter="invert(1)" />
      <div className="blog-wrap">
        <div className="blog-hero">
          <h1 className="blog-title">Blog</h1>
          <h3 className="blog-subtitle">Weekly notes from AI Club OIST</h3>
          <p className="blog-desc">
            Recaps, builds, and ideas from the community. New post every week —
            drop a new entry in the blogs file and it shows up here.
          </p>
        </div>

        <div className="blog-list">
          {loading ? (
            <div className="blog-card" style={{ padding: "24px" }}>
              <div className="blog-skeleton-bar" style={{ width: "100%", height: "200px", marginBottom: "16px" }} />
              <div className="blog-skeleton-bar" style={{ width: "40%", height: "16px", marginBottom: "12px" }} />
              <div className="blog-skeleton-bar" style={{ width: "80%", height: "24px" }} />
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="blog-card"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
              {post.cover && (
                <div className="blog-card-cover">
                  <img src={post.cover} alt="" />
                </div>
              )}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{formatDate(post.date)}</span>
                  <span className="blog-dot">·</span>
                  <span>{post.author}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="blog-tags">
                    {post.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <span className="blog-read">Read post</span>
              </div>
            </article>
          )))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
