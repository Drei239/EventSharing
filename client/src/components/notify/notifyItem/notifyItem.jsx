import React from "react";
import dayjs from "dayjs";
import "./notifyItem.css";
const NotifyItem = ({ avatar, name, content, time }) => {
  return (
    <div className="notify-item">
      <img src={avatar} alt="" className="notify-item-avatar" />
      <div>
        <p className="notify-item-content">
          {name} <span>{content}</span>
        </p>
        <p className="notify-item-time">
          <span>Friday 2:20pm</span>
          <span>Sep 20,2024</span>
        </p>
      </div>
    </div>
  );
};

export default NotifyItem;
