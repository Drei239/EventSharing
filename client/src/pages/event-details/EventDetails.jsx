import React, { useState, useEffect } from 'react';
import './EventDetails.css';
import Comments from '../../components/comments/Comments';
import Discussions from '../../components/discussions/Discussions';
import EventModal from '../../components/ui/eventModal';
import Gallery from '../../components/gallery/Gallery';
import dayjs from "dayjs";
import { Button, Tooltip, Link } from "@nextui-org/react";
import { BiMap } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiSandsOfTime, } from "react-icons/gi";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from "../../features/events/eventSlice";
import { getAllCategory } from "../../features/category/categorySlice";


const EventDetails = () => {
	const [commentsTabs, setCommentsTabs] = useState("comments");
	const { id } = useParams();
	const dispatch = useDispatch();
	const eventDetail = useSelector(state => state.event.events[0] || null);
	const allCategories = useSelector(state => state.category.categories || null);

	const isOnline = isOnlineEvent();

	useEffect(() => { dispatch(getEventById(id)) }, []);
	useEffect(() => { dispatch(getAllCategory()) }, []);

	const category = allCategories?.find(category => category?._id === eventDetail?.category);

	if (category == null) {
		return false;
	};

	const imageList = eventDetail?.imageList;

	if (imageList == undefined) {
		return false;
	};

	function isOnlineEvent() {
		return eventDetail?.isOnline ? "Online" : "Offline";
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
		<div>
			<img src={eventDetail?.banner || 'no information'} alt="" className="event__banner" loading="lazy" />
			<div className='wrapper'>
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
							<Link href='/'>
								<Tooltip content={category?.categoryDescription}>
									<Button className='event__category' size="xs" color="primary" auto ghost>{category?.categoryName || 'no information'}</Button>
								</Tooltip>
							</Link>
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
						<div className='event__status'>
							"{eventDetail?.status || 'no information'}"
						</div>
						<div className='event__members'>
							<EventModal />
						</div>
					</div>
					<div className="event__title">
						<h3 className='event__description'>Giới thiệu</h3>
						<p className='description__item'>{eventDetail?.description || 'no information'}</p>
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sed laboriosam non, enim, aspernatur dolorum vitae libero iste voluptate deserunt neque magnam exercitationem quam, itaque unde fugiat placeat illo? Rerum?
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sed laboriosam non, enim, aspernatur dolorum vitae libero iste voluptate deserunt neque magnam exercitationem quam, itaque unde fugiat placeat illo? Rerum?
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sed laboriosam non, enim, aspernatur dolorum vitae libero iste voluptate deserunt neque magnam exercitationem quam, itaque unde fugiat placeat illo? Rerum?
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sed laboriosam non, enim, aspernatur dolorum vitae libero iste voluptate deserunt neque magnam exercitationem quam, itaque unde fugiat placeat illo? Rerum?
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sed laboriosam non, enim, aspernatur dolorum vitae libero iste voluptate deserunt neque magnam exercitationem quam, itaque unde fugiat placeat illo? Rerum?
					</div>
				</div>
				<div className="gallery__container">
					<h3 className="event__gallery">
						Gallery
					</h3>
					<Gallery imageList={imageList} />
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
		</div>
	);
};

export default EventDetails;