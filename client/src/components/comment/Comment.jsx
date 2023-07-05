import "./Comment.css";
import CommentForm from "../comment-form/CommentForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { likeOrUnlikeComment } from "../../features/comment/commentSlice";
const Comment = ({
  comment,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  currentUserId,
  isReply,
  parentId,
}) => {
  const dispatch = useDispatch();
  const isEditing =
    activeComment &&
    activeComment.id == comment._id &&
    activeComment.type == "editing";
  const isReplying =
    activeComment &&
    activeComment.id == comment._id &&
    activeComment.type == "replying";
  const { userInfo } = useSelector((state) => state.user);
  const canDelete = userInfo?._id == comment?.creator?._id;
  const canReply = Boolean(currentUserId);
  const canEdit = userInfo?._id == comment?.creator?._id;
  const handleLikeComment = ({ commentId, replyId }) => {
    dispatch(
      likeOrUnlikeComment({ commentId, replyId, userInfo: userInfo._id })
    );
  };
  const checkIsLikeUser =
    userInfo && comment?.likeList.find((list) => list.user === userInfo._id);
  return (
    <div key={comment?._id} className="comment">
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
            handleSubmit={(text) =>
              updateComment({
                comment: text,
                commentId: comment._id,
                parentId: isReply ? parentId : null,
              })
            }
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="comment-actions">
          <div
            className="comment-action comment-unLike"
            onClick={() =>
              handleLikeComment({
                replyId: isReply ? comment._id : null,
                commentId: isReply ? parentId : comment._id,
              })
            }
          >
            {checkIsLikeUser ? (
              <AiFillLike color="#00abe1" />
            ) : (
              <AiOutlineLike />
            )}

            <span>{comment?.likeCount > 0 && comment.likeCount}</span>
          </div>
          {!canReply && !isReply && (
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
              onClick={() =>
                deleteComment({
                  commentId: comment._id,
                  parentId: isReply ? parentId : null,
                })
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
        {comment.reply && comment?.reply?.length > 0 && (
          <div className="replies">
            {comment?.reply?.map((reply) => {
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
                  isReply={true}
                  currentUserId={currentUserId}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
