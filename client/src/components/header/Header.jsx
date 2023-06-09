import './Header.css';
import { Input } from '@nextui-org/react';
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      navigate(`/events?search=${e.target.value}`, { search: e.target.value });
    }
  };
  return (
    <div className="wrapper">
      <header
        className={location.pathname === '/login-register' ? 'active' : ''}
      >
        <div className="header__left-block">
          <Link className="logo" to="/" alt="">
            <img src={'./images/logo.png'} />
          </Link>
          <div className="header__search">
            <Input
              width="290px"
              placeholder="Search"
              onKeyDown={handleSubmit}
            />
          </div>
          <div className="header__category">
            <div className="dropdown">
              <Link href="/" alt="">
                <div className="dropdown__catergory">Sự kiện</div>
              </Link>
              <div className="dropdown__content">
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
          <div className="create__event">
            <Link to="/create-event" alt="">
              <div className="header_btn header__btn-create">Tạo sự kiện</div>
            </Link>
            <img src="" alt="" />
          </div>
          <div className="header__log">
            <Link to="/login-register" alt="">
              <div className="header_btn">Đăng nhập | Đăng ký</div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
