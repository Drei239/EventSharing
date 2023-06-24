import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { Pagination } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Filter, Banner, Loading } from "../../components";
import { CardEvent } from "../../components";
import "./events.css";
import { getEvent } from "../../features/events/eventSlice";
import { LoadingBanner } from "../../components";
import EmptyIcon from "../../assets/empty.svg";

const Events = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [request, setRequest] = useState(false);
  const { filter, events, isLoading } = useSelector((state) => state.event);
  const totalCount = useSelector((state) => state.event.countDocument);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    if (
      request ||
      searchParams.get("search") ||
      (!searchParams.get("search") && filter.category === "")
    ) {
      dispatch(
        getEvent(
          `${filter.category !== "" ? `category=${filter.category}` : ""}${
            filter.sort !== "" ? `&sort=${filter.sort}` : ""
          }${filter.fee !== "" ? `&${filter.fee}` : ""}${
            filter.type !== "" ? `&${filter.type}` : ""
          }${\
            filter.date
              ? `&timeBegin[gte]=${filter.date.from}&timeEnd[lte]=${
                  filter.date.to
                }&timeEndSignup[gte]=${dayjs().format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                )}`
              : ""
          }${
            searchParams.get("search")
              ? `&keyword=${searchParams.get("search")}`
              : ""
          }&page=${currentPage}&limit=4`
        )
      );
    }
    setRequest(true);
  }, [filter, currentPage, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
  useEffect(() => {
    console.log(events);
  }, [events]);
  return (
    <motion.div className="events" layout>
      <div className="banner-event">
        {isLoading ? <LoadingBanner /> : <Banner />}
      </div>
      <Filter />

      <div>
        <div className="events-card">
          {events &&
            events?.length > 0 &&
            events.map((item) => {
              return <CardEvent {...item} key={item._id} />;
            })}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
        </div>
        {totalCount > 4 && (
          <div className="pagination">
            <Pagination
              shadow
              color="primary"
              total={Math.round(totalCount / 4)}
              size="md"
              rounded
              onChange={handlePaginationChange}
            />
          </div>
        )}
      </div>

      <div>
        {!isLoading && totalCount === 0 && (
          <div className="empty-events">
            <img src={EmptyIcon} alt="" />
            <p>Rất tiết, không có kết quả nào phù hợp với yêu cầu của bạn.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Events;
