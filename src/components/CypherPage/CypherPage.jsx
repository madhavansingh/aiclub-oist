import React, { useEffect } from 'react';
import './CypherPage.css';
import BackButton from '../backButton/backButton';
import CypherGallery from './CypherGallery';

const images1 = [
  '/eventImg/cypher-30/image1.webp', 
  '/eventImg/cypher-30/image2.webp', 
  '/eventImg/cypher-30/image3.webp'
];

const images2 = [
  '/eventImg/cypher-30/image2.webp', 
  '/eventImg/cypher-30/image3.webp', 
  '/eventImg/cypher-30/image4.webp'
];

const images3 = [
  '/eventImg/cypher-30-3.0/image1.webp', 
  '/eventImg/cypher-30-3.0/image2.webp', 
  '/eventImg/cypher-30-3.0/image3.webp', 
  '/eventImg/cypher-30-3.0/image4.webp', 
  '/eventImg/cypher-30-3.0/image5.webp'
];

const CypherPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <BackButton textDisplay={true} filter="invert(1)" />
      <div className='cypherWrap'>
        <h1 className='cypherTitle'>Cypher 30</h1>
        
        <div className="cypherContainer">
          <section className="cypherSection">
            <h2>Cypher 30 1.0</h2>
            <CypherGallery images={images1} />
          </section>

          <section className="cypherSection">
            <h2>Cypher 30 2.0</h2>
            <CypherGallery images={images2} />
          </section>

          <section className="cypherSection">
            <h2>Cypher 30 3.0</h2>
            <CypherGallery images={images3} />
          </section>
        </div>
      </div>
    </>
  );
}

export default CypherPage;
