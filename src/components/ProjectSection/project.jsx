import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./project.css";
import ProjArrow from "../../assets/projArrow";
import ViewmoreArrow from "../../assets/viewmoreArrow";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ProjectsSection = () => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();
    gsap.registerPlugin(ScrollTrigger);
    useGSAP(() => {
        const H = document.querySelector(".projectPage").clientWidth;
        // to make body dark

        gsap.to("body", {
            scrollTrigger: {
                trigger: ".projectPage",
                scroller: "body",
                // markers: true,
                start: "top 20%",
                end: "top 10%",
                scrub: 1,
                onEnter: () => setIsDark(true),
                onLeaveBack: () => setIsDark(false),
            },
        });

        gsap.to(".projectPage", {
            translateX: -H + 300,
            scrollTrigger: {
                trigger: ".projectPage",
                scroller: "body",
                // markers: true,
                start: "top -5%",
                end: `top -${H / 6}%`,
                scrub: 2,
                pin: true,
            },
        });
    });
    useEffect(() => {
        document.getElementById('projectCont1').addEventListener('mouseenter', () => {
            document.getElementById('webCursor').style.width = 'auto'
            document.getElementById('webCursor').style.height = 'auto'
            document.getElementById('webCursor').style.padding = '8px'
            document.getElementById('webCursor').innerText = 'Explore the Magazine'
        })
        document.getElementById('projectCont1').addEventListener('mouseleave', () => {
            document.getElementById('webCursor').style.width = '20px'
            document.getElementById('webCursor').style.height = '20px'
            document.getElementById('webCursor').innerText = ''
        })
        document.getElementById('projectCont2').addEventListener('mouseenter', () => {
            document.getElementById('webCursor').style.width = 'auto'
            document.getElementById('webCursor').style.height = 'auto'
            document.getElementById('webCursor').style.padding = '8px'
            document.getElementById('webCursor').innerText = 'Explore the Magazine'
        })
        document.getElementById('projectCont2').addEventListener('mouseleave', () => {
            document.getElementById('webCursor').style.width = '20px'
            document.getElementById('webCursor').style.height = '20px'
            document.getElementById('webCursor').innerText = ''
        })
        document.getElementById('projectCont3').addEventListener('mouseenter', () => {
            document.getElementById('webCursor').style.width = 'auto'
            document.getElementById('webCursor').style.height = 'auto'
            document.getElementById('webCursor').style.padding = '8px'
            document.getElementById('webCursor').innerText = 'Explore the Magazine'
        })
        document.getElementById('projectCont3').addEventListener('mouseleave', () => {
            document.getElementById('webCursor').style.width = '20px'
            document.getElementById('webCursor').style.height = '20px'
            document.getElementById('webCursor').innerText = ''
        })
    }, [])
    return (
        <div id="projectCover" className="projectCover">
            <div className="projectPage">
                {/* <div
                    className="eventTitle"
                    style={{
                        position: "absolute",
                        top: "90px",
                        left: "120px",
                        color: isDark ? "white" : "black",
                    }}
                >
                    /Projects
                </div> */}
                <div
                    className="ghost"
                    style={{
                        width: "60px",
                    }}
                ></div>
                <div className="projectTitle">
                    <h1 style={{ color: isDark ? "white" : "black" }}>
                        Our Cool Magzines
                    </h1>
                    <ProjArrow fill={isDark ? "white" : "black"} />
                </div>
                <div id="projectCont1" className="container1" onClick={() => { navigate('/projects') }}>
                    <div className="projImg">
                        <div className="projMedia"></div>
                        <div id="mask1" className="projImgMask"></div>
                    </div>
                    <div className="projDesc">
                        EDGE AI 1st Edition marks the foundation of our publication journey, capturing the spirit of innovation, curiosity, and emerging ideas within the OIST AI Club community.
                    </div>
                    <div className="projName">EDGE AI 1st edition</div>
                    <div className="projNum">01</div>
                </div>
                <div id="projectCont2" className="container2" onClick={() => { navigate('/projects') }}>
                    <div className="projImg">
                        <div className="projMedia"></div>
                        <div id="mask2" className="projImgMask" ></div>
                    </div>
                    <div className="projDesc">
                        EDGE AI returns in its 2nd Edition with expanded perspectives, progressive ideas, and a stronger voice shaping the future of intelligence.
                    </div>
                    <div className="projName">EDGE AI 2nd edition</div>
                    <div className="projNum">02</div>
                </div>
                <div id="projectCont3" className="container3" onClick={() => { navigate('/projects') }}>
                    <div className="projImg">
                        <div className="projMedia"></div>
                        <div id="mask3" className="projImgMask"></div>
                    </div>
                    <div className="projDesc">
                        In its 3rd Edition, EDGE AI stands as a symbol of evolution and distinction, capturing transformative ideas and a mature vision guiding the future of intelligence.
                    </div>
                    <div className="projName">EDGE AI 3rd edition</div>
                    <div className="projNum">03</div>
                </div>
                <div className="projectTitle-viewmore">
                    <Link to="/projects" style={{ textDecoration: "none" }}>
                        <h1>Explore the Magazine</h1>
                        <br /> <br />
                        <ViewmoreArrow></ViewmoreArrow>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;
