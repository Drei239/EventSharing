import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Rating2 from "@mui/material/Rating";
import Button from "@mui/material/Button";
import "./rating.css";
import NewRating from "./newRating/newRating";
import RatingItem from "./rating-item/ratingItem";
const Rating = () => {
  const { getEventById } = useSelector((state) => state.event);
  const [openRatingEvent, setOpenRatingEvent] = useState(false);
  const handleCloseRatingEvent = () => {
    setOpenRatingEvent(false);
  };

  return (
    <div className="rating-event">
      <h2>Đánh giá sự kiện</h2>
      <div className="rating-event-total">
        <Rating2 value={getEventById?.eventRating.toFixed(1)} precision={0.1} />
        <div>
          {" "}
          <span>{getEventById?.eventRating.toFixed(1)}</span>
          <span>({getEventById?.reviews && getEventById?.reviews.length})</span>
        </div>
      </div>
      {getEventById &&
        getEventById.reviews.map((item) => {
          return <RatingItem {...item} />;
        })}
      <div className="rating-event-btns">
        <Button
          className="rating-event-create-btn"
          variant="contained"
          onClick={() => setOpenRatingEvent(!openRatingEvent)}
        >
          Viết đánh giá
        </Button>
        <Button variant="outlined">Xem thêm</Button>
      </div>

      <NewRating open={openRatingEvent} handleClose={handleCloseRatingEvent} />
    </div>
  );
};

export default Rating;
