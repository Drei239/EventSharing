import React from "react";
import Rating from "@mui/material/Rating";
import getRelativeTimeFromNow from "../../../utils/getRelativeTimeFromNow";
import "./ratingItem.css";
const RatingItem = ({ image, title, comment, rating, createdAt, user }) => {
  return (
    <div>
      <div className="rating-item">
        <div className="rating-item-date">
          {/* {getRelativeTimeFromNow(createdAt)} */}
        </div>
        <div className="rating-item-creator">
          <img
            src={user.avatar}
            alt=""
            className="rating-item-creator-avatar"
          />
          <p className="rating-item-creator-name">{user.name}</p>
        </div>

        <Rating
          name="read-only"
          value={rating}
          className="rating-item-creator-rating"
        />
        <h4 className="rating-item-title">{title}</h4>
        <p className="rating-item-comment">{comment}</p>
        <div className="rating-item-img-list">
          {image &&
            image.length > 0 &&
            image.map((item) => {
              return <img src={item} alt="" />;
            })}
        </div>
      </div>
    </div>
  );
};

export default RatingItem;
