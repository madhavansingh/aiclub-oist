import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "./Box";
import "./BoxGrid.css";
// import GooeyCursor from "../Gooey Cursor/gooeyCursor.jsx";
import Cursor from "../Cursor/cursor";
import BackButton from "../backButton/backButton";
const BoxGrid = () => {
  const [boxes, setBoxes] = useState([]);
  const [columns, setColumns] = useState(3);
  const navigate = useNavigate();

  // Fetch data from events.json
  useEffect(() => {
    fetch("/Data/events.json")
      .then((response) => response.json())
      .then((data) => setBoxes(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // Dynamically adjust columns based on window width
  const updateColumns = () => {
    if (window.innerWidth < 600) {
      setColumns(1); // 1 column for mobile view
    } else if (window.innerWidth < 900) {
      setColumns(2); // 2 columns for tablet-sized view
    } else {
      setColumns(3); // 3 columns for desktop view
    }
  };

  // Set up a listener to update columns on window resize
  useEffect(() => {
    updateColumns(); // Initial call
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const handleBoxClick = (eventName) => {
    const urlPath = eventName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/events/${urlPath}`);
  };

  return (
    <>
      {/* <GooeyCursor /> */}
      <BackButton textDisplay={true} top="10px" filter='invert(1)' ></BackButton>
      <Cursor></Cursor>
      <h1 id="galleryHeading" >Select Event for Gallery</h1>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {boxes.map((box) => (
          <Box
            banner={box.img}
            key={box.id}
            letter={box.name}
            handleClick={() => handleBoxClick(box.name)}
          />
        ))}
      </div>
    </>
  );
};

export default BoxGrid;
