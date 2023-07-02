import React from 'react';
import './card.css';
import { useNavigate } from 'react-router-dom';
const CardOrganizers = ({ id, img, title }) => {
  const navigate = useNavigate();

  return (
    <div
      className='card-organizer'
      onClick={() => navigate(`/origanizers/${id}`)}
    >
      <img src={img} alt='origanizers-avatar' />
      <h4>{title}</h4>
    </div>
  );
};

export default CardOrganizers;
