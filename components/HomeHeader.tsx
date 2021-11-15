import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import { SvgXml } from "react-native-svg";
import { HeaderScreenProps, ImageType } from "../Props";
import { xmlIG_Logo, xml_add, xml_heart, xml_mess } from "../svg/SvgImage";

const HomeHeader = ({ navigation }: HeaderScreenProps) => {
	const handleAddPress = () => {
		navigation.navigate("PickImage", { imageType: ImageType.PostImage});
	};

	return (
		<View style={styles.container}>
			<SvgXml xml={xmlIG_Logo} />

			<View style={styles.icons}>
				<TouchableHighlight onPress={handleAddPress}>
					<SvgXml xml={xml_add} />
				</TouchableHighlight>
				<TouchableHighlight>
					<SvgXml xml={xml_heart} />
				</TouchableHighlight>
				<TouchableHighlight>
					<SvgXml xml={xml_mess} />
				</TouchableHighlight>
			</View>
		</View>
	);
};

export default HomeHeader;

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
	icons: {
		flex: 0.4,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
