import React from 'react';
import './Header.css';
import { Input } from '@nextui-org/react';

const Header = () => {
	return (
		<>
			<header>
				<div className="header__left-block">
					<a className="logo" href='' alt=''>
						<img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/DICE_%28Ticketing_Company%29_logo.svg/1200px-DICE_%28Ticketing_Company%29_logo.svg.png" alt="" />
					</a>
					<div className="header__search">
						<Input placeholder="Search" />
					</div>
					<div className="header__category">
						<div class="dropdown">
							<a class="dropdown__catergory" href='' alt=''>Sự kiện</a>
							<div class="dropdown__content">
								<a href="#">Link 1</a>
								<a href="#">Link 2</a>
								<a href="#">Link 3</a>
							</div>
						</div>
					</div>					
				</div>
				<div className="header__right-block">
					<div className="create__event">
						<a className="header_btn" href='' alt=''>Tạo sự kiện</a>
						<img src="" alt="" />
					</div>
					<div className='header__log'>
						<a className="header_btn" href='' alt=''>Đăng ký</a>|
						<a className="header_btn" href='' alt=''>Đăng nhập</a>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;