import './cursor.css';
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

// Persistent global pointer state across any mounts/rerenders
const globalPointer = {
  x: null,
  y: null,
  hasPosition: false,
};

// Global listener to continuously capture pointer coordinates
if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      globalPointer.x = e.clientX;
      globalPointer.y = e.clientY;
      globalPointer.hasPosition = true;
    },
    { passive: true }
  );
}

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const location = useLocation();

  // Reset any element-specific hover text and dimensions on route changes
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursor.style.padding = "";
    cursor.innerText = "";
  }, [location?.pathname]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let isVisible = false;

    // If we already know the pointer coordinates, set position immediately with zero animation
    if (globalPointer.hasPosition && globalPointer.x !== null && globalPointer.y !== null) {
      gsap.set(cursor, {
        x: globalPointer.x,
        y: globalPointer.y,
        opacity: 1,
        visibility: "visible",
      });
      isVisible = true;
    }

    let rafId = null;

    const handleMouseMove = (e) => {
      globalPointer.x = e.clientX;
      globalPointer.y = e.clientY;
      globalPointer.hasPosition = true;

      if (!isVisible) {
        // First movement: teleport directly to mouse coordinates without flying from (0, 0)
        gsap.set(cursor, {
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          visibility: "visible",
        });
        isVisible = true;
        return;
      }

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (!cursorRef.current) return;
          gsap.to(cursorRef.current, {
            x: globalPointer.x,
            y: globalPointer.y,
            duration: 0.5,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      id="webCursor"
      ref={cursorRef}
      className="cursor"
    />
  );
};

export default CustomCursor;