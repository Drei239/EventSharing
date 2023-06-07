import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

const DeleteCommentModal = (props) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const handleDeleteComment = () => {
		props.deleteCommentAction(props.commentId);
		setModalIsOpen(false);
	};

	return (
		<div>
			<button onClick={() => setModalIsOpen(true)}>Delete Comment</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				style={customStyles}
				contentLabel="Delete Comment"
			>
				<h1>Delete Comment</h1>
				<p>Are you sure you want to remove comment?</p>
				<button onClick={handleDeleteComment}>Yes</button>
				<button onClick={() => setModalIsOpen(false)}>No</button>
			</Modal>
		</div>
	);
};

export default DeleteCommentModal;
