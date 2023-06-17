import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import "./banner.css";

const Banner = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const events = useSelector((state) => state.event.events);
  const initialImgBanner =
    "https://demo.gloriathemes.com/eventchamp/demo/wp-content/uploads/2018/11/event-18-1130x650.jpg";
  const RandomFuc = (a) => {
    return Math.floor(Math.random() * a);
  };
  useEffect(() => {
    setEvent(events?.length > 0 && events[RandomFuc(events?.length)]);
  }, []);
  const imgBanner = event?.banner || initialImgBanner;
  return (
    <div className="banner">
      <div className="banner-content">
        {" "}
        <p className="banner-topic">
          {searchParams.get("search") !== null ? "Keyword" : "Category"}
        </p>
        <h2>
          {searchParams.get("search") !== null
            ? searchParams.get("search")
            : searchParams.get("category") !== null
            ? searchParams.get("category")
            : "All"}
        </h2>
      </div>
      <img src={imgBanner} alt="" className="img-background" />
    </div>
  );
};

export default Banner;
