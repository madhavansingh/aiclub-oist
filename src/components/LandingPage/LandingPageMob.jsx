import React, { useEffect, useRef } from 'react'
import './LandingPage.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function LandingPage() {
    const landingRef = useRef(null)

    useEffect(() => {
        if (!landingRef.current) return;

        let ctx = gsap.context(() => {
            gsap.from(".box1row1, .mainBox1, .mainBox2, .box1row3main, .landingFooter", {
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",
                delay: 0.4
            });

            gsap.to(landingRef.current, {
                y: -50,
                opacity: 0,
                scale: 0.95,
                scrollTrigger: {
                    trigger: landingRef.current,
                    start: "top top",
                    end: "bottom center",
                    scrub: 1
                }
            });
        }, landingRef);

        return () => ctx.revert(); // clean up to prevent memory leaks or crashes
    }, []);

    return (
        <div ref={landingRef} className='landingPageWrap'>
            <div className="landingMain">
                <div className="box1row1">
                    AI CLUB OIST
                    <img src="/PublicAssets/club_dark.webp" alt="" srcset="" />
                </div>
                <div className="mainBox1">
                    <div className="box1row2">
                        <div className="box2row1">
                            The AI Club at OIST is a hub for innovators and creators. From TEDx to Cypher 3.0, we lead transformative events that inspire, innovate, and redefine the future of Artificial Intelligence.
                        </div>
                        <div className="box1row2side">
                            <img src="/PublicAssets/landRing.svg" alt="" />
                        </div>
                    </div>
                    <div className="box1row3">
                        <div className="box1row3side"></div>
                        <div className="box2row2col1">
                            <img src="/PublicAssets/robot.webp" alt="" srcset="" />
                        </div>
                    </div>
                </div>
                <div className="mainBox2">
                    <div className="box1row2main">
                        <div className="vertxt">sudo rm -rf /models</div>
                        Innovate
                        <br />
                        Elevate
                        <br />
                        Impact
                        <br />
                        Collaborate
                        <br />
                        Lead
                    </div>
                </div>
                <div className="box1row3main">
                    Let’s talk about <span> &nbsp; AI</span>
                </div>
            </div>
            <div className="landingInfiniteScroll">
                <div className="landingFooter">
                    TEDx / Projects / Workshops / Webinars / Sessions / Events / Competitions / Exhibitions
                </div>
            </div>
        </div>
    )
}

export default LandingPage
