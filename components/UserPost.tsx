import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modalbox";
import { Avatar, Icon } from "react-native-elements";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import { SvgXml } from "react-native-svg";
import { PostProps } from "../Props";
import firebase from "firebase";

import { xml_bookmark, xml_comment, xml_share } from "../svg/SvgImage";
import { useDispatch } from "react-redux";
import {
	deletePostInFeed,
	dislike_post,
	like_post,
} from "../store/actions/posts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { db } from "../firebase";
import { deleteUserPost } from "../store/actions/user";

const UserPost = ({ post, navigation }: PostProps) => {
	const dispatch = useDispatch();
	const modal6 = useRef<Modal>(null);
	const likePost = () => {
		if (
			!post.likesCount.includes(
				firebase.auth().currentUser?.uid as string
			)
		) {
			dispatch(like_post(post.id, post.user.uid, post.likesCount));
		} else {
			dispatch(dislike_post(post.id, post.user.uid, post.likesCount));
		}
	};

	const handleEdit = () => {
		navigation.navigate("EditPost", { id: post.id });
		modal6.current?.close();
	};

	const handleDelete = () => {
		db.collection("posts")
			.doc(post.user.uid)
			.collection("userPosts")
			.doc(post.id)
			.delete()
			.then(() => {
				modal6.current?.close();
				dispatch(deletePostInFeed(post.id));
				dispatch(deleteUserPost(post.id));
				navigation.goBack();
			});
	};

	return (
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
						style={{ borderRadius: 50, marginRight: 5 }}
					>
						<Avatar
							size="small"
							rounded
							activeOpacity={0.7}
							source={
								post.user.avatar
									? { uri: post.user.avatar.url }
									: require("../assets/default.png")
							}
							containerStyle={styles.avatarContainer}
						/>
					</LinearGradient>
					<Text>{post.user.username}</Text>
				</View>
				{post.user.uid === firebase.auth().currentUser?.uid && (
					<TouchableWithoutFeedback
						onPress={() => modal6.current?.open()}
					>
						<Icon
							type="material-community"
							name="dots-vertical"
							size={20}
						/>
					</TouchableWithoutFeedback>
				)}
			</View>
			<Image
				source={
					post.downLoadUrl
						? { uri: post.downLoadUrl }
						: require("../assets/test.jpg")
				}
				style={styles.imagePost}
			/>

			<View style={styles.iconsContainer}>
				<View style={styles.interactIconsContainer}>
					<TouchableWithoutFeedback onPress={likePost}>
						<Icon
							type="material-community"
							name={
								post.likesCount &&
								!post.likesCount.includes(
									firebase.auth().currentUser?.uid as string
								)
									? "heart-outline"
									: "heart"
							}
							size={26}
							style={styles.interactIcons}
							color={
								post.likesCount &&
								!post.likesCount.includes(
									firebase.auth().currentUser?.uid as string
								)
									? "#000"
									: "#e85151"
							}
						/>
					</TouchableWithoutFeedback>
					<SvgXml xml={xml_comment} style={styles.interactIcons} />
					<SvgXml xml={xml_share} style={styles.interactIcons} />
				</View>
				<View>
					<SvgXml xml={xml_bookmark} />
				</View>
			</View>
			<Text style={{ marginHorizontal: 10 }}>
				{post.post && (
					<>
						<Text style={{ fontWeight: "bold" }}>
							{post.user.username}
						</Text>
						<Text> {post.post}</Text>
					</>
				)}
			</Text>
			<Modal
				style={[styles.modal, styles.modal4]}
				position={"center"}
				ref={modal6}
				swipeArea={20}
			>
				<View>
					<TouchableOpacity
						style={styles.modalBtn}
						onPress={handleEdit}
					>
						<Text style={{ textAlign: "center" }}>Edit Post</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.modalBtn}
						onPress={handleDelete}
					>
						<Text style={{ textAlign: "center" }}>Delete Post</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

export default UserPost;

const styles = StyleSheet.create({
	container: {
		width: widthPercentageToDP("100%"),
		marginBottom: 8,
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
	iconsContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 10,
	},
	interactIconsContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	interactIcons: {
		marginRight: 10,
	},
	modal: {
		justifyContent: "center",
		alignItems: "center",
	},

	modal4: {
		height: 300,
		borderRadius: 20,
	},
	modalBtn: {
		marginVertical: 20,
		backgroundColor: "grey",
		padding: 8,
		borderRadius: 10,
		width: widthPercentageToDP("50%"),
	},
});
