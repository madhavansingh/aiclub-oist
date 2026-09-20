import "./scroller.css";
import arrow from "../../assets/arrow.webp";
import ring from "../../assets/ring.webp";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Scroller = () => {
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    gsap.to(".scrollerbox2", {
      y: 0,
      ease: "none",
      willChange: "transform",
      scrollTrigger: {
        trigger: "body",
        scroller: "body",
        start: "top top",
        end: "bottom bottom",
        markers: false,
        scrub: 0.8,
      },
    });
    gsap.to(".ring", {
      rotate: 2080,
      ease: "none",
      willChange: "transform",
      scrollTrigger: {
        trigger: "body",
        scroller: "body",
        start: "top top",
        end: "bottom bottom",
        markers: false,
        scrub: 0.8,
      },
    });
  });

  return (
    <div className="scroller">
      <div className="ring">
        <img className="blend" src={ring} alt="" />
      </div>
      <div className="scrollerbox">
        <div className="scrollerbox1"></div>
        <div className="scrollerbox2"></div>
      </div>
      <div className="blend arrow">
        <img className="arrowsvg" src={arrow} alt="↓" />
      </div>
    </div>
  );
};

export default Scroller;
