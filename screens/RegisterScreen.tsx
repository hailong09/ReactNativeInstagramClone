import { Formik } from "formik";
import React from "react";
import {
	Button,
	Image,
	Keyboard,
	NativeSyntheticEvent,
	NativeTouchEvent,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as yup from "yup";
import { db } from "../firebase";
import firebase from "firebase";
import { registerScreenProps } from "../Props";
interface IRegisterFormValues {
	email: string;
	username: string;
	password: string;
}

const RegisterScreen = ({ navigation }: registerScreenProps) => {
	const RegisterFormSchema = yup.object().shape({
		username: yup.string().required(),
		email: yup.string().email().required(),
		password: yup
			.string()
			.required()
			.min(6, "Your passaword has to have at least 6 characters"),
	});
	const initialValues: IRegisterFormValues = {
		username: "",
		email: "",
		password: "",
	};
	const register = (values: IRegisterFormValues) => {
		const { email, username, password } = values;
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				db.collection("users").doc(userCredential.user?.uid).set({
					uid: userCredential.user?.uid,
					username,
					email,
					name: "",
					avatar: null,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<View style={styles.container}>
				<View>
					<Image
						source={require("../assets/logo.png")}
						style={styles.logo}
					/>
				</View>
				<Formik
					initialValues={initialValues}
					onSubmit={(values) => register(values)}
					validationSchema={RegisterFormSchema}
					validateOnMount={true}
				>
					{({ handleChange, handleSubmit, handleBlur, values }) => (
						<View style={styles.formContainer}>
							<TextInput
								placeholder="Email"
								style={styles.input}
								onChangeText={handleChange("email")}
								onBlur={handleBlur("email")}
								value={values.email}
								
							/>
							<TextInput
								placeholder="Username"
								style={styles.input}
								onBlur={handleBlur("username")}
								onChangeText={handleChange("username")}
								value={values.username}
							/>
							<TextInput
								secureTextEntry={true}
								placeholder="Password"
								style={styles.input}
								onBlur={handleBlur("password")}
								onChangeText={handleChange("password")}
							/>

							<View style={styles.btnContainer}>
								<Button
									title="Sign up"
									onPress={
										handleSubmit as unknown as (
											ev: NativeSyntheticEvent<NativeTouchEvent>
										) => void
									}
								/>
							</View>
						</View>
					)}
				</Formik>
				<View style={styles.loginNav}>
					<Text>Already have an account? </Text>
					<TouchableOpacity
						onPress={() => navigation.navigate("Login")}
					>
						<Text style={styles.login}>Log In</Text>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},

	formContainer: {
		marginTop: 20,
	},
	btnContainer: {
		marginVertical: 50,
	},
	logo: {
		width: 80,
		height: 80,
	},
	input: {
		borderWidth: 1,
		borderRadius: 5,
		borderColor: "#8a8a8a",
		backgroundColor: "#e8e8e8",
		marginVertical: 8,
		padding: 6,
		width: wp("90%"),
	},
	loginNav: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	login: {
		color: "#2196F3",
	},
});
