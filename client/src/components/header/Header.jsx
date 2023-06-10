import './Header.css';
import { Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [scrollTop, setScrollTop] = useState(0);
  const [isHideHeader, setIsHideHeader] = useState(false);

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

  return (
    <header
      className={`${location.pathname === '/login-register' ? 'active' : ''} ${
        isHideHeader ? 'hide-header' : ''
      }`}
    >
      <div className="wrapper">
        <div className="header__left-block">
          <Link className="logo" to="/" alt="">
            <img src={'./images/logo.png'} />
          </Link>
          <div
            className={`header__search ${
              location.pathname === '/create-event' ? 'active' : ''
            }`}
          >
            <Input width="290px" placeholder="Search" />
          </div>
          <div className="header__category">
            <div class="dropdown">
              <Link href="/" alt="">
                <div class="dropdown__catergory">Sự kiện</div>
              </Link>
              <div class="dropdown__content">
                <Link href="/">
                  <div className="category__item">Link 1</div>
                </Link>
                <Link href="/">
                  <div className="category__item">Link 2</div>
                </Link>
                <Link href="/">
                  <div className="category__item">Link 3</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="header__right-block">
          <div
            className={`create__event ${
              location.pathname === '/create-event' ? 'active' : ''
            }`}
          >
            <Link to="/create-event" alt="">
              <div className="header_btn header__btn-create">Tạo sự kiện</div>
            </Link>
          </div>
          <div className="header__log">
            <Link to="/login-register" className="header_btn" alt="">
              Đăng nhập | Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
