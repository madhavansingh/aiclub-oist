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

    const spans = gsap.utils.toArray(".slider span");
    spans.forEach((span) => {
      gsap.fromTo(
        span,
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
          },
        }
      );
    });
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
      <div data-scroll className="slider">
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

export default EventsSectionMobile;
