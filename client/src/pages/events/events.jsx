import React, { useEffect } from "react";
import { Filter, Banner } from "../../components";
import { CardEvent } from "../../components";
import "./events.css";
import { useDispatch, useSelector } from "react-redux";
import { getEvent } from "../../features/events/eventSlice";
const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);
  useEffect(() => {
    dispatch(getEvent());
  }, []);
  useEffect(() => {
    console.log(events);
  }, [events]);
  return (
    <div className="events">
      <Banner />
      <Filter />
      <div className="events-card">
        {events &&
          events.length > 0 &&
          events.map((item) => {
            return (
              <CardEvent
                {...item}
                key={item._id}
                categories={["Âm nhạc", "Thời trang"]}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Events;
