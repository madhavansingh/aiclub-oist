import { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader/loader.jsx";
import Proj from "./components/ProjectSection/project";
import PorjectsPage from "./components/PorjectsPage/projectpage";
import Magazine from "./components/Magazine/magazine";
import Heropage from "./components/HeroSection/herosection";
import TeamMembersSection from "./components/TeamMembersSection/teamMembers";
import TeamMembersSectionMobile from "./components/TeamMembersSection/teamMembersMobile.jsx";
import EventSection from "./components/EventSection/eventsection";
import EventsSectionMobile from "./components/EventSection/eventsectionmobile";
import GallerySection from "./components/gallery/gallerysection";
import GallerySectionMobile from "./components/gallery/gallerysectionmobile";
import Footer from "./components/Footer/footer";
import FooterMobile from "./components/FooterMobile/footermobile";
import BoxGrid from "./components/gallery/BoxGrid.jsx";
import AsymmetricScrollingGallery from "./components/gallery/Gallery.jsx";
import Scroller from "./components/Scroller/scroller.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import LandingPageMob from "./components/LandingPage/LandingPageMob.jsx";
import Menu from "./components/Menu/menu.jsx";
import CypherPage from "./components/CypherPage/CypherPage.jsx";
import BlogPage from "./components/BlogPage/BlogPage.jsx";
import BlogPost from "./components/BlogPage/BlogPost.jsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
};

const App = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [loading, setLoading] = useState(true);
  const mainContentRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    if (!lenis) return;
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  useEffect(() => {
    var lastWidth = window.innerWidth;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth !== lastWidth) {
        window.location.pathname == "/magazine" ? "" : window.location.reload();
      }
      lastWidth = window.innerWidth;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!loading) {
      const timeline = gsap.timeline();
      timeline
        .to(mainContentRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      const contentElements = mainContentRef.current.querySelectorAll(".content");
      if (contentElements.length > 0) {
        const timeline = gsap.timeline();
        timeline
          .to(mainContentRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          })
          .fromTo(
            contentElements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.2, stagger: 0.2, ease: "power2.out" }
          );
      }
      // setTimeout(() => {
      //   console.clear()
      //   console.log(`
      //        /￣ヽ
      //      ∠)_・/  ∧_∧ 　　 
      //       /  /  ( ･ω･) 　　
      //      (  ￣ ￣∪ ∪￣) 
      //       ~~~~~~~~~~~~
      //     `)
      // }, 1000);
    }
  }, [loading]);

  return (
    <>
      {loading && <Loader onLoadingComplete={() => setLoading(false)} />}
      {!loading && (
        <div
          ref={mainContentRef}
          style={{ opacity: 0, transition: "opacity 0.1s ease-in-out" }}
        >
          <Router>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Scroller />
                    <Menu />
                    {isMobile ? <LandingPageMob /> : <LandingPage />}
                    <Heropage />
                    {isMobile ? <EventsSectionMobile /> : <EventSection />}
                    {isMobile ? <GallerySectionMobile /> : <GallerySection />}
                    <Proj />
                    {isMobile ? (
                      <TeamMembersSectionMobile />
                    ) : (
                      <TeamMembersSection />
                    )}
                    {isMobile ? <FooterMobile /> : <Footer />}
                  </>
                }
              />
              <Route path="/events" element={<BoxGrid />} />
              <Route path="/events-gallery" element={<BoxGrid />} />
              <Route
                path="/events/:eventName"
                element={<AsymmetricScrollingGallery />}
              />
              <Route path="/magazine" element={<Magazine />} />
              <Route path="/projects" element={<PorjectsPage />} />
              <Route path="/cypher" element={<CypherPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
};

export default App;