import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./gallerySection.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GallerySection = () => {
  const navigate = useNavigate();
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    gsap.to("#galleryBox1", {
      x: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".galleryWrap",
        start: "top 70%",
        end: "top 5%",
        scrub: 1,
      },
    });
    gsap.to("#galleryBox2", {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".galleryWrap",
        start: "top 70%",
        end: "top 5%",
        scrub: 1,
      },
    });
    gsap.to("#galleryBox3", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: ".galleryWrap",
        start: "top 70%",
        end: "top 5%",
        scrub: 1,
      },
    });
    gsap.to("#galleryBox4", {
      x: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".galleryWrap",
        start: "top 70%",
        end: "top 5%",
        scrub: 1,
      },
    });
    gsap.to("#galleryBox5", {
      x: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".galleryWrap",
        start: "top 70%",
        end: "top 5%",
        scrub: 1,
      },
    });
  });

  const handleBoxClick = () => {
    navigate("/events-gallery");
  };

  useEffect(() => {
    const elements = [
      "galleryBox1",
      "galleryBox2",
      "galleryBox3",
      "galleryBox4",
      "galleryBox5",
      "galleryCenterBox",
    ];

    elements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.addEventListener("mouseenter", () => {
          const cursor = document.getElementById("webCursor");
          if (cursor) {
            cursor.style.width = "auto";
            cursor.style.height = "auto";
            cursor.style.padding = "8px";
            cursor.innerText = "Open Gallery";
          }
        });

        element.addEventListener("mouseleave", () => {
          const cursor = document.getElementById("webCursor");
          if (cursor) {
            cursor.style.width = "20px";
            cursor.style.height = "20px";
            cursor.innerText = "";
          }
        });
      }
    });
  }, []);

  return (
    <div id="galleryWrap" className="galleryWrap pin-spacer">
      <div className="eventTitle galleryTitle">Gallery</div>
      <div className="galleryRow1">
        <div className="ghostboximg1"></div>
        <div
          id="galleryBox1"
          onClick={handleBoxClick}
          className="boximg1"
          style={{
            backgroundImage:`url('/gallerysection/IMG_6499.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="ghostboximg2"></div>
      </div>
      <div className="galleryRow2">
        <div
          id="galleryBox2"
          onClick={handleBoxClick}
          className="boximg1"
          style={{
            backgroundImage:`url('/gallerysection/IMG_6502.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          id="galleryCenterBox"
          className="boximg2"
          onClick={handleBoxClick}
          style={{
            backgroundImage:`url('/gallerysection/IMG_6503.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          id="galleryBox3"
          onClick={handleBoxClick}
          className="boximg3"
          style={{
            backgroundImage:`url('/gallerysection/IMG_6500.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <div className="galleryRow3">
        <div
          id="galleryBox4"
          onClick={handleBoxClick}
          className="boximg1"
          style={{
            backgroundImage:`url('/gallerysection/IMG_6504.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          id="galleryBox5"
          onClick={handleBoxClick}
          className="boximg2"
          style={{
            backgroundImage:`url('/gallerysection/IMG_6501.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default GallerySection;
