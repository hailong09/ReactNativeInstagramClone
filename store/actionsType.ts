import { Post, UserData, UserFollowingPost } from "./type";

export const FETCH_USER = "FETCH_USER";
export const FETCH_USER_POSTS = "FETCH_USER_POSTS";
export const USER_FOLLOWING_STATE_CHANGE = "USER_FOLLOWING_STATE_CHANGE";
export const CLEAR_DATA = "CLEAR_DATA";
export const USERS_FOLLOWING_DATA = "USERS_FOLLOWING_DATA";
export const USERS_FOLLOWING_POSTS_STATE = "USERS_FOLLOWING_POSTS_STATE";

export enum ActionType {
	FETCH_USER = "FETCH_USER",
	FETCH_USER_POSTS = "FETCH_USER_POSTS",
	USER_FOLLOWING_STATE_CHANGE = "USER_FOLLOWING_STATE_CHANGE",
	USER_FOLLOWER_STATE_CHANGE = "USER_FOLLOWER_STATE_CHANGE",
	ADD_FOLLOW = "ADD_FOLLOW",
	DELETE_FOLLOW = "DELETE_FOLLOW",
	CLEAR_DATA = "CLEAR_DATA",
	FETCH_FEED = "FETCH_FEED",
	ADD_POST = "ADD_POST",
	ADD_USER_POST = "ADD_USER_POST",
	DELETE_USER_POST = "DELETE_USER_POST",
	LIKE_POST = "LIKE_POST",
	DISLIKE_POST = "DISLIKE_POST",
	DELETE_POST_IN_FEED = "DELETE_POST_IN_FEED",
	EDIT_USER_POST_IN_FEED = "EDIT_USER_POST_IN_FEED",
	EDIT_USER_POST = "EDIT_USER_POST",
}

type actionClearData = {
	type: ActionType.CLEAR_DATA;
};

type actionFechUser = {
	type: ActionType.FETCH_USER;
	payload: UserData;
};

type actionFetchUserPosts = {
	type: ActionType.FETCH_USER_POSTS;
	payload: Post[];
};

type actionAddUserPost = {
	type: ActionType.ADD_USER_POST;
	payload: Post;
};

type actionDeleteUserPost = {
	type: ActionType.DELETE_USER_POST;
	payload: string;
};

type actionFetchUserFollowing = {
	type: ActionType.USER_FOLLOWING_STATE_CHANGE;
	payload: string[];
};

type actionFetchUserFollower = {
	type: ActionType.USER_FOLLOWER_STATE_CHANGE;
	payload: string[];
};
type acitonFollow = {
	type: ActionType.ADD_FOLLOW;
	payload: string;
};

type actionDeleteFollow = {
	type: ActionType.DELETE_FOLLOW;
	payload: string;
};

type actionFetchFeed = {
	type: ActionType.FETCH_FEED;
	payload: UserFollowingPost[];
};

type actionAddPost = {
	type: ActionType.ADD_POST;
	payload: UserFollowingPost;
};

type actionLikePost = {
	type: ActionType.LIKE_POST;
	payload: {
		postId: string;
		userLikeId: string;
	};
};

type actionDislikePost = {
	type: ActionType.DISLIKE_POST;
	payload: {
		postId: string;
		userLikeId: string;
	};
};

type actionDeletePostinFeed = {
	type: ActionType.DELETE_POST_IN_FEED;
	payload: string;
};

type actionEditUserPostInFeed = {
	type: ActionType.EDIT_USER_POST_IN_FEED;
	payload: {
		id: string;
		post: string;
	};
};

type actionEditUserPost = {
	type: ActionType.EDIT_USER_POST;
	payload: {
		id: string;
		post: string;
	};
};

export type Action =
	| actionClearData
	| actionFechUser
	| actionFetchUserPosts
	| actionFetchUserFollowing
	| actionFetchUserFollower
	| actionFetchFeed
	| actionAddPost
	| actionAddUserPost
	| acitonFollow
	| actionDeleteFollow
	| actionLikePost
	| actionDislikePost
	| actionDeletePostinFeed
	| actionEditUserPostInFeed
	| actionDeleteUserPost
	| actionEditUserPost;
