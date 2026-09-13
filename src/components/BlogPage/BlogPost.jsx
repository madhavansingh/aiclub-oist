import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BlogPage.css";
import BackButton from "../backButton/backButton";
import Cursor from "../Cursor/cursor.jsx";
import blogs from "../../Data/blogs.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogs.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!post) {
    return (
      <>
        <Cursor />
        <BackButton textDisplay={true} filter="invert(1)" />
        <div className="blog-wrap">
          <div className="blog-hero">
            <h1 className="blog-title">Missing</h1>
            <p className="blog-desc">That post is not in the list yet.</p>
            <button className="blog-back-link" onClick={() => navigate("/blog")}>
              All posts
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Cursor />
      <BackButton textDisplay={true} filter="invert(1)" />
      <div className="blog-wrap">
        <article className="blog-post">
          {post.cover && (
            <div className="blog-post-cover">
              <img src={post.cover} alt="" />
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
          <button className="blog-back-link" onClick={() => navigate("/blog")}>
            All posts
          </button>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
