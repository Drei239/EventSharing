import React from "react";
import "./cardEvent.css";
import dayjs from "dayjs";
const card = ({ title, date, author, img }) => {
  return (
    <div className="card">
      <img src={img} alt="" className="card-img" />
      <h3 className="card-title">{title}</h3>
      <span className="card-time">{dayjs(date).format("DD/MM/YYYY")}</span>
      <p className="card-author">{author}</p>
    </div>
  );
};

export default card;
