import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoOrganization } from "react-icons/go";
import { CardEvent, CardOrg, Carousel, Loading } from "../../components";
import { BsCalendar4Event } from "react-icons/bs";
import "./home.css";
import { VscOrganization } from "react-icons/vsc";
import { MdOutlineEventAvailable } from "react-icons/md";
import { motion } from "framer-motion";
import userIcon from "../../assets/user.svg";
import { EmptyEvent } from "../../components";
import {
  getHighlightEvent,
  getNewEvent,
  getRegisterEvent,
  getJoinedEvent,
} from "../../features/events/eventSlice";
import { getAllCategory } from "../../features/category/categorySlice";
import { getHighlightUser } from "../../features/user/userSlice";
import EmptyIcon from "../../assets/empty.svg";
const Home = () => {
  const dispatch = useDispatch();
  const [newEvent2, setNewEvent2] = useState([]);
  const { isLogin } = useSelector((state) => state.user);
  const { newEvents, isLoading, countDocument, joinedEvent, registeredEvent } =
    useSelector((state) => state.event);
  const { userHighlight } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState(false);
  useEffect(() => {
    dispatch(getHighlightEvent());
    dispatch(getAllCategory());
    dispatch(getJoinedEvent());
    dispatch(getRegisterEvent());
    dispatch(getHighlightUser());
  }, []);
  useEffect(() => {
    dispatch(getNewEvent(page));
  }, [page]);
  useEffect(() => {
    console.log(countDocument);
  }, [countDocument]);
  useEffect(() => {
    if (request) {
      setNewEvent2([...new Set([...newEvent2, ...newEvents])]);
    }
    setRequest(true);
  }, [newEvents]);
  return (
    <motion.div layout className="home">
      <Carousel />
      <div>
        <div className="title-home">
          <h2>Sự kiện mới nhất</h2>
          <div className="underline-title">
            <BsCalendar4Event className="icon-calendar-home" />
          </div>
        </div>
        <p className="intro">
          Tham gia với chúng tôi cho các sự kiện ly kỳ!Nhạc sống,hội thảo, triễn
          lãm nghệ thuật, v.v.! Đánh dấu lịch của bạn và đừng bỏ lỡ
        </p>
        <div className="card-events">
          {newEvent2 &&
            newEvent2.length > 0 &&
            newEvent2.map((item) => {
              console.log(item);
              return <CardEvent {...item} key={item._id} />;
            })}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
        </div>
        {-page > -Math.floor(countDocument / 4) && (
          <div className="btn-show">
            <span className="strike-left"></span>
            <button onClick={() => setPage(page + 1)}>Xem thêm</button>
            <span className="strike-right"></span>
          </div>
        )}
        <div className="title-home">
          <h2>Nhà tổ chức sự kiện nổi bật</h2>
          <div className="underline-title">
            <VscOrganization className="icon-calendar-home" />
          </div>
        </div>
        <div className="card-organizers">
          {userHighlight.length > 0 &&
            userHighlight.map((item) => {
              return <CardOrg title={item.name} img={item.avatar} />;
            })}
        </div>

        <div className="title-home">
          <h2>Sự kiện đã tham gia gần đây</h2>
          <div className="underline-title">
            <MdOutlineEventAvailable className="icon-calendar-home" />
          </div>
        </div>
        <div className="card-events">
          {joinedEvent &&
            joinedEvent.length > 0 &&
            joinedEvent.map((item) => {
              return <CardEvent {...item.event} key={item._id} />;
            })}
        </div>
        {joinedEvent && joinedEvent.length > 0 && (
          <div className="btn-show">
            <span className="strike-left"></span>
            <button>Xem thêm</button>
            <span className="strike-right"></span>
          </div>
        )}
        {isLogin && !joinedEvent && (
          <EmptyEvent
            icon={EmptyIcon}
            message="Bạn chưa tham gia sự kiện nào"
            link="/events"
            messageLink="Khám phá các sự kiện mới nhất"
          />
        )}
        {!isLogin && (
          <EmptyEvent
            icon={userIcon}
            message="Bạn chưa đăng nhập ? Xin vui lòng đăng nhập để xem các sự kiện đã đăng ký"
            link={"/login"}
            messageLink="Đăng nhập vào tài khoản của bạn"
          />
        )}
        <div className="title-home">
          <h2>Sự kiện đã đăng kí gần đây</h2>
          <div className="underline-title">
            <MdOutlineEventAvailable className="icon-calendar-home" />
          </div>
        </div>
        <div className="card-events">
          {registeredEvent &&
            registeredEvent.length > 0 &&
            registeredEvent.map((item) => {
              return <CardEvent {...item.event} key={item._id} />;
            })}
        </div>
        {registeredEvent && registeredEvent.length > 0 && (
          <div className="btn-show">
            <span className="strike-left"></span>
            <button>Xem thêm</button>
            <span className="strike-right"></span>
          </div>
        )}
        {isLogin && (!registeredEvent || registeredEvent.length <= 0) && (
          <EmptyEvent
            icon={EmptyIcon}
            message="Bạn chưa đăng kí sự kiện nào"
            link="/events"
            messageLink="Khám phá các sự kiện mới nhất"
          />
        )}
        {!isLogin && (
          <EmptyEvent
            icon={userIcon}
            message="Bạn chưa đăng nhập ? Xin vui lòng đăng nhập để xem các sự kiện đã đăng ký"
            link={"/login"}
            messageLink="Đăng nhập vào tài khoản của bạn"
          />
        )}
      </div>

      {isLoading && <Loading />}
    </motion.div>
  );
};

export default Home;
