import { Dispatch } from "react";
import { db } from "../../firebase";
import { Action, ActionType } from "../actionsType";
import { UserFollowingPost } from "../type";
import firebase from "firebase";

export const addPostToFeed = (user: UserFollowingPost) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({ type: ActionType.ADD_POST, payload: user });
	};
};

export const fetchFeed = () => {
	return async (dispatch: Dispatch<Action>) => {
		db.collection("following")
			.doc(firebase.auth().currentUser?.uid)
			.collection("usersFollowing")
			.get()
			.then((snapshot) => {
				let followings = snapshot.docs.map((doc) => {
					const id = doc.id;
					return id;
				});

				const posts =
					followings === undefined
						? [firebase.auth().currentUser?.uid as string]
						: [
								...followings,
								firebase.auth().currentUser?.uid as string,
						  ];
				const feed = posts.map((uid) => {
					return getFeed(uid);
				});

				Promise.all(feed).then((posts) => {
					const postsConcat = posts.flat(1);
					if (postsConcat) {
						dispatch({
							type: ActionType.FETCH_FEED,
							payload: postsConcat as UserFollowingPost[],
						});
					}
				});
			});
	};
};

export const getFeed = (uid: string) => {
	return db
		.collection("users")
		.doc(uid)
		.get()
		.then((snapshot) => {
			if (snapshot.exists) {
				const user = snapshot.data();
				const posts = db
					.collection("posts")
					.doc(snapshot.id)
					.collection("userPosts")
					.orderBy("createdAt", "desc")
					.get()
					.then((snapshot) => {
						const posts = snapshot.docs.map((doc) => {
							const data = doc.data();
							const id = doc.id;
							return { ...data, id, user };
						}) as UserFollowingPost[];

						return posts;
					});
				return posts;
			} else {
				console.log("user does not exist!");
				return;
			}
		})
		.catch((err) => console.log(err));
};

export const deletePostInFeed = (id: string) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({ type: ActionType.DELETE_POST_IN_FEED, payload: id });
	};
};

export const like_post = (
	postId: string,
	userId: string,
	currentLikesCount: string[]
) => {
	return (dispatch: Dispatch<Action>) => {
		const updatedLikesCount = [
			...currentLikesCount,
			firebase.auth().currentUser?.uid,
		] as string[];

		db.collection("posts")
			.doc(userId)
			.collection("userPosts")
			.doc(postId)
			.update({
				likesCount: updatedLikesCount,
			})
			.then(() => {
				dispatch({
					type: ActionType.LIKE_POST,
					payload: {
						postId,
						userLikeId: firebase.auth().currentUser?.uid as string,
					},
				});
			});
	};
};

export const dislike_post = (
	postId: string,
	userId: string,
	currentLikesCount: string[]
) => {
	return (dispatch: Dispatch<Action>) => {
		const updatedLikesCount = currentLikesCount.filter(
			(likedUser) => likedUser !== firebase.auth().currentUser?.uid
		);
		db.collection("posts")
			.doc(userId)
			.collection("userPosts")
			.doc(postId)
			.update({
				likesCount: updatedLikesCount,
			})
			.then(() => {
				dispatch({
					type: ActionType.DISLIKE_POST,
					payload: {
						postId,
						userLikeId: firebase.auth().currentUser?.uid as string,
					},
				});
			});
	};
};

export const editUserPostInFeed = (id: string, post: string) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({
			type: ActionType.EDIT_USER_POST_IN_FEED,
			payload: {
				id,
				post,
			},
		});
	};
};
