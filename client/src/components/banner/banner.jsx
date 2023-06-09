import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./banner.css";

const Banner = () => {
  const events = useSelector((state) => state.event.events);
  const countDocument = useSelector((state) => state.event.countDocument);
  const RandomFuc = (a) => {
    return Math.floor(Math.random() * a);
  };

  return (
    <div className="banner">
      <div className="banner-content">
        {" "}
        <p className="banner-topic">Category</p>
        <h2>Giải trí</h2>
      </div>
      <img
        src={
          events?.length > 0
            ? events[RandomFuc(events.length)]?.banner
            : "https://demo.gloriathemes.com/eventchamp/demo/wp-content/uploads/2018/11/event-18-1130x650.jpg"
        }
        alt=""
        className="img-background"
      />
    </div>
  );
};

export default Banner;
