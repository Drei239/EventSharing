import { Link } from 'react-router-dom';
import { logout } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';
import customFetch from '../../utils/axios.config';
import { useEffect, useRef, useState } from 'react';
import './AvatarComponent.css';

const AvatarComponent = ({ avatar, email, name }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState({ flag: 0, is: false });
  const menuRef = useRef();

  useEffect(() => {
    const checkIsOpen = (e) => {
      if (isOpen.flag === 1) {
        setIsOpen({ ...isOpen, flag: 2 });
      }

      if (isOpen.flag === 2) {
        if (!menuRef.current.contains(e.target)) {
          setIsOpen({ flag: 0, is: false });
        }
      }
    };

    document.addEventListener('click', checkIsOpen);
    return () => {
      document.removeEventListener('click', checkIsOpen);
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    customFetch.get('/users/logout');
  };

  return (
    <>
      <section
        className='avatar__image'
        onClick={() => {
          console.log('open');
          setIsOpen({ flag: 1, is: !isOpen.is });
        }}
      >
        <img src={avatar} alt='avatar-profile' />
      </section>

      <section
        className={`avatar__menu ${isOpen.is && 'active'}`}
        ref={menuRef}
      >
        <section className='avatar__email'>
          <p>Đăng nhập với</p>
          <p>{email}</p>
        </section>
        <hr />
        <section className='avatar__link'>
          <Link to=''>Thông tin người dùng</Link>
          <Link to=''>Sự kiện đã mua</Link>
        </section>
        <hr />
        <section className='avatar__logout'>
          <p onClick={handleLogout}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-logout-2'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
              <path d='M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2'></path>
              <path d='M15 12h-12l3 -3'></path>
              <path d='M6 15l-3 -3'></path>
            </svg>
            Đăng xuất
          </p>
        </section>
      </section>
    </>
  );
};
export default AvatarComponent;
