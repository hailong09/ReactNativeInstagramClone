import { Action, ActionType } from "../actionsType";
import { UsersFollowState } from "../type";

const initialState: UsersFollowState = {
	feed: [],
};

export const postsReducer = (
	state: UsersFollowState = initialState,
	action: Action
): UsersFollowState => {
	const { type } = action;
	switch (type) {
		
		case ActionType.FETCH_FEED:
			return {
				feed: action.payload.sort(
					(p1, p2) => (p2.createdAt as any) - (p1.createdAt as any)
				),
			};

		case ActionType.LIKE_POST:
			const foundLikeIdx = state.feed.findIndex(
				(post) => post.id === action.payload.postId
			);

			const prevLikesCount = state.feed[foundLikeIdx].likesCount;
			const updateLikeCountPost = {
				...state.feed[foundLikeIdx],
				likesCount: [...prevLikesCount, action.payload.userLikeId],
			};

			return {
				feed: [
					...state.feed.slice(0, foundLikeIdx),
					updateLikeCountPost,
					...state.feed.slice(foundLikeIdx + 1),
				],
			};

		case ActionType.DISLIKE_POST:
			const feedAfterDislike = [...state.feed];
			const foundDislikePost = state.feed.findIndex(
				(post) => post.id === action.payload.postId
			);

			feedAfterDislike[foundDislikePost].likesCount = state.feed[
				foundDislikePost
			].likesCount.filter(
				(userLikeId) => userLikeId !== action.payload.userLikeId
			);
			return {
				feed: [...feedAfterDislike],
			};

		case ActionType.EDIT_USER_POST_IN_FEED:
			const postEditIndex = state.feed.findIndex(
				(p) => p.id === action.payload.id
			);
			const postEditUpdated = {
				...state.feed[postEditIndex],
				post: action.payload.post,
			};

			return {
				feed: [
					...state.feed.slice(0, postEditIndex),
					postEditUpdated,
					...state.feed.slice(postEditIndex + 1),
				],
			};

		case ActionType.DELETE_POST_IN_FEED:
			const updatedFeedAfterDel = state.feed.filter(
				(post) => post.id !== action.payload
			);
			return {
				...state,
				feed: updatedFeedAfterDel,
			};
		default:
			return state;
	}
};
