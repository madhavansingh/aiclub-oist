import "./eventsection.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import eventOBJ from "../../Data/sliderEvents.json";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const EventsSection = () => {
  gsap.registerPlugin(ScrollTrigger);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useGSAP(() => {
    var vw = window.innerHeight;
    var sliderWidth = document.querySelector(".slider").scrollWidth;

    if (window.innerWidth > 769) {
      var vw = window.innerHeight;
      var sliderWidth = document.querySelector(".slider").scrollWidth;
      var cardHeight = document.querySelector("span").clientHeight;
      gsap.to("body", {
        backgroundColor: "#131315",
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
          // markers: true,
          start: "top 20%",
          end: "top 10%",
          scrub: 1,
          onEnter: () => setIsDark(true),
          onLeaveBack: () => setIsDark(false),
        },
      });
      gsap.to("#menutxt", {
        color: "white",
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
          // markers: true,
          start: "top 20%",
          end: "top 10%",
          scrub: 1,
        },
      });
      gsap.to(".eventSection", {
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
          // markers: true,
          start: "top 10%",
          end: `top -${sliderWidth / 8}%`,
          scrub: 1,
          pin: true,
        },
      });
      gsap.to(".eventSection .slider", {
        rotateY: 130,
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
          // markers: true,
          start: "top 50%",
          end: `top -${sliderWidth / 8}%`,
          scrub: 1,
          // pin: true
        },
      });
    }
  });

  return (
    <div id="eventSection" data-scroll className="eventSection">
      <div style={{ color: isDark ? "white" : "black" }} data-scroll className="eventTitle">
        Events
      </div>
      <div id="slider" data-scroll className="slider">
        <span data-scroll style={{ "--i": 4 }} onClick={() => { navigate('/events') }} >
          <div data-scroll className="cardbox octa">
            <img
              data-scroll
              loading="lazy"
              decoding="async"
              id="bannerImage"
              src={eventOBJ[1].bannerPath}
              alt=""
            />
          </div>
          <div data-scroll className="eventKeyWords">
            <div data-scroll className="word">
              {eventOBJ[1].keyWords[0]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[1].keyWords[1]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[1].keyWords[2]}
            </div>
          </div>
          <div data-scroll className="eventDetails">
            <div data-scroll style={{ color: isDark ? "white" : "black" }} className="eventName">
              {eventOBJ[1].name}
            </div>
            <div data-scroll className="viewEvent">
              <button data-scroll>View All Events</button>
            </div>
          </div>
        </span>
        <span data-scroll style={{ "--i": 3 }} onClick={() => { navigate('/events') }} >
          <div data-scroll className="cardbox octa">
            <img
              data-scroll
              loading="lazy"
              decoding="async"
              id="bannerImage"
              src={eventOBJ[2].bannerPath}
              alt=""
            />
          </div>
          <div data-scroll className="eventKeyWords">
            <div data-scroll className="word">
              {eventOBJ[2].keyWords[0]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[2].keyWords[1]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[2].keyWords[2]}
            </div>
          </div>
          <div data-scroll className="eventDetails">
            <div data-scroll style={{ color: isDark ? "white" : "black" }} className="eventName">
              {eventOBJ[2].name}
            </div>
            <div data-scroll className="viewEvent">
              <button data-scroll>View All Events</button>
            </div>
          </div>
        </span>
        <span data-scroll style={{ "--i": 2 }} onClick={() => { navigate('/events') }} >
          <div data-scroll className="cardbox octa">
            <img
              data-scroll
              loading="lazy"
              decoding="async"
              id="bannerImage"
              src={eventOBJ[3].bannerPath}
              alt=""
            />
          </div>
          <div data-scroll className="eventKeyWords">
            <div data-scroll className="word">
              {eventOBJ[3].keyWords[0]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[3].keyWords[1]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[3].keyWords[2]}
            </div>
          </div>
          <div data-scroll className="eventDetails">
            <div data-scroll style={{ color: isDark ? "white" : "black" }} className="eventName">
              {eventOBJ[3].name}
            </div>
            <div data-scroll className="viewEvent">
              <button data-scroll>View All Events</button>
            </div>
          </div>
        </span>
        <span data-scroll style={{ "--i": 1 }} onClick={() => { navigate('/events') }} >
          <div data-scroll className="cardbox octa">
            <img
              data-scroll
              loading="lazy"
              decoding="async"
              id="bannerImage"
              src={eventOBJ[4].bannerPath}
              alt=""
            />
          </div>
          <div data-scroll className="eventKeyWords">
            <div data-scroll className="word">
              {eventOBJ[4].keyWords[0]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[4].keyWords[1]}
            </div>
            <div data-scroll className="word">
              {eventOBJ[4].keyWords[2]}
            </div>
          </div>
          <div data-scroll className="eventDetails">
            <div data-scroll style={{ color: isDark ? "white" : "black" }} className="eventName">
              {eventOBJ[4].name}
            </div>
            <div data-scroll className="viewEvent">
              <button data-scroll>View All Events</button>
            </div>
          </div>
        </span>
      </div>
    </div>
  );
};

export default EventsSection;
