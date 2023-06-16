import './Header.css';
import { Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AvatarComponent from '../avatar/AvatarComponent';
import { getUserInfo } from '../../features/user/userSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.categories);
  const { isLogin, userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  const [scrollTop, setScrollTop] = useState(0);
  const [isHideHeader, setIsHideHeader] = useState(false);

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollTop) {
        setIsHideHeader(true);
      } else {
        setIsHideHeader(false);
      }
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTop]);
  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      navigate(`/events?search=${e.target.value}`, {
        search: e.target.value,
      });
    }
  };
  return (
    <header
      className={`${location.pathname === '/login-register' ? 'active' : ''} ${
        isHideHeader ? 'hide-header' : ''
      }`}
    >
      <div className='wrapper'>
        <div className='header__left-block'>
          <Link className='logo' to='/' alt=''>
            <img src={'./images/logo.png'} />
          </Link>
          <div
            className={`header__search ${
              location.pathname === '/create-event' ? 'active' : ''
            }`}
          >
            <Input
              width='290px'
              placeholder='Search'
              onKeyDown={handleSubmit}
            />
          </div>
          <div className='header__category'>
            <div className='dropdown'>
              <Link href='/' alt=''>
                <div className='dropdown__catergory'>Sự kiện</div>
              </Link>
              <div className='dropdown__content'>
                {category?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      onClick={() =>
                        navigate(`/events?category=${item.categoryName}`)
                      }
                      className='category__item'
                    >
                      {item.categoryName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='header__right-block'>
          <div
            className={`create__event ${
              location.pathname === '/create-event' ? 'active' : ''
            }`}
          >
            <Link to='/create-event' alt=''>
              <div className='header_btn header__btn-create'>Tạo sự kiện</div>
            </Link>
          </div>
          <div className='header__log'>
            {isLogin ? (
              <AvatarComponent {...userInfo}></AvatarComponent>
            ) : (
              <Link to='/login-register' className='header_btn' alt=''>
                Đăng nhập | Đăng ký
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
