import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BlogPage.css";
import BackButton from "../backButton/backButton";
import Cursor from "../Cursor/cursor.jsx";
import blogs from "../../data/blogs";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const BlogPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const posts = [...blogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <>
      <Cursor />
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
          {posts.map((post) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
