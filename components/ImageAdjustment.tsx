import { ImageEditor } from "expo-image-editor";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import { ImageAdjustmentProps, ImageType } from "../Props";

import firebase from "firebase";
import { RootState } from "../store/reducers";
const ImageAdjustment = ({
	image,
	setImage,
	navigation,
	imgType,
	setIsLoading,
}: ImageAdjustmentProps) => {
	const [editorVisible, setEditorVisible] = useState(true);

	const handleCloseEditor = () => {
		setEditorVisible(false);
		setImage(null);
	};

	const currentUser = useSelector(
		(state: RootState) => state.user.currentUser
	);

	const editAvatar = async () => {
		const childPath = `userAvatar/${
			firebase.auth().currentUser?.uid
		}/${Math.random().toString(36)}`;

		const respose = await fetch(image);
		const blod = await respose.blob();

		const storageRef = firebase.storage().ref();
		const imageUploadTask = storageRef.child(childPath).put(blod);

		if (currentUser?.avatar) {
			try {
				await storageRef.child(currentUser.avatar.storagePath).delete();
			} catch (error) {
				console.log(error);
			}
		}

		setIsLoading(true);
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
						db.collection("users")
							.doc(firebase.auth().currentUser?.uid)
							.update({
								...currentUser,
								avatar: {
									url: downLoadUrl,
									storagePath: childPath,
								},
							});
					})
					.then(() => {
						navigation.navigate("ProfileEdit", {
							uid: firebase.auth().currentUser?.uid as string,
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		);
	};

	return (
		<View style={styles.savedImageContainer}>
			<ImageEditor
				visible={editorVisible}
				onCloseEditor={handleCloseEditor}
				imageUri={image}
				fixedCropAspectRatio={1 / 1}
				minimumCropDimensions={{
					width: 100,
					height: 100,
				}}
				onEditingComplete={(result) => {
					if (imgType === ImageType.PostImage) {
						navigation.navigate("SavePost", { image: result?.uri });
					} else {
						editAvatar();
					}
				}}
				mode="full"
				allowedTransformOperations={["rotate"]}
			/>
		</View>
	);
};

export default ImageAdjustment;

const styles = StyleSheet.create({
	savedImageContainer: {
		flex: 1,
		flexDirection: "row",
	},
});
