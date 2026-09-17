import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./team.css";
import leadsData from "../../Data/leads.json";

gsap.registerPlugin(ScrollTrigger);

const BrandingSection = () => {
  const containerRef = useRef(null);
  const data = leadsData;

  useGSAP(
    () => {
      gsap.utils.toArray("#brand_col .left li").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 1, y: 50, rotation: 0, x: 0 },
          {
            autoAlpha: 1,
            y: -20,
            x: -30,
            rotation: -10,
            scrollTrigger: {
              trigger: section,
              start: "top 50%",
              end: "bottom 0%",
              scrub: 1,
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      gsap.utils.toArray("#brand_col .center li").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 1, y: 50 },
          {
            autoAlpha: 1,
            y: -50,
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 0%",
              scrub: 1,
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      gsap.utils.toArray("#brand_col .right li").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 1, y: 50, rotation: 0 },
          {
            autoAlpha: 1,
            y: -10,
            x: 10,
            rotation: 10,
            scrollTrigger: {
              trigger: section,
              start: "top 50%",
              end: "bottom 0%",
              scrub: 1,
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleItemEnter = (name) => {
    const cursor = document.getElementById("webCursor");
    if (!cursor) return;
    cursor.style.width = "auto";
    cursor.style.height = "auto";
    cursor.style.padding = "8px 12px";
    cursor.innerText = `View ${name}'s Profile`;
  };

  const handleItemLeave = () => {
    const cursor = document.getElementById("webCursor");
    if (!cursor) return;
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursor.style.padding = "";
    cursor.innerText = "";
  };

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <a
        href={item.profileLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        key={index}
      >
        <li
          id={`view${item.team}`}
          onMouseEnter={() => handleItemEnter(item.name.split(" ")[0])}
          onMouseLeave={handleItemLeave}
        >
          <div>
            <h3>{item.name}</h3>
          </div>
          <picture>
            <img loading="lazy" decoding="async" alt="" src={item.img} />
          </picture>
          <div>
            <span>{item.teamPos}</span>
          </div>
        </li>
      </a>
    ));
  };

  return (
    <div id="branding" ref={containerRef}>
      <div className="meetteam">MEET OUR TEAM</div>
      <div className="faculty">
        <div className="faculty2">
          <img src="/membersIMG/hod.webp" alt="Teacher" />
          <div className="designation">
            Sreeja Nair
            <br />
            HOD, AIML Department
          </div>
        </div>
      </div>

      <div id="brand_col">
        <ul className="left">{renderListItems(data.slice(0, 7))}</ul>
        <ul className="center">{renderListItems(data.slice(7, 14))}</ul>
        <ul className="right">{renderListItems(data.slice(14, 21))}</ul>
      </div>
    </div>
  );
};

export default BrandingSection;
