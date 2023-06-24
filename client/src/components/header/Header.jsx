import './Header.css';
import { Input, Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import AvatarComponent from '../avatar/AvatarComponent';
import { getUserInfo } from '../../features/user/userSlice';
import { AiFillCaretDown } from 'react-icons/ai';

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
            <img src={'../images/logo.png'} />
          </Link>
          <div
            className={`header__search ${
              location.pathname === '/event-create-update' ? 'active' : ''
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
              <div className='dropdown__catergory'>
                Sự kiện
                <AiFillCaretDown className='cardEvent-info2-item-icon' />
              </div>
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
          {userInfo?._id ? (
            <div
              className={`create__event ${
                location.pathname === '/event-create-update' ? 'active' : ''
              }`}
            >
              <Link to='/event-create-update' alt=''>
                <Button color='primary' size='sm'>
                  Tạo sự kiện
                </Button>
              </Link>
            </div>
          ) : null}

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
