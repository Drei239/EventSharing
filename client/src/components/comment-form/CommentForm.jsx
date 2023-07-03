import { useState } from "react";
import './CommentForm.css';
import { Button } from '@nextui-org/react';
import { createComment } from '../../features/comment/commentSlice';
import { useDispatch, useSelector } from "react-redux";

const CommentForm = ({
	handleSubmit,
	submitLabel,
	title,
	hasCancelButton = false,
	handleCancel,
	initialText = "",
}) => {
	const [text, setText] = useState(initialText);
	const isTextareaDisabled = text.length === 0;
	const onSubmit = (event) => {
		event.preventDefault();
		handleSubmit(text);
		setText("");
	};

	return (
		<form onSubmit={onSubmit}>
			<textarea
				className="comment-form-textarea"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button className="comment-form-button" disabled={isTextareaDisabled}>
				{submitLabel}
			</button>
			{hasCancelButton && (
				<button
					type="button"
					className="comment-form-button comment-form-cancel-button"
					onClick={handleCancel}
				>
					Cancel
				</button>
			)}
		</form>
	);
};

export default CommentForm;