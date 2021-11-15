import React, { useEffect, useState } from "react";
import { View } from "react-native";
import UserPost from "../components/UserPost";
import { db } from "../firebase";
import { PostScreenProps } from "../Props";
import { Post, UserData, UserFollowingPost } from "../store/type";

const PostScreen = ({ route, navigation }: PostScreenProps) => {
	const [user, setUser] = useState<UserData | null>(null);
	const [post, setPost] = useState<Post | null>(null);
	useEffect(() => {
		if (route.params) {
			db.collection("users")
				.doc(route.params.uid)
				.get()
				.then((snapshot) => {
					const data = snapshot.data();
					setUser(data as UserData);
				});

			db.collection("posts")
				.doc(route.params.uid)
				.collection("userPosts")
				.doc(route.params.id)
				.onSnapshot((snapshot) => {
					const data = snapshot.data();
					setPost({ id: route.params.id, ...data } as Post);
				});
		}
	}, []);
	return (
		<View style={{ marginTop: 10 }}>
			{post && user && (
				<UserPost
					post={{ ...post, user } as UserFollowingPost}
					navigation={navigation}
				/>
			)}
		</View>
	);
};

export default PostScreen;
