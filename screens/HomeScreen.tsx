import { useScrollToTop } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch } from "react-redux";
import UserPost from "../components/UserPost";
import Stories from "../components/Stories";
import { useTypedSelector } from "../store";
import { fetchFeed } from "../store/actions/posts";
import { HomeScreenProps } from "../Props";

const HomeScreen = ({ navigation }: HomeScreenProps) => {
	const [refreshing, setRefreshing] = useState(false);
	const feed = useTypedSelector((state) => state.posts.feed);

	const dispatch = useDispatch();
	const onRefresh = useCallback(() => {
		setRefreshing(true);
	}, [refreshing]);

	const ref = useRef(null);
	useScrollToTop(ref);
	useEffect(() => {
		dispatch(fetchFeed());
		setRefreshing(false);
	}, [refreshing]);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			ref={ref}
		>
			<View style={styles.container}>
				<Stories />
				<Divider orientation="vertical" style={styles.dividerStyle} />
				<View style={styles.postsContainer}>
					{feed &&
						feed.map((post) => (
							<UserPost
								key={post.id}
								post={post}
								navigation={navigation}
							/>
						))}
				</View>
			</View>
		</ScrollView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "flex-start",
	},
	dividerStyle: {
		borderWidth: 0.4,
		borderColor: "#DADADA",
	},
	postsContainer: {
		marginTop: 10,
	},
});
