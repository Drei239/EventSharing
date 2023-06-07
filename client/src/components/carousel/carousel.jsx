import React from "react";
import styled from "styled-components";
import "./carousel.css";
import SwiperCore, {
  Navigation,
  Pagination,
  EffectCoverflow,
  EffectFade,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiMap } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
SwiperCore.use([Navigation, Pagination, EffectFade,Autoplay]);

// Tạo một component Swiper kiểu thành phần và tùy chỉnh kiểu dáng bằng CSS-in-JS
const StyledSwiper = styled(Swiper)`
  /* Tùy chỉnh kiểu dáng của Swiper container */
  width: 100%;
  height: 400px;
  background-color: #f2f2f2;

  /* Tùy chỉnh kiểu dáng của các slide */
  .swiper-slide {
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }

  /* Tùy chỉnh kiểu dáng của nút next và prev */
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    border: 2px solid white;
    overflow: hidden;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 25px;
  }

  .swiper-button-next {
    right: 10px;
  }

  .swiper-button-prev {
    left: 10px;
  }
  .swiper-pagination-bullet {
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: white;
  }
`;
const index = () => {
  return (
    <div className="carousel">
      <StyledSwiper
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{delay:5000}}
       
      >
        <SwiperSlide>
          <div className="slide-item">
            <div className="carousel-content">
              <span className="carousel-category">BUSINESS</span>
              <h2>Eventchamp Conference</h2>
              <div className="carousel-content-info">
                <div className="carousel-content-info-item">
                  <AiOutlineCalendar className="carousel-icon-calendar carousel-content-info-icon" />
                  <span className="carousel-content-info-text">
                    March 12,2023
                  </span>
                </div>
                <div className="carousel-content-info-item">
                  <BiMap className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">LONDON</span>
                </div>
                <div className="carousel-content-info-item">
                  <MdOutlineAttachMoney className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">500</span>
                </div>
              </div>
              <div className="carousel-content-btn">
                <button className="carousel-content-btn-item">Chi tiết</button>
                <button className="carousel-content-btn-item">Mua vé</button>
              </div>
            </div>
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/25/191E74.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <div className="carousel-content">
              <span className="carousel-category">BUSINESS</span>
              <h2>Eventchamp Conference</h2>
              <div className="carousel-content-info">
                <div className="carousel-content-info-item">
                  <AiOutlineCalendar className="carousel-icon-calendar carousel-content-info-icon" />
                  <span className="carousel-content-info-text">
                    March 12,2023
                  </span>
                </div>
                <div className="carousel-content-info-item">
                  <BiMap className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">LONDON</span>
                </div>
                <div className="carousel-content-info-item">
                  <MdOutlineAttachMoney className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">500</span>
                </div>
              </div>
              <div className="carousel-content-btn">
                <button className="carousel-content-btn-item">Chi tiết</button>
                <button className="carousel-content-btn-item">Mua vé</button>
              </div>
            </div>
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/16/319687.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/06/02/4514FE.jpg"
              alt=""
            />
            <div className="carousel-content">
              <span className="carousel-category">BUSINESS</span>
              <h2>Eventchamp Conference</h2>
              <div className="carousel-content-info">
                <div className="carousel-content-info-item">
                  <AiOutlineCalendar className="carousel-icon-calendar carousel-content-info-icon" />
                  <span className="carousel-content-info-text">
                    March 12,2023
                  </span>
                </div>
                <div className="carousel-content-info-item">
                  <BiMap className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">LONDON</span>
                </div>
                <div className="carousel-content-info-item">
                  <MdOutlineAttachMoney className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">500</span>
                </div>
              </div>
              <div className="carousel-content-btn">
                <button className="carousel-content-btn-item">Chi tiết</button>
                <button className="carousel-content-btn-item">Mua vé</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/08/29C8C3.jpg"
              alt=""
            />
            <div className="carousel-content">
              <span className="carousel-category">BUSINESS</span>
              <h2>Eventchamp Conference</h2>
              <div className="carousel-content-info">
                <div className="carousel-content-info-item">
                  <AiOutlineCalendar className="carousel-icon-calendar carousel-content-info-icon" />
                  <span className="carousel-content-info-text">
                    March 12,2023
                  </span>
                </div>
                <div className="carousel-content-info-item">
                  <BiMap className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">LONDON</span>
                </div>
                <div className="carousel-content-info-item">
                  <MdOutlineAttachMoney className="carousel-content-info-icon" />
                  <span className="carousel-content-info-text">500</span>
                </div>
              </div>
              <div className="carousel-content-btn">
                <button className="carousel-content-btn-item">Chi tiết</button>
                <button className="carousel-content-btn-item">Mua vé</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* ... */}
      </StyledSwiper>
    </div>
  );
};

export default index;
