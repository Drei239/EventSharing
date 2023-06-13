import React, { useState, useEffect } from 'react';
import './EventDetails.css';
import Comments from '../../components/comments/Comments';
import eventService from '../../features/events/eventService';
import eventSlice from '../../features/events/eventSlice';

import { Button, Dropdown } from "@nextui-org/react";
import { BsCalendar3WeekFill } from "react-icons/bs";
import { BiMap, BiMoney } from "react-icons/bi";
import { GiSandsOfTime } from "react-icons/gi";
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const EventDetails = ({ rules }) => {
	const [commentsTabs, setCommentsTabs] = useState("comments");
	const {id} = useParams()
	console.log(id);

const lol = eventService.getEventById(id);
console.log(lol); 

	const dispatch = useDispatch();
	const [event, setEvent] = useState([]);

	useEffect(() => {
		dispatch(eventSlice.getEventById(id))
	},event);
	console.log(event);

	function getUserRule() {
		let isAdmin = true;
		if (isAdmin) {
			return rules.ADMIN;
		};
		return rules.USER;
	};

	const userRule = getUserRule();

	const [selectedColor, setSelectedColor] = React.useState("default");
	const colors = [
		"default",
		"primary",
		"secondary",
		"success",
		"warning",
		"error",
	];
	
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
						<div className='event__name'>dada</div>
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
					{userRule === rules.ADMIN && <div className='event__status'>
						<Dropdown>
							<Dropdown.Button color={selectedColor} shadow>
								Status
							</Dropdown.Button>
							<Dropdown.Menu
								color={selectedColor}
								variant="shadow"
								aria-label="Actions"
							>
								<Dropdown.Item >Sắp diễn ra</Dropdown.Item>
								<Dropdown.Item >Đang diễn ra</Dropdown.Item>
								<Dropdown.Item >Đã hoàn tất</Dropdown.Item>
								<Dropdown.Item color="error" withDivider>
									Sự kiện đã hủy
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>}
					{userRule === rules.USER && <div className='event__status'>event user</div>}
					
				</div>
				<div className="event__title">
					<h3 className='event__description'>Giới thiệu</h3>
					<p className='description__item'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum architecto ullam, quisquam a praesentium aut, quas quia minima nam officiis quibusdam aliquam voluptate deserunt magnam nisi fugiat provident officia amet. Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident dolores suscipit harum perferendis ducimus facere cupiditate minima saepe blanditiis quam id, est debitis vel, doloribus cumque iste sit nisi obcaecati? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis similique nisi error doloremque laborum doloribus animi voluptate dolorum quas accusamus, autem dicta provident ullam totam rerum. Non quos laborum voluptate!</p>
				</div>
			</div>
			<div className='comment__container'>
				<Button.Group>
					<Button className='comments__btn' onPress={() => setCommentsTabs("comments")}>Comments</Button>
					<Button className='comments__btn' onPress={() => setCommentsTabs("discussion")}>Discussions</Button>
				</Button.Group>
				{ 
					commentsTabs === "comments" ? <Comments /> : <div>ok</div>
				}
				
			</div>
		</div>
	);
};

export default EventDetails;