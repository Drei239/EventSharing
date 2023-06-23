import React from "react";
import { Link } from "react-router-dom";
import "./emptyEvent.css";
const emptyEvent = ({ message, icon, link, messageLink }) => {
  return (
    <div className="empty-events-home">
      <img src={icon} alt="" />
      <p>{message}</p>
      <Link to={link} reloadDocument={true}>
        {messageLink}
      </Link>
    </div>
  );
};

export default emptyEvent;
