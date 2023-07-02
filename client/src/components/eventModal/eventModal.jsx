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
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getOrderbyId({ id, status: "all" }));
	}, []);

	console.log(orders);

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
					<Link>
						<div className="participants">
							<div className="user__info">
								<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
								<div className="user__name">
									{/* {orders?.map((item) => item.user.name)} */}
								</div>
							</div>
							<div className="user__status">status</div>
						</div>
					</Link>								
				</div>
			</Modal>
		</div>
	);
};

export default EventModal;