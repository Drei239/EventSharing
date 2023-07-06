import { useState, useEffect } from "react";
import "./Comments.css";
// import DeleteCommentModal from './components/modals/DeleteComment';
import CommentForm from "../comment-form/CommentForm";
import Comment from "../comment/Comment";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommentByEventId,
  createComment,
  updateComment,
  deleteComment,
  replyComment,
  updateReplyComment,
  deleteReplyComment,
} from "../../features/comment/commentSlice";
import {
  sendCommentToUserConnect,
  sendNotifyNewComment,
  sendNotifyReplyComment,
  replyCommentShowAll,
} from "../../features/action";

const Comments = ({ currentUserId, eventId }) => {
  const [activeComment, setActiveComment] = useState(null);
  const dispatch = useDispatch();
  const { comments, isSuccessCreate, isSuccessReply, reply, replyContent } =
    useSelector((state) => state.comment);
  const { getEventById } = useSelector((state) => state.event);
  const { userInfo } = useSelector((state) => state.user);

  const addComment = (text, id) => {
    if (id) {
      dispatch(
        replyComment({
          id: id,
          title: "reply comment",
          comment: text,
        })
      );
    } else {
      dispatch(
        createComment({
          eventId,
          title: "comment-event",
          comment: text,
          userInfo,
        })
      );
    }
  };

  const updateComments = ({ comment, parentId, commentId }) => {
    if (!parentId) {
      dispatch(
        updateComment({ commentId, title: "comment-event", comment: comment })
      );
    } else {
      dispatch(
        updateReplyComment({
          commentId: parentId,
          replyId: commentId,
          title: "reply-comment",
          comment,
          userInfo,
        })
      );
    }
  };

  const deleteComments = ({ commentId, parentId }) => {
    if (!parentId) {
      dispatch(deleteComment({ id: commentId }));
    } else {
      dispatch(deleteReplyComment({ commentId: parentId, replyId: commentId }));
    }
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
  useEffect(() => {
    if (isSuccessReply) {
      console.log(reply);
      dispatch(
        sendNotifyReplyComment({
          notifyTo: reply?.creator?._id,
          notifyFrom: userInfo,
          notifyType: "reply-comment",
          commentId: reply?._id,
          replyContent: replyContent,
          content: "đã phản hồi bình luận của bạn",
          isNew: true,
          createdAt: new Date(),
        })
      );
      dispatch(replyCommentShowAll(reply));
    }
  }, [isSuccessReply]);
  useEffect(() => {
    console.log(comments);
  }, [comments]);
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
