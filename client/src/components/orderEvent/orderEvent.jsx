import React, { useEffect } from 'react';
import { Button, Modal, Text } from '@nextui-org/react';
import { newCreateOrder } from "../../features/order/orderSlice";
import { sendNotifyNewOrder } from "../../features/action";
import { useDispatch, useSelector } from "react-redux";
import notify from '../../utils/notify';

const OrderEvent = () => {
	const [visible, setVisible] = React.useState(false);
	const { isSuccessCreate } = useSelector((state) => state.order);
	const dispatch = useDispatch();
	const eventDetail = useSelector(state => state?.event?.getEventById[0]);
	const { userInfo } = useSelector((state) => state.user);
	const handler = () => setVisible(true);

	const handleBuyTicket = () => {
		dispatch(newCreateOrder(eventDetail?._id));
	};

	useEffect(() => {
		if (isSuccessCreate) {
			notify("đăng ký kiện thành công", "success")
			dispatch(
				sendNotifyNewOrder({
					notifyTo: eventDetail.creator._id,
					notifyFrom: userInfo,
					eventId: eventDetail._id,
					notifyType: "new-order",
					content: "đã đăng kí sự kiện của bạn",
				})
			);
		}
	}, [isSuccessCreate]);

	const closeHandler = () => {
		setVisible(false);
		console.log("closed");
	};
	return (
		<div>
			<Button
				size="lg"
				className="btn__buy"
				color="primary"
				bordered="false"
				onPress={handler}
			>
				Mua vé
			</Button>
			<Modal
				closeButton
				aria-labelledby="modal-title"
				open={visible}
				onClose={closeHandler}
			>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						Xác nhận mua vé
					</Text>
				</Modal.Header>
				<Modal.Body>

					<Button auto flat color="primary" onClick={handleBuyTicket}>
						Mua vé
					</Button>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default OrderEvent;