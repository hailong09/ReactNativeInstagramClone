import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import firebase from "firebase";
import React, { Dispatch, useEffect } from "react";
import { Avatar, Icon } from "react-native-elements";
import { useDispatch } from "react-redux";
import { ProfileScreenNavigationProps } from "../Props";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { MainStackParamList } from "../screens/RootStackPrams";
import SearchScreen from "../screens/SearchScreen";
import { useTypedSelector } from "../store";


import {
	clearData,
	fetchUser,
	fetchUserFollower,
	fetchUserFollowing,
	fetchUserPost,
} from "../store/actions/user";

import { UserData } from "../store/type";
import HomeHeader from "./HomeHeader";
import ProfileHeader from "./ProfileHeader";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
	const dispatch: Dispatch<any> = useDispatch();
	const currentUser = useTypedSelector((state) => state.user.currentUser);
	useEffect(() => {
		dispatch(clearData());
		dispatch(fetchUser());
		dispatch(fetchUserPost());
		dispatch(fetchUserFollowing());
		dispatch(fetchUserFollower());
	}, []);

	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				tabBarActiveTintColor: "#000000",
				tabBarInactiveTintColor: "none",
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon
							type="material-community"
							name={color === "none" ? "home-outline" : "home"}
							size={30}
						/>
					),

					header: ({ navigation }) => (
						<HomeHeader navigation={navigation} />
					),

					tabBarShowLabel: false,
				}}
			/>
			<Tab.Screen
				name="Search"
				component={SearchScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon
							type="material-icons"
							name={color === "none" ? "search" : "search-off"}
							size={30}
						/>
					),

					tabBarShowLabel: false,
				}}
			/>

			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				listeners={({ navigation }) => ({
					tabPress: (event) => {
						event.preventDefault();
						navigation.navigate("Profile", {
							uid: firebase.auth().currentUser?.uid,
						});
					},
				})}
				options={({ route }) => ({
					tabBarIcon: ({ focused }) => {
						const profileRoute = route as RouteProp<
							MainStackParamList,
							"Profile"
						>;
						return (
							<Avatar
								size={30}
								rounded
								activeOpacity={0.7}
								source={
									currentUser?.avatar
										? { uri: currentUser.avatar.url }
										: require("../assets/default.png")
								}
								containerStyle={{
									borderRadius: 50,
									backgroundColor: `${
										profileRoute.params &&
										profileRoute.params.uid ===
											firebase.auth().currentUser?.uid &&
										focused
											? "#000000"
											: "white"
									}`,
									padding: 2,
								}}
							/>
						);
					},

					tabBarShowLabel: false,
					header: ({ navigation, route }) => {
						const props = {
							navigation,
							route,
						} as ProfileScreenNavigationProps;
						return (
							<ProfileHeader
								navigation={props.navigation}
								route={props.route}
								currentUser={currentUser as UserData}
							/>
						);
					},
				})}
			/>
		</Tab.Navigator>
	);
};

export default BottomTabs;
