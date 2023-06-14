import React from "react";
import "./card.css";
const cardOrganizers = ({ img, title }) => {
  return (
    <div className="card-organizer">
      <img src={img} alt="" />
      <h4>{title}</h4>
    </div>
  );
};

export default cardOrganizers;