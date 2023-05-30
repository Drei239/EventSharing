import React from 'react';
import './Footer.css';

const Footer = () => {
	return (
		<>
			<footer>
				<div className="wrapper">
					<div className="footer__top">
						<div className="footer__contacts">
							<div className="footer__hotline_title">Hotline:</div>
							<div className="footer__phone">999-99-99-9999</div>
							<div className="footer__email">abc@gmail.com</div>
						</div>
						<div className="footer__info">
							<div className="footer__info_title">Adress:</div>
							<div className="footer__adress">99 California, Miami beach</div>
							<div className="footer__worktime"> Thứ 2 - Thứ 6 (8:30 - 18:30)</div>
						</div>
						<div className="footer__social">
							<div className="footer__links">								
								<a className='footer__link' href="https://www.facebook.com">
										<img src={"./images/facebook.png"} alt="" />
									</a>								
								<a className='footer__link' href="https://www.instagram.com">
										<img src={"./images/instagram.png"} alt="" />
									</a>								
								<a className='footer__link' href="https://www.youtube.com">
										<img className='link__youtube' src={"./images/youtube.png"} alt="" />
									</a>
							</div>
							<div className="copyright">
								Copyright &#169; 2023
							</div>
						</div>
					</div>
					
				</div>
			</footer>
		</>
	);
};

export default Footer;