import firebase from "firebase";
import { Dispatch } from "react";
import { db } from "../../firebase";
import { Action, ActionType } from "../actionsType";
import { Post, UserData } from "../type";

export function clearData() {
	return (dispatch: Dispatch<Action>) => {
		dispatch({ type: ActionType.CLEAR_DATA });
	};
}

export const fetchUser = () => {
	return (dispatch: Dispatch<Action>) => {
		db.collection("users")
			.doc(firebase.auth().currentUser?.uid)
			.onSnapshot(
				(snapshot) => {
					if (snapshot.exists) {
						const data = snapshot.data();
						const uid = firebase.auth().currentUser?.uid as string;
						dispatch({
							type: ActionType.FETCH_USER,
							payload: { uid, ...data } as UserData,
						});
					}
				},
				(error) => {
					console.log(error);
				}
			);
	};
};

export const fetchUserPost = () => {
	return (dispatch: Dispatch<Action>) => {
		db.collection("posts")
			.doc(firebase.auth().currentUser?.uid)
			.collection("userPosts")
			.orderBy("createdAt", "desc")
			.get()
			.then((snapshot) => {
				let posts = snapshot.docs.map((doc) => {
					const data = doc.data();
					const id = doc.id;
					return { ...data, id };
				});
				dispatch({
					type: ActionType.FETCH_USER_POSTS,
					payload: posts as Post[],
				});
			});
	};
};

export const addUserPost = (post: Post) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({ type: ActionType.ADD_USER_POST, payload: post });
	};
};

export const deleteUserPost = (id: string) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({ type: ActionType.DELETE_USER_POST, payload: id });
	};
};

export const fetchUserFollowing = () => {
	return (dispatch: Dispatch<Action>) => {
		db.collection("following")
			.doc(firebase.auth().currentUser?.uid)
			.collection("usersFollowing")
			.onSnapshot((snapshot) => {
				let following = snapshot.docs.map((doc) => {
					const id = doc.id;
					return id;
				}) as string[];
				dispatch({
					type: ActionType.USER_FOLLOWING_STATE_CHANGE,
					payload: following,
				});
			});
	};
};

export const fetchUserFollower = () => {
	return (dispatch: Dispatch<Action>) => {
		db.collection("follower")
			.doc(firebase.auth().currentUser?.uid)
			.collection("usersFollower")
			.onSnapshot((snapshot) => {
				let follower = snapshot.docs.map((doc) => {
					const id = doc.id;
					return id;
				}) as string[];

				dispatch({
					type: ActionType.USER_FOLLOWER_STATE_CHANGE,
					payload: follower,
				});
			});
	};
};


export const editUserPost = (id: string, post: string) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({
			type: ActionType.EDIT_USER_POST,
			payload: {
				id,
				post,
			},
		});
	};
};
