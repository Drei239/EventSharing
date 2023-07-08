import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './OrganizersPage.css';
import customFetch from '../../utils/axios.config';
import notify from '../../utils/notify';
import { IconStar, IconStarFilled } from './StarIcon';
import { CardEvent } from '../../components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';

const OrganizersPage = () => {
  const { id } = useParams();
  const [organizers, setOrganizers] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (id) {
      customFetch
        .get(`/users/organizers/${id}`)
        .then((resp) => setOrganizers(resp.data))
        .catch((err) => notify('Lỗi kết nối máy chủ', 'error'));

      customFetch
        .get(`/events/organizers/${id}`)
        .then((resp) => setEvents(resp.data))
        .catch((err) => notify('Lỗi kết nối máy chủ', 'error'));
    }
  }, []);

  const renderStarRating = (value) => {
    const rating = value?.toFixed(0);
    let result = [];

    if (rating == 0) {
      return [
        <IconStar />,
        <IconStar />,
        <IconStar />,
        <IconStar />,
        <IconStar />,
      ];
    }

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        result.push(<IconStarFilled />);
      } else {
        result.push(<IconStar />);
      }
    }

    return result;
  };

  const renderUserRating = () => {
    return organizers.userRating?.map((item, index) => {
      return (
        <article key={index} className='organizer__user-review'>
          <p>{renderStarRating(item.star)}</p>
          <p>{item.comment}</p>
        </article>
      );
    });
  };

  console.log(events);
  const renderPunlicEvents = (type) => {
    let eventsList = [];
    switch (type.toLowerCase()) {
      case 'public':
        eventsList = events?.filter(
          (event) => event.status.toLowerCase() === 'public'
        );
        break;

      case 'complete':
        eventsList = events?.filter(
          (event) => event.status.toLowerCase() === 'complete'
        );
        break;
    }

    if (eventsList?.length > 0) {
      return eventsList?.map((event, index) => {
        return (
          <SwiperSlide>
            <CardEvent key={index} {...event} />
          </SwiperSlide>
        );
      });
    }

    return (
      <p style={{ color: 'grey', fontSize: '0.9rem' }}>
        Chưa có sự kiện{' '}
        {type.toLowerCase() === 'public' ? 'đang diễn ra' : 'đã tổ chức'}
      </p>
    );
  };

  return (
    <section className='organizer'>
      <section className='organizer__left'>
        <section className='organizer__image-info'>
          <section className='organizer__image'>
            <img
              src={organizers.avatar}
              alt='avatar'
              className='organizer__img'
            />
            <section className='organizer__rating'>
              {renderStarRating(organizers?.totalRating)}
              <p>
                {organizers.userRating?.length > 0
                  ? `${organizers.userRating.length}`
                  : 'Chưa có'}{' '}
                đánh giá
              </p>
            </section>
          </section>
          <section className='organizer__info'>
            <p>{organizers.name}</p>
            <p>{organizers.email}</p>
            {organizers.phone && <p>{organizers.phone}</p>}
          </section>
        </section>
        <section className='organizer__description'>
          <p>Giới thiệu</p>
          {organizers.description ? (
            <p>{organizers.description}</p>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'gray' }}>
              Chưa có lời giới thiệu
            </p>
          )}
        </section>
        <section className='organizer__review'>
          <p>Đánh giá</p>
          <section>
            {organizers.userRating?.length > 0 ? (
              renderUserRating()
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                Chưa có đánh giá
              </p>
            )}
          </section>
        </section>
      </section>

      <section className='organizer__right'>
        <section>
          <p>Sự kiện sắp diễn ra</p>
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className='mySwiper'
          >
            {renderPunlicEvents('public')}
          </Swiper>
        </section>
        <section>
          <p>Sự kiện đã tổ chức</p>
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className='mySwiper'
          >
            {renderPunlicEvents('complete')}
          </Swiper>
        </section>
      </section>
    </section>
  );
};
export default OrganizersPage;
