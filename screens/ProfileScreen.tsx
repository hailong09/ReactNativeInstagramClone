import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Avatar } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { widthPercentageToDP } from "react-native-responsive-screen";
import firebase from "firebase";
import { ProfileScreenNavigationProps } from "../Props";
import { Post, UserData } from "../store/type";
import { db } from "../firebase";
import { useTypedSelector } from "../store";

const ProfileScreen = ({ navigation, route }: ProfileScreenNavigationProps) => {
	const [isFollow, setIsFollow] = useState(false);
	const user = useTypedSelector((state) => state.user);
	const currentUser = user.currentUser;
	const [userInfo, setUserInfo] = useState<UserData | null>(null);
	const [userPosts, setUserPost] = useState<Post[] | null>(null);
	const [followingCount, setfollwingCount] = useState(0);
	const [followerCount, setFollowerCount] = useState(0);
	const { width } = Dimensions.get("window");
	const navigatetoEditProfile = () => {
		navigation.navigate("ProfileEdit", {
			uid: firebase.auth().currentUser?.uid as string,
		});
	};
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
	}, [refreshing]);
	const signOut = async () => {
		try {
			await firebase.auth().signOut();
		} catch (error) {
			console.log(error);
		}
	};

	const follow = () => {
		db.collection("following")
			.doc(firebase.auth().currentUser?.uid)
			.collection("usersFollowing")
			.doc(route.params.uid)
			.set({});

		db.collection("follower")
			.doc(route.params.uid)
			.collection("usersFollower")
			.doc(firebase.auth().currentUser?.uid)
			.set({});
	};

	const unfollow = () => {
		db.collection("following")
			.doc(firebase.auth().currentUser?.uid)
			.collection("usersFollowing")
			.doc(route.params.uid)
			.delete();

		db.collection("follower")
			.doc(route.params.uid)
			.collection("usersFollower")
			.doc(firebase.auth().currentUser?.uid)
			.delete();
	};
	useEffect(() => {
		setRefreshing(false);
		if (route.params.uid === firebase.auth().currentUser?.uid) {
			setUserInfo(currentUser as UserData);
			setUserPost(user.posts as Post[]);
			setfollwingCount(user.following.length);
			setFollowerCount(user.follower.length);
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

			db.collection("following")
				.doc(route.params.uid)
				.collection("usersFollowing")
				.get()
				.then((snapshot) => {
					const followingsDocs = snapshot.docs.length;
					setfollwingCount(followingsDocs);
				});

			db.collection("follower")
				.doc(route.params.uid)
				.collection("usersFollower")
				.onSnapshot((snapshot) => {
					const followersDocs = snapshot.docs.length;
					setFollowerCount(followersDocs);
				});

			db.collection("posts")
				.doc(route.params.uid)
				.collection("userPosts")
				.orderBy("createdAt", "desc")
				.get()
				.then((snapshot) => {
					const posts = snapshot.docs.map((doc) => {
						const data = doc.data();
						const id = doc.id;
						return { id, ...data };
					});

					setUserPost(posts as Post[]);
				});
		}

		if (
			user.following.length &&
			user.following.includes(route.params.uid)
		) {
			setIsFollow(true);
		} else {
			setIsFollow(false);
		}

		return () => {
			console.log("clean");
		};
	}, [route.params.uid, isFollow, refreshing, user, user.posts]);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<View style={styles.container}>
				<View style={styles.profileImageContainer}>
					<LinearGradient
						start={[1, 0.5]}
						end={[0, 0]}
						colors={["#DE0046", "#F7A34B"]}
						style={{ borderRadius: 50 }}
					>
						<Avatar
							size={80}
							rounded
							activeOpacity={0.7}
							source={
								userInfo?.avatar
									? { uri: userInfo.avatar.url }
									: require("../assets/default.png")
							}
							containerStyle={styles.avatarContainer}
						/>
					</LinearGradient>
				</View>

				<View style={styles.dataContainer}>
					<View style={styles.singleDataContainer}>
						<Text style={styles.numberData}>
							{userPosts && userPosts?.length > 0
								? userPosts.length
								: "0"}
						</Text>
						<Text style={styles.titleData}>Posts</Text>
					</View>
					<View style={styles.singleDataContainer}>
						<Text style={styles.numberData}>{followerCount}</Text>
						<Text style={styles.titleData}>Followers</Text>
					</View>
					<View style={styles.singleDataContainer}>
						<Text style={styles.numberData}>{followingCount}</Text>
						<Text style={styles.titleData}>Following</Text>
					</View>
				</View>
			</View>
			<View
				style={{
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						marginLeft: 10,
						fontSize: 14,
						fontWeight: "bold",
					}}
				>
					{userInfo?.name ? userInfo.name : ""}
				</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					margin: 8,
				}}
			>
				{route.params.uid === firebase.auth().currentUser?.uid ? (
					<>
						<TouchableOpacity
							style={btnStyle(62)}
							onPress={navigatetoEditProfile}
						>
							<Text
								style={{
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								{" "}
								Edit Profile
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={btnStyle(30)}
							onPress={() => signOut()}
						>
							<Text
								style={{
									fontSize: 16,
									fontWeight: "bold",
								}}
							>
								Log Out
							</Text>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						style={btnStyle(95)}
						onPress={isFollow ? unfollow : follow}
					>
						<Text
							style={{
								fontSize: 16,
								fontWeight: "bold",
							}}
						>
							{isFollow ? "Following" : "Follow"}
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{userPosts && (
				<View
					style={{
						marginTop: 20,
						flex: 1,
						flexDirection: "row",
						flexWrap: "wrap",
						width: widthPercentageToDP("102%"),
					}}
				>
					{userPosts.map((post) => (
						<TouchableOpacity
							key={post.id}
							style={{ paddingVertical: 1, paddingRight: 2 }}
							onPress={() =>
								navigation.navigate("Post", {
									id: post.id,
									uid: firebase.auth().currentUser
										?.uid as string,
								})
							}
						>
							<Image
								source={{
									uri: post.downLoadUrl,
									width: width / 3,
									height: width / 3,
								}}
							/>
						</TouchableOpacity>
					))}
				</View>
			)}
		</ScrollView>
	);
};

export default ProfileScreen;

const btnStyle = (width: number): any => {
	return {
		width: widthPercentageToDP(`${width}%`),
		borderWidth: 0.8,
		height: 30,
		margin: 2,
		padding: 4,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		borderColor: "#CBCBCB",
	};
};
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		alignItems: "center",
		width: widthPercentageToDP("100%"),
	},
	dataContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		width: widthPercentageToDP("74%"),
	},
	profileImageContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	avatarContainer: {
		padding: 3,
		backgroundColor: "white",
		borderRadius: 50,
		margin: 2,
	},
	singleDataContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	numberData: {
		fontSize: 18,
		fontWeight: "bold",
	},
	titleData: {
		fontSize: 14,
	},
});
