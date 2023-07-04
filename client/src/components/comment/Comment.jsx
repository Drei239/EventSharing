import "./Comment.css";
import CommentForm from "../comment-form/CommentForm";
import { useSelector } from 'react-redux';

const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {
	const isEditing =
		activeComment &&
		activeComment.id == comment._id &&
		activeComment.type == "editing";
	const isReplying =
		activeComment &&
		activeComment.id == comment._id &&
		activeComment.type == "replying";
	const { userInfo } = useSelector((state) => state.user);
	const canDelete = userInfo._id == comment.creator._id;
	const canReply = Boolean(currentUserId);
	const canEdit = userInfo._id == comment.creator._id;
	const replyId = comment._id;
	const createdAt = new Date(comment.createdAt).toLocaleDateString();

	return (
		<div key={comment.id} className="comment">
			<div className="comment-image-container">
				<img src={comment.creator.avatar} />
			</div>
			<div className="comment-right-part">
				<div className="comment-content">
					<div className="comment-author">{comment.creator.name}</div>
					{/* <div>{createdAt}</div> */}
				</div>
				{!isEditing && <div className="comment-text">{comment.comment}</div>}
				{isEditing && (
					<CommentForm
						submitLabel="Update"
						hasCancelButton
						initialText={comment.body}
						handleSubmit={(text) => updateComment(text, comment._id)}
						handleCancel={() => {
							setActiveComment(null);
						}}
					/>
				)}
				<div className="comment-actions">
					{!canReply && (
						<div
							className="comment-action"
							onClick={() =>
								setActiveComment({ id: comment._id, type: "replying" })
							}
						>
							Reply
						</div>
					)}
					{canEdit && (
						<div
							className="comment-action"
							onClick={() =>
								setActiveComment({ id: comment._id, type: "editing" })
							}
						>
							Edit
						</div>
					)}
					{canDelete && (						
						<div
							className="comment-action"
							onClick={() => deleteComment(comment._id)
						}
						>
							Delete
						</div>
					)}
				</div>
				{isReplying && (
					<CommentForm
						submitLabel="Reply"
						handleSubmit={(text) => addComment(text, comment._id)}
					/>
				)}
        {comment?.reply > 0 && (
					<div className="replies">
						{comment?.reply?.map((reply) => {
              console.log(reply)
              return (
              <Comment
                comment={reply}
                key={reply._id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment._id}
                replies={[]}
                currentUserId={currentUserId}
              />)
							
						})}

					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
