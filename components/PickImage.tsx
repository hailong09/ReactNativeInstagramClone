import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Icon } from "react-native-elements";
import { PickImageProps } from "../Props";
import CameraScreen from "../screens/CameraScreen";
import GalleryScreen from "../screens/GalleryScreen";
import EditHeader from "./EditHeader";

const Tab = createBottomTabNavigator();

const PickImage = ({ navigation, route }: PickImageProps) => {
	return (
		<Tab.Navigator
			initialRouteName="Gallery"
			screenOptions={{
				tabBarActiveBackgroundColor: "grey",
				tabBarActiveTintColor: "white",
			}}
		>
			<Tab.Screen
				name="Camera"
				children={() => (
					<CameraScreen
						navigation={navigation}
						imgType={route.params.imageType}
					/>
				)}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon
							type="material-community"
							name="camera"
							size={30}
							color={color}
						/>
					),
					header: ({ navigation }) => (
						<EditHeader title="Camera" navigation={navigation} />
					),
				}}
			/>

			<Tab.Screen
				name="Gallery"
				children={() => (
					<GalleryScreen
						navigation={navigation}
						imgType={route.params.imageType}
					/>
				)}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon
							type="material-community"
							name="folder-image"
							size={30}
							color={color}
						/>
					),
					header: ({ navigation }) => (
						<EditHeader title="Gallery" navigation={navigation} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default PickImage;
