import React, { useEffect } from "react";
import styled from "styled-components";
import "./carousel.css";
import dayjs from "dayjs";
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
import { useSelector } from "react-redux";
SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

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
const Carousel = () => {
  const highlightEvent = useSelector((state) => state.event.highlightEvent);
  return (
    <div className="carousel">
      <StyledSwiper
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000 }}
      >
        {highlightEvent.map((item) => {
          return (
            <SwiperSlide key={item._id}>
              <div className="slide-item">
                <div className="carousel-content">
                  <span className="carousel-category">
                    {item.category.categoryName}
                  </span>
                  <h2>{item.title}</h2>
                  <div className="carousel-content-info">
                    <div className="carousel-content-info-item">
                      <AiOutlineCalendar className="carousel-icon-calendar carousel-content-info-icon" />
                      <span className="carousel-content-info-text">
                        {dayjs(item?.timeBegin).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="carousel-content-info-item">
                      <BiMap className="carousel-content-info-icon" />
                      <span className="carousel-content-info-text">
                        {item.location}
                      </span>
                    </div>
                    <div className="carousel-content-info-item">
                      <MdOutlineAttachMoney className="carousel-content-info-icon" />
                      <span className="carousel-content-info-text">
                        {item.fee === 0 ? "free" : item.fee}
                      </span>
                    </div>
                  </div>
                  <div className="carousel-content-btn">
                    <button className="carousel-content-btn-item">
                      Chi tiết
                    </button>
                    <button className="carousel-content-btn-item">
                      Mua vé
                    </button>
                  </div>
                </div>
                <img className="carousel-img" src={item.banner} alt="" />
              </div>
            </SwiperSlide>
          );
        })}

        {/* ... */}
      </StyledSwiper>
    </div>
  );
};

export default Carousel;
