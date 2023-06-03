import React from "react";
import styled from "styled-components";
import "./carousel.css";
import SwiperCore, { Navigation, Pagination, EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

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
    color: #5db2bf;
    border: 2px solid #5db2bf;
    overflow: hidden;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    border-radius: 20px;
    width: 20px;
    height: 4px;
    background: #5db2bf;
  }
`;
const index = () => {
  return (
    <div className="carousel">
      <StyledSwiper
        navigation
        pagination
        loop
        autoplay
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/08/29C8C3.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/08/29C8C3.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/08/29C8C3.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-item">
            <img
              className="carousel-img"
              src="https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/05/08/29C8C3.jpg"
              alt=""
            />
          </div>
        </SwiperSlide>
        {/* ... */}
      </StyledSwiper>
    </div>
  );
};

export default index;