import './cursor.css'
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.x,
        y: e.y,
        duration: 0.5,
        ease: "back.out(2)",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div id='webCursor'
      ref={cursorRef}
      className="cursor"
    />
  );
};

export default CustomCursor;