import React, { useState, useEffect } from "react";
import "./EventDetails.css";
import Comments from "../../components/comments/Comments";
import Discussions from "../../components/discussions/Discussions";
import EventModal from "../../components/ui/eventModal";
import Gallery from "../../components/gallery/Gallery";
import dayjs from "dayjs";
import { Button, Tooltip, Link } from "@nextui-org/react";
import { BiMap } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventById } from "../../features/events/eventSlice";
import { sendNotifyNewOrder } from "../../features/action";
const EventDetails = () => {
  const navigate = useNavigate();
  const [commentsTabs, setCommentsTabs] = useState("comments");
  const { id } = useParams();
  const dispatch = useDispatch();
  const eventDetail = useSelector((state) => state?.event?.getEventById[0]);
  const isOnline = isOnlineEvent();
  console.log("####", eventDetail);

  useEffect(() => {
    dispatch(getEventById(id));
  }, []);
  useEffect(() => {
    if (eventDetail) {
      dispatch(sendNotifyNewOrder({ creatorId: eventDetail?.creator?._id }));
    }
  }, [eventDetail]);
  const imageList = eventDetail?.imageList?.map((item) => item);

  console.log(imageList);
  const images = [
    "https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg",
    "https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg",
    "https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg",
  ];
  if (imageList == undefined) {
    return false;
  }

  if (eventDetail == undefined) {
    return false;
  }

  function isOnlineEvent() {
    return eventDetail?.isOnline ? "Online" : "Offline";
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
                      navigate(`/origanizers/${eventDetail.creator._id}`)
                    }
                  />
                </div>
                <h5
                  onClick={() =>
                    navigate(`/origanizers/${eventDetail.creator._id}`)
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
            {eventDetail.status?.toLowerCase() === "draft" ? (
              <Button
                size="lg"
                className="btn__buy"
                color="primary"
                bordered="false"
                onClick={() =>
                  navigate(
                    `/event-create-update?type=update&${eventDetail._id}`
                  )
                }
              >
                Cập nhật
              </Button>
            ) : (
              <Button
                size="lg"
                className="btn__buy"
                color="primary"
                bordered="false"
              >
                Mua vé
              </Button>
            )}

            <div className="event__share">
              <Button bordered color="primary" size="xs">
                <div className="btn__share">Chia sẻ</div>
              </Button>
              <Button bordered color="primary" size="xs">
                <div className="btn__share">Chia sẻ</div>
              </Button>
            </div>
            <div className="event__price">
              <MdOutlineAttachMoney className="carousel-content-info-icon" />
              {eventDetail?.fee === 0
                ? "Free"
                : eventDetail?.fee || "no information"}
            </div>
            <div className="event__status">
              "{eventDetail?.status || "no information"}"
            </div>
            <div className="event__members">
              <EventModal />
            </div>
          </div>
          <div className="event__title">
            <h3 className="event__description">Giới thiệu</h3>
            <p className="description__item">
              {eventDetail?.description || "no information"}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              debitis, asperiores doloremque quisquam, eius quasi amet
              consequatur rem velit exercitationem aliquam quidem, eum omnis
              blanditiis tempore architecto totam optio quis! Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Expedita debitis,
              asperiores doloremque quisquam, eius quasi amet consequatur rem
              velit exercitationem aliquam quidem, eum omnis blanditiis tempore
              architecto totam optio quis! Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Expedita debitis, asperiores
              doloremque quisquam, eius quasi amet consequatur rem velit
              exercitationem aliquam quidem, eum omnis blanditiis tempore
              architecto totam optio quis! Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Expedita debitis, asperiores
              doloremque quisquam, eius quasi amet consequatur rem velit
              exercitationem aliquam quidem, eum omnis blanditiis tempore
              architecto totam optio quis!
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "5px 0",
          }}
        >
          <h3 className="event__gallery">Gallery</h3>
          <Gallery imageList={imageList} />
        </div>
        <div className="comment__container">
          <Button.Group>
            <Button
              className="comments__btn"
              onPress={() => setCommentsTabs("comments")}
            >
              Comments
            </Button>
            <Button
              className="comments__btn"
              onPress={() => setCommentsTabs("discussion")}
            >
              Discussions
            </Button>
          </Button.Group>
          {commentsTabs === "comments" ? <Comments /> : <Discussions />}
        </div>
      </div>
    </div>
  );
};
export default EventDetails;
