import React from 'react';
import './Header.css';
import { Input } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="wrapper">
      <header>
        <div className="header__left-block">
          <a className="logo" href="" alt="">
            <img src={'./images/logo.png'} />
          </a>
          <div className="header__search">
            <Input width="275px" placeholder="Search" />
          </div>
          <div className="header__category">
            <div className="dropdown">
              <a className="dropdown__catergory" href="" alt="">
                Sự kiện
              </a>
              <div className="dropdown__content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </div>
          </div>
        </div>
        <div className="header__right-block">
          <div className="create__event">
            <Link className="header_btn header__btn-create" to="/create-event">
              Tạo sự kiện
            </Link>
            <img src="" alt="" />
          </div>
          <div className="header__log">
            <a
              className="header_btn"
              href="http://localhost:3001/login-register"
            >
              Đăng nhập | Đăng ký
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
