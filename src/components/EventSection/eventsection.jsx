import "./eventsection.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import eventOBJ from "../../Data/sliderEvents.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventsSection = () => {
  gsap.registerPlugin(ScrollTrigger);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useGSAP(() => {
    if (window.innerWidth > 769) {
      const slider = document.querySelector(".slider");
      const sliderWidth = slider ? slider.scrollWidth : 800;

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
      gsap.to("#menutxt", {
        color: "white",
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
          start: "top 20%",
          end: "top 10%",
          scrub: 1,
        },
      });
      gsap.to(".eventSection", {
        scrollTrigger: {
          trigger: ".eventSection",
          scroller: "body",
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
          start: "top 50%",
          end: `top -${sliderWidth / 8}%`,
          scrub: 1,
        },
      });
    }
  });

  const cards = [
    { index: 4, item: eventOBJ[1] },
    { index: 3, item: eventOBJ[2] },
    { index: 2, item: eventOBJ[3] },
    { index: 1, item: eventOBJ[4] },
  ];

  const handleCardClick = (slug) => {
    if (slug) {
      navigate(`/events/${slug}`);
    }
  };

  return (
    <div id="eventSection" data-scroll className="eventSection">
      <div style={{ color: isDark ? "white" : "black" }} data-scroll className="eventTitle">
        Events
      </div>
      <div id="slider" data-scroll className="slider">
        {cards.map(({ index, item }) => (
          <span
            key={item.slug || index}
            data-scroll
            role="button"
            tabIndex={0}
            aria-label={`View ${item.name} gallery`}
            style={{ "--i": index }}
            onClick={() => handleCardClick(item.slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(item.slug);
              }
            }}
          >
            <div data-scroll className="cardbox octa">
              <img
                data-scroll
                loading="lazy"
                decoding="async"
                id="bannerImage"
                src={item.bannerPath}
                alt={item.name}
              />
            </div>
            <div data-scroll className="eventKeyWords">
              {item.keyWords.map((word, i) => (
                <div key={i} data-scroll className="word">
                  {word}
                </div>
              ))}
            </div>
            <div data-scroll className="eventDetails">
              <div
                data-scroll
                style={{ color: isDark ? "white" : "black" }}
                className="eventName"
              >
                {item.name}
              </div>
            </div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
