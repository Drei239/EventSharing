import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getRelativeTimeFromNow from "../../../utils/getRelativeTimeFromNow";
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
  replyContent,
  event,
}) => {
  return (
    <div className="notify-item">
      {!isReadMessage && <div className="notify-item-isRead"></div>}
      <img
        src={avatar || event?.banner}
        alt=""
        className="notify-item-avatar"
      />
      <div>
        <p className="notify-item-content">
          <span className="notify-item-content-name">
            {" "}
            {name || `Sự kiện ${event?.title}`}
          </span>{" "}
          <span>{content}</span>
        </p>
        {notifyType === "new-comment" && (
          <div className="notify-item-comment">
            {comment && comment.slice(0, 50)}
          </div>
        )}
        {notifyType === "reply-comment" && (
          <div className="notify-item-comment">
            {replyContent && replyContent.slice(0, 50)}
          </div>
        )}
        <p className="notify-item-time">
          <span>{getRelativeTimeFromNow(time)}</span>
        </p>
      </div>
    </div>
  );
};

export default NotifyItem;
