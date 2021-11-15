import React from "react";
import { View, StyleSheet } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import UserStory from "./UserStory";
const Stories = () => {
	return (
		<View style={styles.container}>
			<UserStory />
		</View>
	);
};

export default Stories;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
		paddingBottom: 8,
		paddingHorizontal: 10,
		width: widthPercentageToDP("100%"),
	},
});
