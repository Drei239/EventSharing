import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Tooltip } from "@mui/material";
import Rating2 from "@mui/material/Rating";
import Button from "@mui/material/Button";
import "./rating.css";
import NewRating from "./newRating/newRating";
import RatingItem from "./rating-item/ratingItem";
const Rating = () => {
  const { getEventById } = useSelector((state) => state.event);
  const { orders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.user);
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
        <div style={{ width: "50%" }}>
          <Tooltip
            title={
              orders &&
              userInfo &&
              orders.find((item) => item.user._id === userInfo._id)
                ? ""
                : "Chỉ người đã tham gia sự kiện mới có thể đánh giá"
            }
            arrow
          >
            <span>
              <Button
                className="rating-event-create-btn"
                variant="contained"
                disabled={
                  orders &&
                  userInfo &&
                  orders.find((item) => item.user._id === userInfo._id)
                    ? false
                    : true
                }
                onClick={() => setOpenRatingEvent(!openRatingEvent)}
              >
                Viết đánh giá
              </Button>
            </span>
          </Tooltip>
        </div>
        <Button variant="outlined">Xem thêm</Button>
      </div>

      <NewRating open={openRatingEvent} handleClose={handleCloseRatingEvent} />
    </div>
  );
};

export default Rating;
