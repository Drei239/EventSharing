import React from 'react';
import { Modal, useModal, Text, Link } from '@nextui-org/react';
import './eventModal.css';
// import { FaListAlt } from "react-icons/fa";

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
				<div className="participants__container">
						<Link>
							<div className="participants">
								<div className="user__info">
									<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
									<div className="user__name">name</div>
								</div>
								<div className="user__status">status</div>
							</div>
						</Link>
					<div>
						<Link>
							<div className="participants">
								<div className="user__info">
									<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
									<div className="user__name">name</div>
								</div>
								<div className="user__status">status</div>
							</div>
						</Link>
					</div>
					<div>
						<Link>
							<div className="participants">
								<div className="user__info">
									<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
									<div className="user__name">name</div>
								</div>
								<div className="user__status">status</div>
							</div>
						</Link>
					</div>
					<div>
						<Link>
							<div className="participants">
								<div className="user__info">
									<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
									<div className="user__name">name</div>
								</div>
								<div className="user__status">status</div>
							</div>
						</Link>
					</div>
					<div>
						<Link>
							<div className="participants">
								<div className="user__info">
									<img className="user__avatar" src="https://images3.alphacoders.com/654/654249.png" alt="" />
									<div className="user__name">name</div>
								</div>
								<div className="user__status">status</div>
							</div>
						</Link>
					</div>
					
				</div>
			</Modal>
		</div>
	);
};

export default EventModal;