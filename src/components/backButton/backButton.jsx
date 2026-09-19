import React from 'react';
import backBut from '../../assets/backBut.webp';
import './back.css';
import { useNavigate } from "react-router-dom";

function BackButton(props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleBack}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleBack();
        }
      }}
      id="backButtonWrap"
      className="backButtonWrap"
      style={{
        top: props.top,
        left: props.left,
        filter: props.filter,
      }}
    >
      <img src={backBut} alt="Back" />
      {props.textDisplay !== false && (
        <h5 id="backtxt" style={{ color: props.color }}>
          {props.data || "Back"}
        </h5>
      )}
    </div>
  );
}

export default BackButton;
