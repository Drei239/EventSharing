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

const EventDetails = () => {
	const [commentsTabs, setCommentsTabs] = useState("comments");
	const { id } = useParams();
	const dispatch = useDispatch();
	const eventDetail = useSelector(state => state?.event?.getEventById[0]);

	const isOnline = isOnlineEvent();
	console.log("####", eventDetail?.imageList);

	useEffect(() => { dispatch(getEventById(id)) }, []);

	const imageList = eventDetail?.imageList?.map((item) => (item));

	console.log(imageList);
	const images = [
		'https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg',
		'https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg',
		'https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg',
	];
	if (imageList == undefined) {
		return false;
	};

	if (eventDetail == undefined) {
		return false;
	};

	function isOnlineEvent() {
		return eventDetail?.isOnline ? "Online" : "Offline";
	}

	return (
		<div>
			<img src={eventDetail?.banner || 'no information'} alt="" className="event__banner" loading="lazy" />
			<div className='wrapper'>
				<div className='info__container'>
					<div className='event__left-block'>
						<Link
							to={`/origanizers/${eventDetail?.creator?._id}`}
							className='organizers'
						>
							{/* <div className='organizers__container'> */}
								<h3 className='organizers__title'>Nhà tổ chức</h3>
								<div className='organizers__image'><img src={eventDetail?.creator?.avatar} alt="" /></div>
								<h5>{eventDetail?.creator?.name || 'no information'}</h5>
							{/* </div> */}
						</Link>
						<div className='event__info'>
							<h3 className='info__title'>Thông tin sự kiện</h3>
							<div className='event__name'><h4>{eventDetail?.title || 'no information'}</h4></div>
							<Link href='/'>
								<Tooltip content={eventDetail?.category?.categoryDescription}>
									<Button className='event__category' size="xs" color="primary" auto ghost>{eventDetail?.category?.categoryName || 'no information'}</Button>
								</Tooltip>
							</Link>
							<div className='event__adress'>
								<BiMap className="cardEvent-info2-item-icon" />
								{/* {eventDetail?.location || 'no information'} */}
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
						<p className='description__item'>{eventDetail?.description || 'no information'}
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita debitis, asperiores doloremque quisquam, eius quasi amet consequatur rem velit exercitationem aliquam quidem, eum omnis blanditiis tempore architecto totam optio quis!
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita debitis, asperiores doloremque quisquam, eius quasi amet consequatur rem velit exercitationem aliquam quidem, eum omnis blanditiis tempore architecto totam optio quis!
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita debitis, asperiores doloremque quisquam, eius quasi amet consequatur rem velit exercitationem aliquam quidem, eum omnis blanditiis tempore architecto totam optio quis!
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita debitis, asperiores doloremque quisquam, eius quasi amet consequatur rem velit exercitationem aliquam quidem, eum omnis blanditiis tempore architecto totam optio quis!
						</p>
					</div>
				</div>
				<div style={{
					padding: "5px 0",
				}}>
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
}
export default EventDetails;


// [
// 	{
// 		"_id": "6493c9140a35f9b2380c40bd",
// 		"title": "[Sài Gòn] Những Thành Phố Mơ Màng – Autumn 2023",
// 		"description": "Sài Gòn không có mùa thu nhưng tháng 9 này, Những Thành Phố Mơ Màng sẽ biến điều đó thành hiện thực. Cư dân Sài Gòn sẽ có cơ hội được trải nghiệm sự kiện âm nhạc với không khí mát mẻ cùng âm thanh và ánh sáng sống động !!!",
// 		"banner": "https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/06/19/30614B.jpg",
// 		"imageList": [
// 			"https://images.tkbcdn.com/1/780/300/Upload/eventcover/2023/06/19/30614B.jpg"
// 		],
// 		"category": {
// 			"_id": "648173ae0144d4be07f9194f",
// 			"categoryName": "Thể thao",
// 			"categoryDescription": "Event about sport activities.",
// 			"__v": 0
// 		},
// 		"isOnline": true,
// 		"fee": 699,
// 		"location": {
// 			"province": {
// 				"name": "Đồng Nai",
// 				"code": 75,
// 				"division_type": "tỉnh"
// 			},
// 			"district": {
// 				"name": "Thành Phố Long Khánh",
// 				"code": 26071,
// 				"division_type": "thành phố"
// 			},
// 			"ward": {
// 				"name": "Phường Bảo Vinh",
// 				"code": 26098,
// 				"division_type": "phường"
// 			},
// 			"address": "191/18/9/2 Tổ 6c Ấp Ruộng Hời ",
// 			"_id": "6493c9140a35f9b2380c40be"
// 		},
// 		"timeEndSignup": "2023-06-24T00:00:00.000Z",
// 		"timeBegin": "2023-06-28T00:00:00.000Z",
// 		"timeEnd": "2023-07-01T00:00:00.000Z",
// 		"status": "draft",
// 		"creator": {
// 			"_id": "649023b9158d957d37a76cd2",
// 			"name": "aeqwưeqqwsd",
// 			"avatar": "http://res.cloudinary.com/dz5rciyqg/image/upload/v1687531365/user/k4jjedlblsx8wdi2pw8m.jpg",
// 			"totalRating": 4.647058823529412
// 		},
// 		"limitUser": 30,
// 		"reviews": [],
// 		"eventRating": 0,
// 		"createdAt": "2023-06-22T04:07:48.571Z",
// 		"__v": 0
// 	}
// ]


// [
// 	{
// 		"_id": "64702a9b5396cbcee46d239b",
// 		"title": "Event02",
// 		"description": "Event 02 Description",
// 		"banner": "https://billetto.co.uk/blog/wp-content/uploads/2019/04/festival_1554307185-e1554307203469.jpg",
// 		"imageList": [
// 			"https://billetto.co.uk/blog/wp-content/uploads/2020/02/qmfsp1xyvtq-1024x680.jpg",
// 			"https://billetto.co.uk/blog/wp-content/uploads/2020/03/bee-balogun-KGyzk-EvTwQ-unsplash-768x512.jpg",
// 			"https://billetto.co.uk/blog/wp-content/uploads/2020/03/How-to-plan-concert-scanning-tickets-768x512.jpg"
// 		],
// 		"category": {
// 			"_id": "648173bd0144d4be07f91951",
// 			"categoryName": "Âm nhạc",
// 			"categoryDescription": "Event about music activities.",
// 			"__v": 0
// 		},
// 		"fee": 0,
// 		"timeEndSignup": "2023-06-08T17:30:00.000Z",
// 		"timeBegin": "2023-06-08T18:30:00.000Z",
// 		"timeEnd": "2023-06-09T03:00:00.000Z",
// 		"status": "Public",
// 		"creator": {
// 			"_id": "64945daf3f76532369faf225",
// 			"name": "Toan",
// 			"avatar": "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
// 			"totalRating": 0
// 		},
// 		"limitUser": 0,
// 		"reviews": [],
// 		"eventRating": 5,
// 		"createdAt": "2023-05-26T03:42:19.267Z",
// 		"__v": 0,
// 		"isOnline": false
// 	}
// ]