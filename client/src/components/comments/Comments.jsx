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
} from "../../features/comment/commentSlice";
import {
  sendCommentToUserConnect,
  sendNotifyNewComment,
} from "../../features/action";

const Comments = ({ currentUserId, eventId }) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const dispatch = useDispatch();
  const { comments, isSuccessCreate } = useSelector((state) => state.comment);
  const { getEventById } = useSelector((state) => state.event);
  const { userInfo } = useSelector((state) => state.user);
  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const addComment = (text) => {
    console.log("a");
    dispatch(
      createComment({
        eventId,
        title: "comment-event",
        comment: text,
        userInfo,
      })
    );
  };

  const updateComments = (text, id) => {
    console.log(text, id);
    dispatch(
      updateComment({ id, title: "comment-event", comment: text, userInfo })
    );
  };

  // const deleteComment = (commentId) => {
  // 	dispatch(
  // 		deleteComment({})
  // 	)
  // };

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
        {comments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComments}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
