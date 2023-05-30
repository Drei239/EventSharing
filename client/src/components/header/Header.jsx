import './Header.css';
import { Input, Link } from '@nextui-org/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {

	const location = useLocation()

	return (
		<div className='wrapper'>
			<header className={location.pathname ==="/login-register" ? "active" : ""}>
				<div className="header__left-block">
					<Link className="logo" href='/' alt=''>
						<img src={"./images/logo.png"} />
					</Link>
					<div className="header__search">
						<Input width='290px' placeholder="Search" />
					</div>
					<div className="header__category">
						<div class="dropdown">
							<Link href='/' alt=''><div class="dropdown__catergory">Sự kiện</div></Link>
							<div class="dropdown__content">
								<Link href='/'><div className='category__item'>Link 1</div></Link>
								<Link href='/'><div className='category__item'>Link 2</div></Link>
								<Link href='/'><div className='category__item'>Link 3</div></Link>
							</div>
						</div>
					</div>
				</div>
				<div className="header__right-block">
					<div className="create__event">
						<Link href='/' alt=''><div className="header_btn header__btn-create">Tạo sự kiện</div></Link>
						<img src="" alt="" />
					</div>
					<div className='header__log'>						
						<Link href='/login-register' alt=''><div className="header_btn">Đăng nhập | Đăng ký</div></Link>
					</div>
				</div>
			</header>
		</div>
	);
};

export default Header;