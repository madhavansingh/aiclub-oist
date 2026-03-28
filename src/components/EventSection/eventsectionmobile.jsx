import "./eventsection.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import eventOBJ from "../../Data/sliderEvents.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const EventsSectionMobile = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.to("body", {
      backgroundColor: "#131315",
      scrollTrigger: {
        trigger: ".eventSection",
        scroller: "body",
        start: "top 20%",
        end: "top 10%",
        scrub: 1,
        onEnter: () => setIsDark(true),
        onLeaveBack: () => setIsDark(false),
      },
    });

    const spans = gsap.utils.toArray('.slider span');
    spans.forEach((span) => {
      gsap.fromTo(span,
        { scale: 0.85, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          willChange: "transform, opacity",
          scrollTrigger: {
            trigger: span,
            scroller: "body",
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          }
        }
      );
    });
  });

  return (
    <div id="eventSection" data-scroll className="eventSection">
      <div style={{ color: isDark ? "white" : "black" }} data-scroll className="eventTitle">
        Events
      </div>
      <div data-scroll className="slider">
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

export default EventsSectionMobile;
