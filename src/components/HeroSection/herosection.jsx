import React from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import blogs from "../../Data/blogs.js";
import "./herosection.css";

const Heropage = () => {
  const navigate = useNavigate();
  const featuredBlog = blogs && blogs.length > 0 ? blogs[0] : null;

  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    gsap.to(".highlight-bg", {
      width: "100%",
      duration: 0.5,
      scrollTrigger: {
        trigger: ".heroWrap",
        scroller: "body",
        start: "top 70%",
        end: "bottom",
      },
    });
  });

  return (
    <div id="heroWrap" className="heroWrap">
      <div className="event-container">
        <div className="left-event-container">
          <p className="context">
            Explore our latest{" "}
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">blogs,</span>
            </span>{" "}
            stories and{" "}
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">insights</span>
            </span>{" "}
            on AI, technology,{" "}
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">innovation</span>
            </span>{" "}
            and the{" "}
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">future.</span>
            </span>
          </p>

          <button
            className="register-button"
            onClick={() => {
              const target = featuredBlog ? `/blog/${featuredBlog.slug}` : "/blog";
              navigate(target);
            }}
            aria-label="Read AI Club Blog"
          >
            Read Blog
          </button>
        </div>

        <div
          className="right-event-container"
          onClick={() =>
            navigate(featuredBlog ? `/blog/${featuredBlog.slug}` : "/blog")
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate(featuredBlog ? `/blog/${featuredBlog.slug}` : "/blog");
            }
          }}
        >
          <h1 className="heading">AI BLOG</h1>
          <img
            className="event-image-right"
            src={featuredBlog?.cover || "/blog/ai-blog-cover.png"}
            alt={featuredBlog?.title || "AI Club OIST Blog"}
          />
          <div className="description">
            {featuredBlog?.title || "Weekly notes and deep dives from AI Club OIST."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heropage;

