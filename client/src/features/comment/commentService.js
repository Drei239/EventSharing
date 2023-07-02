import { base_url } from "../../utils/base_url";
import UseCallApi from '../../hooks/useCallApi';

const createNewComment = async (eventId) => {
	const newComment = await UseCallApi({
		method: "POST",
		url: "/comments/create",
		data: { event: eventId.toString() },
	});
	return newComment;
};

const getCommentByEventId = async (eventId) => {
	const data = await UseCallApi({
		method: 'GET',
		url: `/comments/create/event/${eventId}`,
	});
	return data;
};

const CommentService = {
	getCommentByEventId,
	createNewComment,
}

export default CommentService;
