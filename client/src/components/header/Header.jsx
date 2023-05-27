import React from 'react';
import './Header.css';
import { Input, Link } from '@nextui-org/react';

const Header = () => {
	return (
		<div className='wrapper'>
			<header>
					<div className="header__left-block">
						<Link className="logo" href='/' alt=''>
							<img src={"./images/logo.png"} />
						</Link>
						<div className="header__search">
							<Input width='290px' placeholder="Search" />
						</div>
						<div className="header__category">
							<div class="dropdown">
								<Link class="dropdown__catergory" href='/' alt=''>Sự kiện</Link>
							<div class="dropdown__content">
									<a href='/'>Link 1</a>
									<a href='/'>Link 2</a>
									<a href='/'>Link 3</a>
								</div>
							</div>
						</div>
					</div>
					<div className="header__right-block">
						<div className="create__event">
							<a className="header_btn header__btn-create" href='/' alt=''>Tạo sự kiện</a>
							<img src="" alt="" />
						</div>
						<div className='header__log'>
							<a className="header_btn" href='/' alt=''>Đăng ký</a>|
							<a className="header_btn" href='/' alt=''>Đăng nhập</a>
						</div>
					</div>
			</header>
		</div>
	);
};

export default Header;