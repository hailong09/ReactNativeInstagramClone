import React from "react";
import { Text, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

type HeaderProps = {
	title: string;
};
const Header = ({ title }: HeaderProps) => {
	return (
		<View
			style={{
				width: widthPercentageToDP("60%"),
			}}
		>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					textAlign: "center",
				}}
			>
				{title}
			</Text>
		</View>
	);
};

export default Header;
