import { base_url } from "../../utils/base_url";
import UseCallApi from '../../hooks/useCallApi';

const getCommentByEventId = async (eventId) => {
	const data = await UseCallApi({
		method: 'GET',
		url: `/comments/create/event/${eventId}`,
	});
	return data;
};

const CommentService = {
	getCommentByEventId,
}

export default CommentService;