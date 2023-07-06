import React, { useState, useEffect } from "react";
import "./EventDetails.css";
import Comments from "../../components/comments/Comments";
import EventModal from "../../components/eventModal/eventModal";
import OrderEvent from "../../components/orderEvent/orderEvent";
import Gallery from "../../components/gallery/Gallery";
import dayjs from "dayjs";
import { Button, Tooltip, Link } from "@nextui-org/react";
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import { BiMap } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventById } from "../../features/events/eventSlice";
import { isNullOrUndefined } from "../../utils/isNullOrUndefined";
import parse from "html-react-parser";
// import { identifier } from "@babel/types";
import { newConnectEvent } from "../../features/action";
import { Rating } from "../../components";
const EventDetails = () => {
  const navigate = useNavigate();
  const [commentsTabs, setCommentsTabs] = useState("comments");
  const { id } = useParams();
  const dispatch = useDispatch();
  const eventDetail = useSelector((state) => state?.event?.getEventById);
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const isOnline = isOnlineEvent();
  useEffect(() => {
    dispatch(getEventById(id));
  }, [id]);
  useEffect(() => {
    if (id) {
      dispatch(newConnectEvent(id));
    }
  }, [id]);
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  const imageList = eventDetail?.imageList?.map((item) => item);

  isNullOrUndefined(eventDetail);

  if (imageList === undefined) {
    return false;
  }

  function isOnlineEvent() {
    return eventDetail?.isOnline ? "Online" : "Offline";
  }

  let today = new Date();

  // получаем дату и время
  let now = today.toLocaleString();
  console.log(now);

  let eventStatus;

  switch (eventDetail?.status) {
    case "draft":
      eventStatus = "DRAFT";
      break;
    case "Public":
      eventStatus = (now = eventDetail?.timeEnd ? "Sự kiện đang diễn ra" : "Event sắp diễn ra");
      break;
    case "Canceled":
      eventStatus = "Event đã hủy";
      break;
    default:
      eventStatus = "no information";
      break;
  }

  return (
    <div>
      <img
        src={eventDetail?.banner || "no information"}
        alt=""
        className="event__banner"
        loading="lazy"
      />
      <div className="wrapper">
        <div className="info__container">
          <div className="event__left-block">
            <Link
              to={`/origanizers/${eventDetail?.creator?._id}`}
              className="organizers"
            >
              <div className="organizers__container">
                <h3 className="organizers__title">Nhà tổ chức</h3>
                <div className="organizers__image">
                  <img
                    src={eventDetail?.creator?.avatar}
                    alt=""
                    onClick={() =>
                      navigate(`/origanizers/${eventDetail?.creator?._id}`)
                    }
                  />
                </div>
                <h5
                  onClick={() =>
                    navigate(`/origanizers/${eventDetail?.creator?._id}`)
                  }
                >
                  {eventDetail?.creator?.name || "no information"}
                </h5>
              </div>
            </Link>
            <div className="event__info">
              <h3 className="info__title">Thông tin sự kiện</h3>
              <div className="event__name">
                <h4>{eventDetail?.title || "no information"}</h4>
              </div>
              <Link href="/">
                <Tooltip content={eventDetail?.category?.categoryDescription}>
                  <Button
                    className="event__category"
                    size="xs"
                    color="primary"
                    auto
                    ghost
                  >
                    {eventDetail?.category?.categoryName || "no information"}
                  </Button>
                </Tooltip>
              </Link>
              <div className="event__adress">
                <BiMap className="cardEvent-info2-item-icon" />
                {eventDetail?.location?.district?.name || "no information"},
                {eventDetail?.location?.province?.name || "no information"},
                {eventDetail?.location?.ward?.name || "no information"},
                {eventDetail?.location?.address || "no information"}
              </div>
              <div className="event__time">
                <GiSandsOfTime className="cardEvent-info2-item-icon" />
                {dayjs(eventDetail?.timeBegin).format("DD/MM/YYYY")} -{" "}
                {dayjs(eventDetail?.timeEnd).format("DD/MM/YYYY")} (
                {dayjs(eventDetail?.timeBegin).format("HH:mm:ss")} -{" "}
                {dayjs(eventDetail?.timeEnd).format("HH:mm:ss")})
              </div>
              <div className="event__type">{isOnline}</div>
            </div>
          </div>
          <div className="event__right-block">
            {
              eventDetail?.creator?._id === userInfo?._id ? (
                eventDetail.status?.toLowerCase() === "draft" ? (
                  <Button
                    size="lg"
                    className="btn__buy"
                    color="primary"
                    bordered="false"
                    onClick={() =>
                      navigate(
                        `/event-create-update?type=update&id=${eventDetail._id}`
                      )
                    }
                  >
                    Cập nhật
                  </Button>
                ) : (
                  <div></div>
                )
              ) : !orders.find((item) => item.user._id != userInfo?._id) ? (
                <OrderEvent />
              ) : (
                <span className="event-joined-text">
                  Bạn đã đăng kí sự kiện này.
                </span>
              )
            }
            <div className="event__share">
              <Button bordered color="primary" size="xs">
                <div className="btn__share">
                  <FacebookShareButton
                    url={'https://www.example.com'}
                    quote={'Dummy text!'}
                    hashtag="#muo"
                    className='share'
                  >
                    <FacebookIcon size={15} round className='fb__icon' /> chia sẻ
                  </FacebookShareButton>
                </div>
              </Button>
              <Button bordered color="primary" size="xs">
                <div className="btn__share">
                  <TwitterShareButton
                    url={'https://www.example.com'}
                    quote={'Dummy text!'}
                    hashtag="#muo"
                    className='share'
                  >
                    <TwitterIcon size={15} round /> chia sẻ
                  </TwitterShareButton>
                </div>
              </Button>
            </div>
            <div className="event__price">
              <MdOutlineAttachMoney className="carousel-content-info-icon" />
              {eventDetail?.fee === 0
                ? "Free"
                : eventDetail?.fee || "no information"}
            </div>
            <div className={eventDetail?.status}>{eventStatus}</div>
            <div className="event__members">
              <div>
                <div className="num__members">{orders?.length}</div> người tham gia sự kiện
                </div>
              
            </div>
            <EventModal />
          </div>
          <div className="event__title">
            <h3 className="event__description">Giới thiệu</h3>
            <p className="description__item">
              {parse(eventDetail?.description) || "no information"}
            </p>
          </div>
        </div>
        <div>
          <h3 className="event__gallery">Gallery</h3>
          <Gallery loading="lazy" imageList={imageList} />
        </div>
        <div className="comment__container">
          <Button.Group>
            <Button
              className="comments__btn"
              onPress={() => setCommentsTabs("comments")}
            >
              Bình luận
            </Button>
            <Button
              className="comments__btn"
              onPress={() => setCommentsTabs("discussion")}
              disabled={eventDetail.status !== "Completed" ? true : false}
            >
              Đánh giá
            </Button>
          </Button.Group>
          {commentsTabs === "comments" ? <Comments eventId={id} /> : <Rating />}
        </div>
      </div>
    </div>
  );
};
export default EventDetails;
