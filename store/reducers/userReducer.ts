import { Action, ActionType } from "../actionsType";
import { UserState } from "../type";

const initialState: UserState = {
	currentUser: null,
	posts: [],
	following: [],
	follower: [],
};
export const userReducer = (
	state: UserState = initialState,
	action: Action
): UserState => {
	const { type } = action;
	switch (type) {
		case ActionType.FETCH_USER:
			return {
				...state,
				currentUser: action.payload,
			};
		case ActionType.FETCH_USER_POSTS:
			return {
				...state,
				posts: action.payload,
			};
		case ActionType.ADD_USER_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
			};
		case ActionType.EDIT_USER_POST:
			const foundPostIdx = state.posts.findIndex(
				(p) => p.id === action.payload.id
			);
			const updatedEditPost = {
				...state.posts[foundPostIdx],
				post: action.payload.post,
			};
			return {
				...state,
				posts: [
					...state.posts.slice(0, foundPostIdx),
					updatedEditPost,
					...state.posts.slice(foundPostIdx + 1),
				],
			};
		case ActionType.DELETE_USER_POST:
			const updatedPost = state.posts.filter(
				(post) => post.id !== action.payload
			);
			return {
				...state,
				posts: updatedPost,
			};
		case ActionType.USER_FOLLOWING_STATE_CHANGE:
			return {
				...state,
				following: action.payload,
			};
		case ActionType.USER_FOLLOWER_STATE_CHANGE:
			return {
				...state,
				follower: action.payload,
			};

		case ActionType.ADD_FOLLOW:
			return {
				...state,
				following: [...state.following, action.payload],
			};

		case ActionType.DELETE_FOLLOW:
			const editedFollow = state.following.filter(
				(id) => id !== action.payload
			);
			return {
				...state,
				following: editedFollow,
			};
		case ActionType.CLEAR_DATA:
			return initialState;
		default:
			return state;
	}
};
