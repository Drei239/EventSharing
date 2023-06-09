import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Pagination, Grid, Radio } from '@nextui-org/react';
import { Filter, Banner, Loading } from '../../components';
import { CardEvent } from '../../components';
import './events.css';
import { useDispatch, useSelector } from 'react-redux';
import { getEvent } from '../../features/events/eventSlice';
import { useSearchParams } from 'react-router-dom';
const Events = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { filter, events, isLoading } = useSelector((state) => state.event);

  const totalCount = useSelector((state) => state.event.countDocument);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(
      getEvent(
        `${filter.category !== '' ? `category=${filter.category}` : ''}${
          filter.sort !== '' ? `sort=${filter.sort}` : ''
        }${filter.fee !== '' ? `&${filter.fee}` : ''}${
          filter.type !== '' ? `&${filter.type}` : ''
        }${
          filter.date
            ? `&timeBegin[gte]=${filter.date.from}&timeEnd[lte]=${
                filter.date.to
              }&timeEndSignup[gte]=${dayjs().format(
                'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
              )}`
            : ''
        }${
          searchParams.get('search') !== null && searchParams.get('search')
            ? `&keyword=${searchParams.get('search')}`
            : ''
        }&page=${currentPage}&limit=2`
      )
    );
  }, [filter, currentPage, searchParams]);
  useEffect(() => {
    console.log(totalCount);
  }, [totalCount]);
  return (
    <div className="events">
      <Banner />
      <Filter />
      <div className="events-card">
        {events &&
          events.length > 0 &&
          events.map((item) => {
            return <CardEvent {...item} key={item._id} />;
          })}
      </div>
      <div className="pagination">
        <Pagination
          shadow
          color="primary"
          total={Math.round(totalCount / 2)}
          size="md"
          rounded
          onChange={handlePaginationChange}
        />
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Events;
