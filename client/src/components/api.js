export const getComments = async () => {
	return [
		{
			id: "1",
			body: "First comment",
			username: "Jack",
			userId: "1",
			parentId: null,

		},
		{
			id: "2",
			body: "Second comment",
			username: "John",
			userId: "2",
			parentId: null,

		},
		{
			id: "3",
			body: "First comment first child",
			username: "John",
			userId: "2",
			parentId: "1",

		},
		{
			id: "4",
			body: "Second comment second child",
			username: "John",
			userId: "2",
			parentId: "2",

		},
	];
};

export const createComment = async (text, parentId = null) => {
	return {
		id: Math.random().toString(36).substr(2, 9),
		body: text,
		parentId,
		userId: "1",
		username: "Anh",
		createdAt: new Date().toISOString(),
	};
};

export const updateComment = async (text) => {
	return { text };
};

export const deleteComment = async () => {
	return {};
};



// [
// 	{
// 		"commentId": "string",
// 		"comment": "text",
// 	    "event": "string"
//      "createdAt": "string"
// 		"creator": {
// 			"name": "name",
// 			"avatar": "link"
// 		},
// 		"date": "time",
// 		"reply": [
// 			{
// 				"commentId": "string",
// 				"comment": "text",
// 				"creator": {
// 					"name": "name",
// 					"avatar": "link"
// 				},
// 				"date": "time",
// 			},
// 		]
// 	},
// 	{
// 		"commentId": "string2",
// 		"text": "text2",
// 		"user": {},
// 		"date": "time2",
// 		"reply": [
// 			{
// 				"commentBody": "info5"
// 			},
// 			{
// 				"commentBody": "info6"
// 			},
// 			{
// 				"commentBody": "info7"
// 			},
// 			{
// 				"commentBody": "info8"
// 			}
// 		]
// 	},
// 	{
// 		"commentId": "string3",
// 		"text": "text3",
// 		"user": {},
// 		"date": "time3",
// 		"reply": [
// 			{
// 				"commentBody": "info9"
// 			},
// 			{
// 				"commentBody": "info10"
// 			},
// 			{
// 				"commentBody": "info11"
// 			},
// 			{
// 				"commentBody": "info12"
// 			}
// 		]
// 	}
// ]