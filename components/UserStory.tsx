import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, Text } from "react-native";
import { Avatar } from "react-native-elements";
const UserStory = () => {
	return (
		<View style={styles.storyContainer}>
			<LinearGradient
				start={[1, 0.5]}
				end={[0, 0]}
				colors={["#DE0046", "#F7A34B"]}
				style={{ borderRadius: 50 }}
			>
				<Avatar
					size={60}
					rounded
					activeOpacity={0.7}
					source={require("../assets/default.png")}
					containerStyle={styles.avatarContainer}
				/>
			</LinearGradient>
			<Text style={styles.storyText}>username</Text>
		</View>
	);
};

export default UserStory;

const styles = StyleSheet.create({
	storyContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	storyText: {
		fontSize: 12,
	},
	avatarContainer: {
		padding: 3,
		backgroundColor: "white",
		borderRadius: 50,
		margin: 2,
	},
});
