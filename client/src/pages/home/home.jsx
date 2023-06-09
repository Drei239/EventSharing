import React from "react";
import { GoOrganization } from "react-icons/go";
import { CardEvent, CardOrg, Carousel } from "../../components";
import { BsCalendar4Event } from "react-icons/bs";
import "./home.css";
import { VscOrganization } from "react-icons/vsc";
import { MdOutlineEventAvailable } from "react-icons/md";
const home = () => {
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
          <CardEvent
            title={
              "Trọng Hqqqqiếu weqhweqwh hqwkjeqw wehqwkjeq - DANCE YOUR ENEGRY UP MINISHOW"
            }
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
    </div>
  );
};

export default home;
