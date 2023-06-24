import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './OrganizersPage.css';
import customFetch from '../../utils/axios.config';
import notify from '../../utils/notify';
import { IconStar, IconStarFilled } from './StarIcon';

const OrganizersPage = () => {
  const { id } = useParams();
  const [organizers, setOrganizers] = useState({});

  useEffect(() => {
    if (id) {
      customFetch
        .get(`/users/organizers/${id}`)
        .then((resp) => setOrganizers(resp.data))
        .catch((err) => notify('Lỗi kết nối máy chủ', 'error'));
    }
  }, []);

  const renderStarRating = () => {
    const rating = organizers?.totalRating?.toFixed(0);
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

  const renderUserRating = () => {};

  return (
    <section className='organizer'>
      <section className='organizer__image-info'>
        <section className='organizer__image'>
          <img
            src={organizers.avatar}
            alt='avatar'
            className='organizer__img'
          />
          <section className='organizer__rating'>
            {renderStarRating()}
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
          <p style={{ fontSize: '0.9rem', color: 'gray', marginLeft: '5%' }}>
            Chưa có lời giới thiệu
          </p>
        )}
      </section>
      <section className='organizer__review'>
        <p>Đánh giá</p>
        {organizers.userRating?.length > 0 ? (
          <p>{organizers.userRating}</p>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'gray', marginLeft: '5%' }}>
            Chưa có đánh giá
          </p>
        )}
      </section>
    </section>
  );
};
export default OrganizersPage;
