import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";

import { EditPostScreenProps } from "../Props";

import { useTypedSelector } from "../store";
import { Formik } from "formik";
import { db } from "../firebase";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { editUserPostInFeed } from "../store/actions/posts";
import { editUserPost } from "../store/actions/user";

interface IEditPostForm {
	post: string;
}
const PostEditScreen = ({ route, navigation }: EditPostScreenProps) => {
	const dispatch = useDispatch();
	const posts = useTypedSelector((state) => state.user.posts);
	const post = posts.find((p) => p.id === route.params.id);
	const user = useTypedSelector((state) => state.user.currentUser);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const initialValues: IEditPostForm = {
		post: post?.post as string,
	};
	useEffect(() => {}, [posts]);
	const editUserPostSubmit = (values: IEditPostForm) => {
		setIsSubmitted(true);
		db.collection("posts")
			.doc(firebase.auth().currentUser?.uid)
			.collection("userPosts")
			.doc(post?.id)
			.update({ post: values.post })
			.then(() => {
				dispatch(editUserPostInFeed(route.params.id, values.post));
				dispatch(editUserPost(route.params.id, values.post));
			});
	};

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<Formik
				initialValues={initialValues}
				validateOnMount={true}
				onSubmit={(values) => editUserPostSubmit(values)}
			>
				{({ handleChange, handleSubmit, handleBlur, values }) => (
					<View>
						<View style={styles.editConstainer}>
							<TouchableOpacity
								onPress={() => navigation.goBack()}
							>
								<Icon
									type="material-community"
									name="close"
									size={35}
								/>
							</TouchableOpacity>
							<View
								style={{
									width: widthPercentageToDP("80%"),
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text style={styles.headerTitle}>
									Edit Post
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									handleSubmit();
									navigation.popToTop();
								}}
							>
								{isSubmitted ? (
									<ActivityIndicator color={"#2196F3"} />
								) : (
									<Icon
										type="material-community"
										name="check"
										size={35}
										color={"#2196F3"}
									/>
								)}
							</TouchableOpacity>
						</View>
						<View style={styles.container}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									marginRight: 10,
								}}
							>
								<View style={styles.postContainer}>
									<LinearGradient
										start={[1, 0.5]}
										end={[0, 0]}
										colors={["#DE0046", "#F7A34B"]}
										style={{
											borderRadius: 50,
											marginRight: 5,
										}}
									>
										<Avatar
											size="small"
											rounded
											activeOpacity={0.7}
											source={
												user && user?.avatar
													? { uri: user.avatar.url }
													: require("../assets/default.png")
											}
											containerStyle={
												styles.avatarContainer
											}
										/>
									</LinearGradient>
									<Text>{user?.username}</Text>
								</View>
							</View>
							<Image
								source={
									post?.downLoadUrl
										? { uri: post.downLoadUrl }
										: require("../assets/test.jpg")
								}
								style={styles.imagePost}
							/>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<TextInput
									placeholder="Caption"
									style={styles.input}
									onChangeText={handleChange("post")}
									onBlur={handleBlur("post")}
									value={values.post}
									editable={!isSubmitted}
								/>
							</View>
						</View>
					</View>
				)}
			</Formik>
		</TouchableWithoutFeedback>
	);
};

export default PostEditScreen;

const styles = StyleSheet.create({
	container: {
		width: widthPercentageToDP("100%"),
		marginTop: 10,
	},
	postContainer: {
		marginHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	avatarContainer: {
		padding: 2,
		backgroundColor: "white",
		borderRadius: 50,
		margin: 1.5,
	},
	imagePost: {
		width: widthPercentageToDP("100%"),
		height: heightPercentageToDP("50%"),
		marginVertical: 5,
	},
	input: {
		borderBottomWidth: 1,
		borderRadius: 5,
		borderColor: "#8a8a8a",
		backgroundColor: "#e8e8e8",
		marginVertical: 8,
		padding: 6,
		width: widthPercentageToDP("95%"),
	},

	editConstainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "flex-end",
		width: widthPercentageToDP("100%"),
		backgroundColor: "white",
		height: heightPercentageToDP("12%"),
		paddingBottom: 10,
		paddingHorizontal: 6,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,

		elevation: 4,
	},

	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
