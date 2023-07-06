import React, { useEffect, useState } from 'react';
import { Modal, useModal, Text, Link, Button } from '@nextui-org/react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderbyId } from "../../features/order/orderSlice";
import { LuFileSymlink } from "react-icons/lu";
import './eventModal.css';

const EventModal = () => {

	const { orders } = useSelector((state) => state.order);
	const { setVisible, bindings } = useModal();
	const { id } = useParams();
	const { userInfo } = useSelector((state) => state.user);
	const eventDetail = useSelector((state) => state?.event?.getEventById);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrderbyId({ id, status: "all" }));
	}, []);
	const [message, setMessage] = useState('');
	useEffect(() => {
		const now = new Date();
		const beginTime = new Date(eventDetail?.timeBegin);
		const endTime = new Date(eventDetail?.timeEnd);
		console.log("###", endTime);

		if (now >= beginTime && now <= endTime && userStatusArr.isJoined == true) {
			setMessage('đã tham gia');
		} else if(now <= beginTime && userStatusArr.isPaid == true) {
			setMessage('Không tham gia');
		} else if (now >= beginTime && userStatusArr.isJoined == false) {
			setMessage('Sẽ tham gia');
		} else {
			setMessage('');
		}}, []);

	let userStatusArr = orders?.map(order => [
		order?.isPaid,
		order?.isJoined,
		// order?.isRefund
	]);
	let userStatus = (userStatusArr == true ? "Đã tham gia" : "Sẽ tham gia");

	// if (userStatusArr.orders?.isPaid == true) {
	// 	userStatus = 'sắp tham gia';
	// } else if (userStatusArr.orders?.isJoined == true) {
	// 	userStatus = 'đã tham gia';
	// } else if (userStatusArr.orders?.isRefund == true) {
	// 	userStatus = 'đã hoàn tiền';
	// }



	console.log(userStatusArr)

	return (
		<div>
			<button className='members__list' onClick={() => setVisible(true)}>
				Xem danh sách <LuFileSymlink />
			</button>

			<Modal
				scroll
				width="600px"
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				{...bindings}
			>
				<Modal.Header>
					<Text id="modal-title" size={24}>
						Danh sách người tham gia
					</Text>
				</Modal.Header>
				{
					userInfo._id === eventDetail?.creator?._id ?
						<Link
							href={`/my-event/${eventDetail?._id}`}
							className='participants__change-link'>
							<Button size="xs">Cập nhật</Button>
						</Link> : ""
				}
				<div className="participants__container">
					{
						orders?.map((item) => (
							<Link>
								<div className="participants">
									<div className="user__info">
										<img className="user__avatar" src={item?.user?.avatar} alt="" />
										<div className="user__name">
											{item?.user?.name}
											<div className="user__status">{message}</div>
										</div>
									</div>
									
								</div>
							</Link>
						))}
				</div>
			</Modal>
		</div>
	);
};

export default EventModal;