import React, { useEffect } from 'react';
import { Modal, useModal, Text, Link } from '@nextui-org/react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderbyId } from "../../features/order/orderSlice";
import './eventModal.css';
// import { FaListAlt } from "react-icons/fa";

const EventModal = () => {

	const { orders } = useSelector((state) => state.order);
	const { setVisible, bindings } = useModal();
	const { id } = useParams();
	// const { userInfo } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrderbyId({ id, status: "all" }));
	}, []);
	// const a = orders.filter((order) => userInfo._id === order.event.creator)
	// console.log("###", userInfo._id);
	// console.log("####", a);

	return (
		<div>
			<button className='members__list' onClick={() => setVisible(true)}>
				So nguoi tham gia: {orders?.length}
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
				<div className="participants__container">
					{
					// userInfo._id === orders?.creator ?
					// 	<div>dsadsad</div> :
						orders?.map((item) => (
							<Link>
								<div className="participants">
									<div className="user__info">
										<img className="user__avatar" src={item?.user?.avatar} alt="" />
										<div className="user__name">
											{item?.user?.name}
										</div>
									</div>
									<div className="user__status">{item?.isJoined}</div>
								</div>
							</Link>
						))}
				</div>
			</Modal>
		</div>
	);
};

export default EventModal;