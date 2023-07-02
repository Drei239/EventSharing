import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import "./notifyItem.css";
const NotifyItem = ({
  avatar,
  name,
  content,
  time,
  notifyType,
  comment,
  isReadMessage,
}) => {
  const navigate = useNavigate();
  const handleClickNotiyfy = () => {};
  return (
    <div className="notify-item">
      {!isReadMessage && <div className="notify-item-isRead"></div>}
      <img src={avatar} alt="" className="notify-item-avatar" />
      <div>
        <p className="notify-item-content">
          {name} <span>{content}</span>
        </p>
        {notifyType === "new-comment" && (
          <div className="notify-item-comment">
            {comment && comment.slice(0, 50)}
          </div>
        )}
        <p className="notify-item-time">
          <span>Friday 2:20pm</span>
          <span>Sep 20,2024</span>
        </p>
      </div>
    </div>
  );
};

export default NotifyItem;
