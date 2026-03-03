import "./footerMob.css";
import React from "react";
// import pageTopArrow from '/pageTopArrow.svg'
export default function footer() {
  return (
    <div className="mob_Mainfooter">
      <img
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mob_topArrowSvg"
        src="/PublicAssets/pageTopArrow.svg"
        alt=""
      />
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mob_topArrowtxt"
      >
        Page Top
      </div>
      <div className="mob_footCont1">
        <div className="mob_dotLayer"></div>
        <div className="mob_quoteLayer">Where Ideas Spark and vision ignites</div>
        <h1>AI CLUB OIST</h1>
      </div>
      <div className="mob_footCont2">
        <div className="mob_foot2cont1">&copy; 2024 AI Club - OIST Bhopal</div>
        <div className="mob_foot2cont2">
          <a
            target="_blank"
            href="https://www.linkedin.com/company/aiclub-oist"
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
        <div className="mob_foot2cont3">Developed by Technical Team ’26</div>
      </div>
    </div>
  );
}
