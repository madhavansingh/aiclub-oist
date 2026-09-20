import React, { useEffect, useState } from 'react';
import './Projects.css';
import helmet from '/projects/helmet.webp'
import cityScapes from '/projects/cityscapes.webp'
import agroAI from '/projects/agroAI.webp'

import BackButton from '../backButton/backButton';
function ProjectPage() {
  const [blurLayerHeight, setblurLayerHeight] = useState(0)
  useEffect(() => {
    window.addEventListener('resize', () => {
      setblurLayerHeight(document.getElementById("projectWrap").clientHeight)
    })
    window.addEventListener('load', () => {
      setblurLayerHeight(document.getElementById("projectWrap").clientHeight)
    })
    scrollTo({ top: 0, behavior: "smooth" })
    document.getElementById('blurLayer').style.backgroundImage = 'radial-gradient(circle, #383c3d7d 2px, transparent 1px)'
    document.getElementById('blurLayer').style.backgroundSize = '20px 20px'
  }, [])

  return (
    <>
      <BackButton textDisplay={true} filter="invert(1)" ></BackButton>
      <div id='projectWrap' className='Projectwholepage'>
        <div id='blurLayer' className="blurLayer" style={{ height: `${blurLayerHeight}px` }}></div>
        <h1 className='Projects'>Our Magzines</h1>
        <br />
        <br />
        <br />

        <div className="container">
          <div id='projBox1' onClick={() => { window.location.href = "https://drive.google.com/file/d/1AouG6oSi9FJqxgCdS20J2fAw6Yk1_j0R/view" }} className="box1">
            <img loading="lazy" decoding="async" className='projectBanner' src={cityScapes} alt="Description of the image" />
          </div>
          <span className="text1">EDGE AI, in its 1st Edition, lays the foundation of our publication journey, introducing fresh ideas, student insights, and the emerging vision of intelligent innovation at OIST.</span>
          <div id='projBox2' onClick={() => { window.location.href = "https://drive.google.com/file/d/1l5p_YplLKvjAeWtj62cpRbHi1qyCQXG5/view" }} className="box2">
            <img loading="lazy" decoding="async" className='projectBanner' src={helmet} alt="Description of the image" />
          </div>
          <span className="text2">
            EDGE AI, in its 2nd Edition, expands its perspective with deeper exploration, refined thought, and broader discussions shaping the evolving landscape of artificial intelligence.
          </span>
          <div id='projBox3' onClick={() => { window.location.href = 'https://drive.google.com/file/d/1sEz-4CvU1wyQL1qsWdydN7B_0d-rRtfV/view?usp=share_link' }} className="box3">
            <img loading="lazy" decoding="async" className='projectBanner' src={agroAI} alt="Description of the image" />
          </div>
          <span className="text3">EDGE AI, in its 3rd Edition, reflects maturity and distinction, presenting forward-thinking insights and a confident vision guiding the future of intelligent systems.</span>

        </div>
      </div>
    </>
  );
}

export default ProjectPage;
