import "./Box.css";

const Box = ({ letter, handleClick, banner }) => {
  return (
    <div
      style={{ backgroundImage: `url(${banner})` }}
      className="box"
      onClick={handleClick}
    >
      {letter}
    </div>
  );
};

export default Box;
