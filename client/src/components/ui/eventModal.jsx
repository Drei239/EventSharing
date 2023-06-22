import React from 'react';
import { Modal, useModal, Text, Link } from '@nextui-org/react';
import { FaListAlt } from "react-icons/fa";

const EventModal = () => {
	const { setVisible, bindings } = useModal();
	return (
		<div>
			<button className='members__list' onClick={() => setVisible(true)}>
				So nguoi tham gia
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
				<Modal.Body>
					<Link>
						<div className="participants">
							<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
							<div className="user__info">
								<div className="user__name">name</div>
								<div className="user__status">status</div>
							</div>
						</div>
					</Link>
					<Link>
						<div className="participants">
							<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
							<div className="user__info">
								<div className="user__name">name</div>
								<div className="user__status">status</div>
							</div>
						</div>
					</Link>
					<Link>
						<div className="participants">
							<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
							<div className="user__info">
								<div className="user__name">name</div>
								<div className="user__status">status</div>
							</div>
						</div>
					</Link>
					<Link>
						<div className="participants">
							<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
							<div className="user__info">
								<div className="user__name">name</div>
								<div className="user__status">status</div>
							</div>
						</div>
					</Link>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default EventModal;