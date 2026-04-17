import "./footer.css";
import React from "react";
import ContactPage from "../ContactPage/ContactPage";
// import pageTopArrow from '/pageTopArrow.svg'
export default function footer() {
  return (
    <div className="Mainfooter">
      <img
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="topArrowSvg"
        src="/PublicAssets/pageTopArrow.svg"
        alt=""
      />
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="topArrowtxt"
      >
        Page Top
      </div>
      <div className="footCont1">
        <div className="dotLayer"></div>
        <div className="quoteLayer">Where Ideas Spark and vision ignites</div>
        <h1>AI CLUB</h1>
      </div>
      <ContactPage />
      <div className="footCont2">
        <div className="foot2cont1">&copy; 2026 AI Club - OIST Bhopal</div>
        <div className="foot2cont2">
          <a
            target="_blank"
            href="https://www.linkedin.com/in/ai-club-oist-37bbb2301/"
          >
            LinkedIn
          </a>
          <a target="_blank" href="https://www.instagram.com/aicluboist?igsh=MWlmMThxbTlyMHlkdw==">
            Instagram
          </a>
          <a target="_blank" href="https://github.com/madhavansingh">
            Github
          </a>
          <a target="_blank" href="">
            
          </a>
        </div>
        <div className="foot2cont3">Developed by Technical Team ’26</div>
      </div>
    </div>
  );
}
