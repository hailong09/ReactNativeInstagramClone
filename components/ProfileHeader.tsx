import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import { SvgXml } from "react-native-svg";
import { ImageType, ProfileHeaderProps } from "../Props";
import { xml_add } from "../svg/SvgImage";
import firebase from "firebase";
import { db } from "../firebase";
import { UserData } from "../store/type";

const ProfileHeader = ({
	navigation,
	route,
	currentUser,
}: ProfileHeaderProps) => {
	const [userInfo, setUserInfo] = useState<UserData | null>(null);
	const handleAddPress = () => {
		navigation.navigate("PickImage", { imageType: ImageType.PostImage });
	};

	useEffect(() => {
		if (route.params.uid === firebase.auth().currentUser?.uid) {
			setUserInfo(currentUser as UserData);
		} else {
			db.collection("users")
				.doc(route.params.uid)
				.get()
				.then((snapshot) => {
					if (snapshot.exists) {
						setUserInfo(snapshot.data() as UserData);
					} else {
						console.log("User's not exist");
					}
				});
		}
	}, [route.params.uid, currentUser]);

	return (
		<View style={styles.container}>
			<View>
				<Text style={{ fontSize: 25, fontWeight: "bold" }}>
					{userInfo?.username}
				</Text>
			</View>
			{route.params.uid === firebase.auth().currentUser?.uid && (
				<View>
					<TouchableHighlight onPress={handleAddPress}>
						<SvgXml xml={xml_add} />
					</TouchableHighlight>
				</View>
			)}
		</View>
	);
};

export default ProfileHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		backgroundColor: "white",
		width: widthPercentageToDP("100%"),
		height: heightPercentageToDP("12%"),
		paddingBottom: 10,
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,

		elevation: 4,
	},
});
