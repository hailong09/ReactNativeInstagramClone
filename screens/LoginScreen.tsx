import React from "react";
import {
	Button,
	Image,
	NativeSyntheticEvent,
	NativeTouchEvent,
	StyleSheet,
	TextInput,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	Pressable,
	Text,
} from "react-native";
import { Formik } from "formik";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as yup from "yup";
import firebase from "firebase";
import { loginScreenProps } from "../Props";
interface ILoginFormValues {
	email: string;
	password: string;
}

const LoginScreen = ({ navigation }: loginScreenProps) => {
	const initialValues: ILoginFormValues = { email: "", password: "" };
	const LoginFormSchema = yup.object().shape({
		email: yup.string().required(),
		password: yup.string().required(),
	});

	const login = async (values: ILoginFormValues) => {
		try {
			const { email, password } = values;
			await firebase.auth().signInWithEmailAndPassword(email, password);
		} catch (error) {
			console.log(error);
		}
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
					onSubmit={(values) => login(values)}
					validationSchema={LoginFormSchema}
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
								secureTextEntry={true}
								placeholder="Password"
								style={styles.input}
								onBlur={handleBlur("password")}
								onChangeText={handleChange("password")}
							/>
							<View style={styles.forgotPasswordContainer}>
								<Pressable>
									<Text style={styles.forgotPasswordText}>
										Forgot password?
									</Text>
								</Pressable>
							</View>
							<View style={styles.btnContainer}>
								<Button
									title="Log In"
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
				<View style={styles.registerNav}>
					<Text>Don't have an account? </Text>
					<TouchableOpacity
						onPress={() => navigation.navigate("Register")}
					>
						<Text style={styles.signUp}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default LoginScreen;

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
	forgotPasswordText: {
		fontSize: 12,
		color: "#2196F3",
	},
	forgotPasswordContainer: {
		alignItems: "flex-end",
	},
	registerNav: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	signUp: {
		color: "#2196F3",
	},
});
