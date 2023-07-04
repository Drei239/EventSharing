import { useState, useEffect } from "react";
import './Comments.css'
// import DeleteCommentModal from './components/modals/DeleteComment';
import CommentForm from "../comment-form/CommentForm";
import Comment from "../comment/Comment";
import { useDispatch, useSelector } from "react-redux";
import {
	getCommentByEventId,
	createComment,
	updateComment,
	deleteComment
} from '../../features/comment/commentSlice';

const Comments = ({ currentUserId, eventId }) => {
	const [backendComments, setBackendComments] = useState([]);
	const [activeComment, setActiveComment] = useState(null);
	const dispatch = useDispatch();
	const { comments } = useSelector(state => state.comment)

	const getReplies = (commentId) =>
		backendComments
			.filter((backendComment) => backendComment.parentId === commentId)
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);	

	const addComment = (text) => {
		dispatch(
			createComment({ eventId, title: "comment-event", comment: text })
		)
	};

	const updateComments = (text, id) => {
		console.log(id);
		dispatch(
			updateComment({ id, title: "comment-event", comment: text })
		)
	};

	const deleteComments = (id) => {
		dispatch(
			deleteComment({ id })
		)
	};

	useEffect(() => {
		dispatch(getCommentByEventId(eventId))
	}, []);

	return (
		<div className="comments">
			<h4 className="comments-title">Comments</h4>
			<CommentForm submitLabel="Submit" handleSubmit={addComment} />
			<div className="comments-container">
				{comments.map((rootComment) => (
					<Comment
						key={rootComment.id}
						comment={rootComment}
						replies={getReplies(rootComment.id)}
						activeComment={activeComment}
						setActiveComment={setActiveComment}
						addComment={addComment}
						deleteComment={deleteComments}
						updateComment={updateComments}
						currentUserId={currentUserId}
					/>
				))}
			</div>
		</div>
	);
};

export default Comments;