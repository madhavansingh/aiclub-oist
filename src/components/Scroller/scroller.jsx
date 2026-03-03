import "./scroller.css";
import arrow from "../../assets/arrow.webp";
import ring from "../../assets/ring.webp";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const scroller = () => {
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    const winH = document.body.offsetHeight;
    gsap.to(".scrollerbox2", {
      y: 0,
      scrollTrigger: {
        trigger: ".scrollerbox2",
        scroller: "body",
        start: "top 85%",
        end: `top -${winH*2.5}px`,
        markers: false,
        scrub: 2,
      },
    });
    gsap.to(".ring", {
      rotate: 2080,
      scrollTrigger: {
        trigger: ".scrollerbox2",
        scroller: "body",
        start: "top 85%",
        end: `top -${winH*3}px`, // or -(winH*.4) if needed
        markers: false,
        scrub: 2,
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

export default scroller;
