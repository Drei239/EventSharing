import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoOrganization } from "react-icons/go";
import { CardEvent, CardOrg, Carousel, Loading } from "../../components";
import { BsCalendar4Event } from "react-icons/bs";
import "./home.css";
import { VscOrganization } from "react-icons/vsc";
import { MdOutlineEventAvailable } from "react-icons/md";
import { getHighlightEvent } from "../../features/events/eventSlice";
import { getNewEvent } from "../../features/events/eventSlice";
import { getAllCategory } from "../../features/category/categorySlice";
const Home = () => {
  const dispatch = useDispatch();
  const [newEvent2, setNewEvent2] = useState([]);
  const { newEvents, isLoading, countDocument } = useSelector(
    (state) => state.event
  );
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(getHighlightEvent());
    dispatch(getAllCategory());
  }, []);
  useEffect(() => {
    dispatch(getNewEvent(page));
  }, [page]);

  useEffect(() => {
    setNewEvent2([...new Set([...newEvent2, ...newEvents])]);
  }, [newEvents]);
  return (
    <div className="home">
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
              return <CardEvent {...item} key={item._id} />;
            })}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
          {isLoading && <Loading />}
        </div>
        {page <= Math.floor(countDocument / 4) && (
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
          <CardOrg
            title="Phòng trà Bến Thành"
            img={
              "https://static.tkbcdn.com/Upload/organizerlogo/2022/10/22/725454.jpg"
            }
          />
          <CardOrg
            title="Phòng trà Bến Thành"
            img={
              "https://static.tkbcdn.com/Upload/organizerlogo/2022/10/22/725454.jpg"
            }
          />
          <CardOrg
            title="Phòng trà Bến Thành"
            img={
              "https://static.tkbcdn.com/Upload/organizerlogo/2022/10/22/725454.jpg"
            }
          />
          <CardOrg
            title="Phòng trà Bến Thành"
            img={
              "https://static.tkbcdn.com/Upload/organizerlogo/2022/10/22/725454.jpg"
            }
          />
          <CardOrg
            title="Phòng trà Bến Thành"
            img={
              "https://static.tkbcdn.com/Upload/organizerlogo/2022/10/22/725454.jpg"
            }
          />
        </div>
        <div className="btn-show">
          <span className="strike-left"></span>
          <button>Xem thêm</button>
          <span className="strike-right"></span>
        </div>
        <div className="title-home">
          <h2>Sự kiện đã tham gia gần đây</h2>
          <div className="underline-title">
            <MdOutlineEventAvailable className="icon-calendar-home" />
          </div>
        </div>

        <div className="card-events">
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
          <CardEvent
            title={"Trọng Hiếu - DANCE YOUR ENEGRY UP MINISHOW"}
            img={
              "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/23/7CCE31.jpg"
            }
            date={"Thu Jan 01 2023 05:30:00"}
            author="Live Music"
          />
        </div>
        <div className="btn-show">
          <span className="strike-left"></span>
          <button>Xem thêm</button>
          <span className="strike-right"></span>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Home;
