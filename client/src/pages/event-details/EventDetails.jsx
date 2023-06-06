import React from 'react';
import './EventDetails.css';
import Comments from '../../components/comments/Comments';
// import Comments from './comments/Comments';
import { Button } from "@nextui-org/react";

const Product = () => {
	return (
		<div className='wrapper'>
			<div>
				
			</div>
			<div className='info__container'>			
				<div className='event__left-block'>
					<a href='/' className='organizers'>
						<h3 className='organizers__title'>Nhà tổ chức</h3>
						<div className='organizers__image'><img src="https://images3.alphacoders.com/654/654249.png" alt="" /></div>
					</a>
					<div className='event__info'>
						<h3 className='info__title'>Thông tin sự kiện</h3>
						<div className='event__name'>TEN SU KIEN</div>
						<div className='event__category'>Category</div>
						<div className='event__adress'>Dia chi event</div>
						<div className='event__type'>the loai event(onl/off)</div>
						<div className='event__time'>thoi gian</div>
					</div>
				</div>
				<div className='event__right-block'>
					<Button size="lg" className='btn__buy' color="primary" bordered='false'>mua vé</Button>
					<div className='event__share'>
						<Button bordered color="primary" size="xs" className='btn__share'>asdas</Button>
						<Button bordered color="primary" size="xs" className='btn__share' >dada</Button>
					</div>
					<div className='event__price'>Gia tien</div>
					<div className='event__members'>So nguoi tham gia<button className='members__list'></button></div>
					<div className='event__status'>event status</div>
				</div>
				<div className="event__title">
					<h3 className='event__description'>Giới thiệu</h3>
					<p className='description__item'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum architecto ullam, quisquam a praesentium aut, quas quia minima nam officiis quibusdam aliquam voluptate deserunt magnam nisi fugiat provident officia amet. Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident dolores suscipit harum perferendis ducimus facere cupiditate minima saepe blanditiis quam id, est debitis vel, doloribus cumque iste sit nisi obcaecati? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis similique nisi error doloremque laborum doloribus animi voluptate dolorum quas accusamus, autem dicta provident ullam totam rerum. Non quos laborum voluptate!</p>
				</div>
			</div>
			<div>
				<Comments/>
			</div>
		</div>
	);
};

export default Product;