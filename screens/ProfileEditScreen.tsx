import { Formik } from "formik";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Keyboard,
	NativeSyntheticEvent,
	NativeTouchEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { widthPercentageToDP } from "react-native-responsive-screen";
import firebase from "firebase";
import { db } from "../firebase";
import { ImageType, ProfileEditScreenProps } from "../Props";
import { Avatar } from "react-native-elements";
import { useTypedSelector } from "../store";
interface IEditProfileForm {
	username: string;
	name: string;
}
const ProfileEditScreen = ({ navigation }: ProfileEditScreenProps) => {
	const currentUser = useTypedSelector((state) => state.user.currentUser);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const editProfile = (values: IEditProfileForm) => {
		setIsSubmitted(true);
		db.collection("users")
			.doc(firebase.auth().currentUser?.uid)
			.update({
				...currentUser,
				name: values.name,
				username: values.username,
			})
			.then(() => {
				navigation.popToTop();
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const initialValues: IEditProfileForm = {
		username: currentUser?.username as string,
		name: currentUser?.name as string,
	};
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<View style={styles.container}>
				<View
					style={{ justifyContent: "center", alignItems: "center" }}
				>
					<Avatar
						size={100}
						rounded
						activeOpacity={0.7}
						source={
							currentUser?.avatar
								? { uri: currentUser.avatar.url }
								: require("../assets/default.png")
						}
					/>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("PickImage", {
								imageType: ImageType.ProfileImage,
							})
						}
					>
						<Text
							style={{
								color: "#2196F3",
								fontSize: 14,
								fontWeight: "900",
							}}
						>
							Edit avatar
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 20 }}>
					<Formik
						initialValues={initialValues}
						validateOnMount={true}
						onSubmit={(values) => editProfile(values)}
					>
						{({
							handleChange,
							handleSubmit,
							handleBlur,
							values,
						}) => (
							<View
								style={{
									justifyContent: "center",
									alignContent: "center",
								}}
							>
								<TextInput
									placeholder="Username"
									style={styles.input}
									onChangeText={handleChange("username")}
									onBlur={handleBlur("username")}
									value={values.username}
									editable={!isSubmitted}
								/>
								<TextInput
									placeholder="Name"
									style={styles.input}
									onBlur={handleBlur("name")}
									onChangeText={handleChange("name")}
									value={values.name}
									editable={!isSubmitted}
								/>

								<View>
									<TouchableOpacity
										onPress={
											handleSubmit as unknown as (
												ev: NativeSyntheticEvent<NativeTouchEvent>
											) => void
										}
										style={styles.buttonStyle}
									>
										{isSubmitted ? (
											<ActivityIndicator
												color={"white"}
											/>
										) : (
											<Text
												style={{
													fontSize: 18,
													fontWeight: "400",
												}}
											>
												Edit
											</Text>
										)}
									</TouchableOpacity>
								</View>
							</View>
						)}
					</Formik>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 20,
	},
	input: {
		borderBottomWidth: 1,
		borderRadius: 5,
		borderColor: "#8a8a8a",
		backgroundColor: "#e8e8e8",
		marginVertical: 8,
		padding: 6,
		width: widthPercentageToDP("94%"),
	},
	buttonStyle: {
		borderWidth: 0.8,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		borderColor: "#CBCBCB",
		backgroundColor: "#2196F3",
		marginTop: 10,
	},
});
