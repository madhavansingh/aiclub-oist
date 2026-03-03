import React, { useEffect } from "react";
import "./loader.css";
import { gsap } from "gsap";

const Loader = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: onLoadingComplete,
    });

    timeline
      .to("#loader h1:nth-child(1)", { opacity: 1, duration: 0.6, delay: 0.6 })
      .to("#loader h1:nth-child(1)", { opacity: 0, duration: 0.6 })
      .to("#loader h1:nth-child(2)", { opacity: 1, duration: 0.6 })
      .to("#loader h1:nth-child(2)", { opacity: 0, duration: 0.6 })
      .to("#loader h1:nth-child(3)", { opacity: 1, duration: 0.6 })
      .to("#loader h1:nth-child(3)", { opacity: 0, duration: 0.6 })
      .to("#loader", { top: "-100%", duration: 0.7, ease: "power2.out" });
  }, [onLoadingComplete]);

  return (
    <div id="loader">
      <h1>INNOVATION</h1>
      <h1>INTELLIGENCE</h1>
      <h1>IMPACT</h1>
    </div>
  );
};

export default Loader;
