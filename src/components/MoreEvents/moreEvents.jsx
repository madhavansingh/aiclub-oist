import React, { useEffect, useState } from 'react';
import './moreEvents.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BackButton from '../backButton/backButton.jsx';
gsap.registerPlugin(ScrollTrigger);


const MoreEvents = () => {

  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    fetch("/Data/events.json")
      .then((response) => response.json())
      .then((data) => {
        // Object.keys(data).map((i) =>{
        //   eventsData.push(data[i])
        // })
        // console.log(eventsData);
        setEventsData(data)


        gsap.utils.toArray("#eventBox").forEach((div) => {
          gsap.to(div,
            {
              scale: 0.8,
              opacity: 0,
              scrollTrigger: {
                trigger: div,
                start: "top 5%",
                end: "bottom 5%",
                // markers: true,
                scrub: true,
              }
            });
        });
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <>
      <BackButton textDisplay={true} ></BackButton>
      <main className="fscreen">
        {eventsData.map((event) => (
          <div key={event.id} id='eventBox' className={`div${event.id}`}>
            <div className="title">{event.name}</div>
            <div className="green-section">
              <div className="image-placeholder">
                <img loading="lazy" decoding="async" className='eventImg' src={event.img} alt={event.name} />
              </div>
              <div className="text-section">
                {event.description}
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default MoreEvents;
