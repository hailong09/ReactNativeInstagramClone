import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "./screens/RootStackPrams";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { Provider } from "react-redux";
import { store } from "./store";
import BottomTabs from "./components/BottomTabs";
import SavePostScreen from "./screens/SavePostScreen";
import ProfileEditScreen from "./screens/ProfileEditScreen";
import PostScreen from "./screens/PostScreen";
import PickImage from "./components/PickImage";
import PostEditScreen from "./screens/PostEditScreen";
const Stack = createStackNavigator<RootStackParamList>();
export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				setIsLoggedIn(false);
			} else {
				setIsLoggedIn(true);
			}
		});
	}, []);

	if (!isLoggedIn) {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Register"
						component={RegisterScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Main">
					<Stack.Screen
						name="Main"
						component={BottomTabs}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="SavePost" component={SavePostScreen} />
					<Stack.Screen
						name="ProfileEdit"
						component={ProfileEditScreen}
						options={{ headerTitle: "Profile Edit" }}
					/>
					<Stack.Screen
						name="PickImage"
						component={PickImage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Post" component={PostScreen} />
					<Stack.Screen
						name="EditPost"
						component={PostEditScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
