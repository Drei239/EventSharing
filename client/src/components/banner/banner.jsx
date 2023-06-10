import React from "react";
import "./banner.css";

const banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        {" "}
        <p className="banner-topic">Category</p>
        <h2>Giải trí</h2>
      </div>
      <img
        src="https://demo.gloriathemes.com/eventchamp/demo/wp-content/uploads/2018/11/event-18-1130x650.jpg"
        alt=""
        className="img-background"
      />
    </div>
  );
};

export default banner;
