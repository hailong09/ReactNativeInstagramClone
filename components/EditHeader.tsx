import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import { EditHeaderProps } from "../Props";

const EditHeader = ({ navigation, title }: EditHeaderProps) => {
	return (
		<View style={styles.constainer}>
			<TouchableOpacity onPress={() => navigation.navigate("Main")}>
				<Icon type="material-community" name="close" size={35} />
			</TouchableOpacity>
			<View
				style={{
					width: widthPercentageToDP("80%"),
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={styles.headerTitle}>{title}</Text>
			</View>
		</View>
	);
};

export default EditHeader;

const styles = StyleSheet.create({
	constainer: {
		flexDirection: "row",
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
