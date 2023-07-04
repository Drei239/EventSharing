import { useState, useEffect } from "react";
import "./Comments.css";
import CommentForm from "../comment-form/CommentForm";
import Comment from "../comment/Comment";
import { useDispatch, useSelector } from "react-redux";
import {
	getCommentByEventId,
	createComment,
	updateComment,
	deleteComment,
	replyComment
} from "../../features/comment/commentSlice";
import {
	sendCommentToUserConnect,
	sendNotifyNewComment,
} from "../../features/action";

const Comments = ({ currentUserId, eventId }) => {
	const [activeComment, setActiveComment] = useState(null);
	const dispatch = useDispatch();
	const { comments, isSuccessCreate } = useSelector((state) => state.comment);
	const { getEventById } = useSelector((state) => state.event);
	const { userInfo } = useSelector((state) => state.user);

	const addComment = (text, id) => {
		if (id) {
			dispatch(
				replyComment({
					id,
					title: "reply comment",
					comment: text,
				})
			)
		} else {
			dispatch(
				createComment({
					eventId,
					title: "comment-event",
					comment: text,
					userInfo
				})
			)
		}
	};

	const updateComments = (text, id) => {
		dispatch(
			updateComment({ id, title: "comment-event", comment: text, userInfo })
		);
	};

	const deleteComments = (id) => {
		dispatch(
			deleteComment({ id })
		)
	};

	useEffect(() => {
		dispatch(getCommentByEventId(eventId));
	}, []);

	useEffect(() => {
		if (isSuccessCreate) {
			dispatch(
				sendNotifyNewComment({
					notifyTo: getEventById?.creator._id,
					notifyFrom: userInfo,
					notifyType: "new-comment",
					commentId: comments[0],
					content: "đã bình luận trong sự kiện của bạn",
					isNew: true,
					createdAt: new Date(),
				})
			);
			dispatch(sendCommentToUserConnect(comments[0]));
		}
	}, [isSuccessCreate]);

	return (
		<div className="comments">
			<h4 className="comments-title">Comments</h4>
			<CommentForm submitLabel="Submit" handleSubmit={addComment} />
			<div className="comments-container">
				{comments.map((rootComment, root) => (
					<Comment
						key={root}
						comment={rootComment}
						activeComment={activeComment}
						setActiveComment={setActiveComment}
						addComment={addComment}
						deleteComment={deleteComments}
						updateComment={updateComments}
						replyComment={addComment}
						currentUserId={currentUserId}
					/>
				))}
			</div>
		</div>
	);
};

export default Comments;