// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./herosection.css";
const Heropage = () => {
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
        // markers:true
      },
    });
  });
  useEffect(() => {
    document.getElementById('heroWrap').addEventListener('mouseenter', () => {
      document.getElementById('webCursor').style.width = 'auto'
      document.getElementById('webCursor').style.height = 'auto'
      document.getElementById('webCursor').style.padding = '8px'
      document.getElementById('webCursor').innerText = 'Upcoming Events'
    })
    document.getElementById('heroWrap').addEventListener('mouseleave', () => {
      document.getElementById('webCursor').style.width = '20px'
      document.getElementById('webCursor').style.height = '20px'
      document.getElementById('webCursor').innerText = ''
    })
  }, [])

  return (
    <div id="heroWrap" className="heroWrap">
      <div className="event-container">
        <div className="left-event-container">
          {/* <div className="eventTitle heroTitle">/Upcoming Event</div> */}
          <p className="context">
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">TEDx</span>
            </span>
            is coming to
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">  OIST</span>
            </span>
            bringing visionary
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent">  speakers</span>
            </span>
            powerful ideas and inspiring stories that spark
            <span className="highlight">
              <span className="highlight-bg"></span>
              <span className="highContent"> innovation</span>
            </span>
            and meaningful change.
          </p>

          <button className="register-button" >Coming Soon</button>
        </div>

        <div className="right-event-container">
          <h1 className="heading">TEDx OIST</h1>
          <img
            className="event-image-right"
            src="/HeroSection/aiconic2.webp"
            alt="Technology"
          />
          <div className="description">
            TEDx OIST unites bold ideas and future leaders.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heropage;
