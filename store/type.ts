import firebase from "firebase";

export interface Post {
	id: string;
	downLoadUrl: string;
	likesCount: string[];
	post: string;
	createdAt: firebase.firestore.FieldValue;
}

export interface UserFollowingPost extends Post {
	user: UserData;
}

export interface UserData {
	uid: string;
	email: string;
	name?: string;
	username: string;
	avatar:
		| {
				url: string;
				storagePath: string;
		  }
		| null
		| undefined;
}

export type UserState = {
	currentUser: UserData | null;
	posts: Post[];
	following: string[];
	follower: string[]
};

export type UsersFollowState = {
	feed: UserFollowingPost[];
};
