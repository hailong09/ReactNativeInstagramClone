import React, { useState } from "react";
import {
	FlatList,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import firebase from "firebase";
import { UserData } from "../store/type";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Avatar } from "react-native-elements";
import { SearchScreenNavigationProps } from "../Props";

interface UserSearchState {
	id: string;
	data: UserData;
}
const SearchScreen = ({ navigation }: SearchScreenNavigationProps) => {
	const [users, setUsers] = useState<UserSearchState[]>([]);
	const [text, setText] = useState("");
	const fetchUsers = (search: string) => {
		if (search === "") {
			setUsers([]);
		} else {
			firebase
				.firestore()
				.collection("users")
				.get()
				.then((snapshot) => {
					let users = snapshot.docs
						.filter((doc) => {
							const data = doc.data();
							return data.username
								?.toLowerCase()
								.includes(search.toLowerCase());
						})
						.map((doc) => {
							const data = doc.data() as UserData;
							const id = doc.id;
							return { id, data };
						});

					setUsers(users);
				});
		}
	};

	const onchangeText = (text: string) => {
		setText(text);
		fetchUsers(text);
	};
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<View style={styles.container}>
				<TextInput
					placeholder="Type Here..."
					onChangeText={(search) => onchangeText(search)}
					style={styles.searchInput}
					value={text}
				/>
				<View>
					<FlatList
						numColumns={1}
						horizontal={false}
						data={users}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									setUsers([]);
									setText("");
									navigation.navigate("Profile", {
										uid: item.id as string,
									});
								}}
							>
								<View style={styles.foundItem}>
									<Avatar
										source={
											item.data.avatar
												? { uri: item.data.avatar.url }
												: require("../assets/default.png")
										}
										size={40}
										rounded
									/>
									<View style={{ marginLeft: 10 }}>
										<Text style={{ fontSize: 16 }}>
											{item.data.username}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		marginHorizontal: 8,
	},
	searchInput: {
		backgroundColor: "grey",
		width: widthPercentageToDP("93%"),
		borderRadius: 10,
		padding: 5,
		marginHorizontal: 5,
	},
	foundItem: {
		flexDirection: "row",
		alignItems: "center",
		margin: 10,
	},
});
