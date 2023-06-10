import "./Header.css";
import { Input, Link } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const navigate = useNavigate();
  const category = useSelector((state) => state.category.categories);

  const location = useLocation();
  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      navigate(`/events?search=${e.target.value}`, {
        search: e.target.value,
      });
    }
  };

  return (
    <div className="wrapper">
      <header
        className={location.pathname === "/login-register" ? "active" : ""}
      >
        <div className="header__left-block">
          <Link className="logo" href="/" alt="">
            <img src={"./images/logo.png"} />
          </Link>
          <div className="header__search">
            <Input
              width="290px"
              placeholder="Search"
              onKeyDown={handleSubmit}
            />
          </div>
          <div className="header__category">
            <div class="dropdown">
              <Link href="/" alt="">
                <div class="dropdown__catergory">Sự kiện</div>
              </Link>
              <div class="dropdown__content">
                {category?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      onClick={() =>
                        navigate(`/events?category=${item.categoryName}`)
                      }
                      className="category__item"
                    >
                      {item.categoryName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="header__right-block">
          <div className="create__event">
            <Link href="/" alt="">
              <div className="header_btn header__btn-create">Tạo sự kiện</div>
            </Link>
            <img src="" alt="" />
          </div>
          <div className="header__log">
            <Link href="/login-register" alt="">
              <div className="header_btn">Đăng nhập | Đăng ký</div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
