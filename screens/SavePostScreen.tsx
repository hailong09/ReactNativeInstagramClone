import { Formik } from "formik";
import React, { useState } from "react";
import {
	Button,
	Image,
	NativeSyntheticEvent,
	NativeTouchEvent,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import firebase from "firebase";
import { SavePostScreenProps } from "../Props";
import { db } from "../firebase";
// import { useTypedSelector } from "../store";
import { useDispatch } from "react-redux";
import { Post } from "../store/type";
import { addUserPost } from "../store/actions/user";

interface IPostingCaptionFormValue {
	post: string;
}
const SavePostScreen = ({ route, navigation }: SavePostScreenProps) => {
	// const currentUser = useTypedSelector((state) => state.user.currentUser);
	const [isUploaded, setIsUploaded] = useState(false);
	const { image } = route.params;
	const initialValues: IPostingCaptionFormValue = { post: "" };
	const dispatch = useDispatch();
	const upLoadPost = async (values: IPostingCaptionFormValue) => {
		setIsUploaded(true);
		const childPath = `posts/${
			firebase.auth().currentUser?.uid
		}/${Math.random().toString(36)}`;
		const response = await fetch(image);
		const blob = await response.blob();
		const storageRef = firebase.storage().ref();
		const imageUploadTask = storageRef.child(childPath).put(blob);
		imageUploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress} % done`);
			},
			(error) => {
				console.log(error);
			},
			() => {
				imageUploadTask.snapshot.ref
					.getDownloadURL()
					.then((downLoadUrl) => {
						db.collection("posts")
							.doc(firebase.auth().currentUser?.uid)
							.collection("userPosts")
							.add({
								downLoadUrl,
								post: values.post,
								likesCount: [],
								createdAt:
									firebase.firestore.FieldValue.serverTimestamp(),
							})
							.then((doc) => {
								db.collection("posts")
									.doc(firebase.auth().currentUser?.uid)
									.collection("userPosts")
									.doc(doc.id)
									.get()
									.then((snapshot) => {
										const id = snapshot.id;
										const data = snapshot.data();
										const post = { ...data, id } as Post;
										dispatch(addUserPost(post));
									});
							});
					})
					.then(() => {
						navigation.navigate("Main", {
							screen: "Home",
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		);
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={initialValues}
				onSubmit={(values) => upLoadPost(values)}
				validateOnMount={true}
			>
				{({ handleChange, handleSubmit, handleBlur, values }) => (
					<View>
						<View style={{ marginBottom: 5 }}>
							<View style={styles.contentContainer}>
								<View style={styles.imageContainer}>
									<Image
										source={{ uri: image }}
										style={styles.imageStyle}
									/>
								</View>

								<View>
									<TextInput
										placeholder="Write a caption..."
										onChangeText={handleChange("post")}
										onBlur={handleBlur("post")}
										value={values.post}
										multiline={true}
										numberOfLines={6}
										style={styles.input}
										editable={!isUploaded}
									/>
								</View>
							</View>
						</View>
						<View style={{ marginHorizontal: 8 }}>
							<Button
								title="Save post"
								onPress={
									handleSubmit as unknown as (
										ev: NativeSyntheticEvent<NativeTouchEvent>
									) => void
								}
								disabled={isUploaded}
							/>
						</View>
					</View>
				)}
			</Formik>
		</View>
	);
};

export default SavePostScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flexDirection: "row",
	},
	imageContainer: {
		padding: 8,
	},
	imageStyle: {
		width: 120,
		height: 120,
		borderRadius: 10,
	},

	input: {
		width: widthPercentageToDP("60%"),
		padding: 8,
		marginTop: 8,
		borderRadius: 10,
		backgroundColor: "#c7c6c5",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.41,
		shadowRadius: 9.11,

		elevation: 14,
	},
});
