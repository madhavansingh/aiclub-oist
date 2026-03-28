import React, { useRef } from 'react'
import './LandingPage.css'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function LandingPage() {
  gsap.registerPlugin(ScrollTrigger);
  const landingRef = useRef(null);

  useGSAP(() => {
    gsap.from(".mainBox1, .mainBox2, .landingFooter", {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
      delay: 0.4
    });

    gsap.to(landingRef.current, {
      scale: 0.9,
      opacity: 0,
      willChange: "transform, opacity",
      scrollTrigger: {
        trigger: landingRef.current,
        scroller: "body",
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  return (
    <div ref={landingRef} className='landingPageWrap'>
      <div className="landingMain">
        <div className="mainBox1">
          <div className="box1row1">
            AI CLUB OIST

          </div>
          <div className="box1row2">
            <div className="box1row2main">
              <div className="vertxt">sudo rm -rf /models</div>
              Innovate
              <br />
              Elevate
              <br />
              Impact
              <br />
              Collaborate
              <br />
              Lead
            </div>
            <div className="box1row2side">
              <img src="/PublicAssets/landRing.svg" alt="" />
            </div>
          </div>
          <div className="box1row3">
            <div className="box1row3main">
              Let’s talk about <span> &nbsp; AI</span>
            </div>
            <div className="box1row3side"></div>
          </div>
        </div>
        <div className="mainBox2">
          <div className="box2row1">
            The AI Club at OIST is a hub for innovators and creators. From TEDx to Cypher 3.0, we lead transformative events that inspire, innovate, and redefine the future of Artificial Intelligence.
          </div>
          <div className="box2row2">
            <div className="box2row2col1">
              <img src="/PublicAssets/robot.webp" alt="" srcset="" />
            </div>
            <div className="box2row2col2"></div>
          </div>
        </div>
      </div>
      <div className="landingInfiniteScroll">
        <div class="landingFooter">
          TEDx / Projects / Workshops / Webinars / Sessions / Events / Competitions / Exhibitions
        </div>
      </div>
    </div>
  )
}

export default LandingPage
