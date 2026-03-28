import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./team.css";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const useGSAP = (animationCallback) => {
  useEffect(() => {
    animationCallback();
  }, [animationCallback]);
};

const BrandingSection = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Data/leads.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // useEffect(() => {
  //   if (data.length > 0) {
  //     animateSections();
  //   }
  // }, [data]);

  // const animateSections = () => {
  //   gsap.utils.toArray("#brand_col .left li").forEach((section) => {
  //     gsap.fromTo(
  //       section,
  //       { autoAlpha: 1, y: 50, rotation: 0, x: 0 },
  //       {
  //         autoAlpha: 1,
  //         y: -20,
  //         x: -30,
  //         rotation: -10,
  //         scrollTrigger: {
  //           trigger: section,
  //           start: "top 50%",
  //           end: "bottom 0%",
  //           scrub: 1,
  //           toggleActions: "play reverse play reverse",
  //         },
  //       }
  //     );
  //   });

  //   gsap.utils.toArray("#brand_col .center li").forEach((section) => {
  //     gsap.fromTo(
  //       section,
  //       { autoAlpha: 1, y: 50 },
  //       {
  //         autoAlpha: 1,
  //         y: -50,
  //         scrollTrigger: {
  //           // markers:true,
  //           trigger: section,
  //           start: "top 60%",
  //           end: "bottom 0%",
  //           scrub: 1,
  //           toggleActions: "play reverse play reverse",
  //         },
  //       }
  //     );
  //   });

  //   gsap.utils.toArray("#brand_col .right li").forEach((section) => {
  //     gsap.fromTo(
  //       section,
  //       { autoAlpha: 1, y: 50, rotation: 0 },
  //       {
  //         autoAlpha: 1,
  //         y: -10,
  //         x: 10,
  //         rotation: 10,
  //         scrollTrigger: {
  //           trigger: section,
  //           start: "top 50%",
  //           end: "bottom 0%",
  //           scrub: 1,
  //           toggleActions: "play reverse play reverse",
  //         },
  //       }
  //     );
  //   });

  //   const faculty1 = document.querySelector(".faculty1");
  //   if (faculty1) {
  //     gsap.fromTo(
  //       faculty1,
  //       { autoAlpha: 1, y: -50 },
  //       {
  //         autoAlpha: 1,
  //         opacity: 1,
  //         y: 20,
  //         scrollTrigger: {
  //           trigger: faculty1,
  //           start: "top 70%",
  //           end: "bottom 0%",
  //           scrub: 2,
  //           toggleActions: "play reverse play reverse",
  //         },
  //       }
  //     );
  //   }

  //   const faculty2 = document.querySelector(".faculty2");
  //   if (faculty2) {
  //     gsap.fromTo(
  //       faculty2,
  //       { autoAlpha: 1, y: -50 },
  //       {
  //         autoAlpha: 1,
  //         opacity: 1,
  //         y: 20,
  //         scrollTrigger: {
  //           trigger: faculty2,
  //           start: "top 70%",
  //           end: "bottom 0%",
  //           scrub: 2,
  //           toggleActions: "play reverse play reverse",
  //         },
  //       }
  //     );
  //   }
  // };

  // useGSAP(() => {
  //   animateSections();
  // });

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <a
        href={item.profileLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        key={index}
      >
        <li id={`view${item.team}`}>
          <div>
            <h3>{item.name}</h3>
          </div>
          <picture>
            <img loading="lazy" decoding="async" alt='' src={item.img} />
          </picture>
          <div>
            <span>{item.teamPos}</span>
          </div>
        </li>
      </a>
    ));
  };

  return (
    <div id="branding">
      <div className="meetteam">MEET OUR TEAM</div>
      <div className="faculty">
        {/* <div className="faculty1">
          <img src="src/assets/faculty.webp" alt="Teacher 1" />
          <div className="designation">
            Teacher 1<br />
            Designation
          </div>
        </div> */}
        <div className="faculty2">
          <img src="/membersIMG/hod.webp" alt="Teacher" />
          <div className="designation">
            Sreeja Nair<br />
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
