import "./Box.css";

const Box = ({ letter, handleClick, banner }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      style={{ backgroundImage: `url(${banner})` }}
      className="box"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {letter}
    </div>
  );
};

export default Box;
