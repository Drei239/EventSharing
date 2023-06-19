import React, { useState, useEffect } from 'react';
import './EventDetails.css';
import Comments from '../../components/comments/Comments';
import Discussions from '../../components/discussions/Discussions';
import dayjs from "dayjs";
import { Carousel } from 'react-carousel-minimal';
import { Button, Tooltip } from "@nextui-org/react";
import { BiMap } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiSandsOfTime, } from "react-icons/gi";
import { FaListAlt } from "react-icons/fa"
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById, updateEvent } from "../../features/events/eventSlice";
import { getAllCategory } from "../../features/category/categorySlice";
import { getUserInfo } from "../../features/user/userSlice";

const EventDetails = ({ rules }) => {
	const [commentsTabs, setCommentsTabs] = useState("comments");
	const [eventStatus, setEventStatus] = useState("Sắp diễn ra");
	const { id } = useParams();
	const dispatch = useDispatch();
	const eventDetail = useSelector(state => state.event.events[0] || null);
	const allCategories = useSelector(state => state.category.categories || null);
	const getUsers = useSelector(state => state.user || null);	
	const userRule = getUserRule();
	const isOnline = isOnlineEvent();

	useEffect(() => { dispatch(getEventById(id)) }, []);
	useEffect(() => { dispatch(getAllCategory()) }, []);
	useEffect(() => { dispatch(getUserInfo()) }, []);
	console.log(getUsers);

	const category = allCategories?.find(category => category?._id === eventDetail?.category);
	
	if (category == null) {
		return false;
	}; 

	const imageList = eventDetail?.imageList.map((item) => ({ image: item }));

	if (imageList == undefined) {
		return false;
	}; 

	function getUserRule() {
		let isAdmin = true;
		return isAdmin ? rules.ADMIN : rules.USER 
	}

	function isOnlineEvent() {
		return eventDetail?.isOnline ? "Online" : "Offline";
	}

	function handleSelectChange(event) {
		setEventStatus(event.target.value);
		dispatch(
			updateEvent({
				...eventDetail, eventStatus: event.target.value
			})
		);
		console.log(eventDetail);
	}
	
	const captionStyle = {
		fontSize: '2em',
		fontWeight: 'bold',
	}
	const slideNumberStyle = {
		fontSize: '20px',
		fontWeight: 'bold',
	}
	
	return (
		<div className='wrapper'>
			<img src={eventDetail?.banner || 'no information'} alt="" className="event__banner" loading="lazy" />
			<div className='info__container'>
				<div className='event__left-block'>
					<a href='/' className='organizers'>
						<h3 className='organizers__title'>Nhà tổ chức</h3>
						<div className='organizers__image'><img src="https://images3.alphacoders.com/654/654249.png" alt="" /></div>
						<h5>{eventDetail?.name || 'no information'}</h5>
					</a>
					<div className='event__info'>
						<h3 className='info__title'>Thông tin sự kiện</h3>
						<div className='event__name'><h4>{eventDetail?.title || 'no information'}</h4></div>
						<Tooltip content={"Developers love Next.js"}>
						<Button className='event__category' size="xs" color="primary" auto ghost>{category?.categoryName || 'no information'}</Button>
						</Tooltip>
						<div className='event__adress'>
							<BiMap className="cardEvent-info2-item-icon" />
							{eventDetail?.location || 'no information'}
						</div>
						<div className='event__time'>
							<GiSandsOfTime className="cardEvent-info2-item-icon" />
							{dayjs(eventDetail?.timeBegin).format("DD/MM/YYYY")} - {" "}
							{dayjs(eventDetail?.timeEnd).format("DD/MM/YYYY")} {" "}
							({dayjs(eventDetail?.timeBegin).format("HH:mm:ss")} - {" "}
							{dayjs(eventDetail?.timeEnd).format("HH:mm:ss")})
						</div>
						<div className='event__type'>{isOnline}</div>
					</div>					
				</div>
				<div className='event__right-block'>
					<Button size="lg" className='btn__buy' color="primary" bordered='false'>mua vé</Button>
					<div className='event__share'>
						<Button bordered color="primary" size="xs"><div className='btn__share'>Chia sẻ</div></Button>
						<Button bordered color="primary" size="xs"><div className='btn__share'>Chia sẻ</div></Button>
					</div>
					<div className='event__price'>
						<MdOutlineAttachMoney className="carousel-content-info-icon" />
						{eventDetail?.fee === 0 ? "Free" : eventDetail?.fee + "$" || 'no information'}
					</div>
					<div className='event__members'>
						<button className='members__list'><FaListAlt className="carousel-content-info-icon" /></button>
						So nguoi tham gia
					</div>
					{userRule === rules.ADMIN && <div className='event__status'>
						<select className="change__status" onChange={handleSelectChange}>
							<option value="Sắp diễn ra">Sắp diễn ra</option>
							<option value="Đang diễn ra">Đang diễn ra</option>
							<option value="Đã hoàn tất">Đã hoàn tất</option>
							<option value="Sự kiện đã hủy" className="event__fall">Sự kiện đã hủy</option>
						</select>
					</div>}
					{userRule === rules.USER && <div className='event__status'>event user</div>}
				</div>
				<div className="event__title">
					<h3 className='event__description'>Giới thiệu</h3>
					<p className='description__item'>{eventDetail?.description || 'no information'}</p>
				</div>
			</div>
			<div style={{
				padding: "5px 20px",
				marginBottom: "120px"
			}}>
				<Carousel
					data={imageList}
					time={5000}
					width="100%"
					height="500px"
					captionStyle={captionStyle}
					radius="10px"
					slideNumber={true}
					slideNumberStyle={slideNumberStyle}
					automatic={true}
					dots={true}
					pauseIconColor="white"
					pauseIconSize="40px"
					slideBackgroundColor="darkgrey"
					slideImageFit="cover"
					thumbnails={true}
					thumbnailWidth="100px"
					style={{
						alignItems: "center",
						textAlign: "center",
						maxWidth: "100%",
						maxHeight: "500px",
					}}
				/>
			</div>
			<div className='comment__container'>
				<Button.Group>
					<Button className='comments__btn' onPress={() => setCommentsTabs("comments")}>Comments</Button>
					<Button className='comments__btn' onPress={() => setCommentsTabs("discussion")}>Discussions</Button>
				</Button.Group>
				{
					commentsTabs === "comments" ? <Comments /> : <Discussions />
				}
			</div>
		</div>
	);
};

export default EventDetails;