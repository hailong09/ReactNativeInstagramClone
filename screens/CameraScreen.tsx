import { useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";
import { widthPercentageToDP } from "react-native-responsive-screen";
import ImageAdjustment from "../components/ImageAdjustment";
import { CameraAndGalleryScreenProps } from "../Props";

const CameraScreen = ({ navigation, imgType }: CameraAndGalleryScreenProps) => {
	const isFocused = useIsFocused();
	const [hasCameraPermission, setHasCameraPermission] = useState<
		boolean | null
	>(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	// const [camera, setCamera] = useState<Camera | null>(null);
	const camera = useRef<Camera | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const rotateValue = useRef(new Animated.Value(0)).current;
	const [isLoading, setIsLoading] = useState(false);
	const spin = rotateValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["180deg", "0deg"],
	});

	const takePicture = async () => {
		if (camera) {
			const data = await camera.current?.takePictureAsync();
			setImage(data?.uri as string);
		}
	};

	const flipImage = () => {
		setType(
			type === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);

		rotateValue.setValue(0);
		Animated.timing(rotateValue, {
			toValue: 1,
			duration: 950,
			easing: Easing.circle,
			useNativeDriver: true,
		}).start();
	};

	useEffect(() => {
		(async () => {
			try {
				const { status: cameraStatus } =
					await Camera.requestPermissionsAsync();
				setHasCameraPermission(cameraStatus === "granted");
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	if (!isLoading) {
		if (hasCameraPermission === null) {
			return <View />;
		}

		if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		}

		if (image) {
			return (
				<ImageAdjustment
					image={image}
					setImage={setImage}
					navigation={navigation}
					imgType={imgType}
					setIsLoading={setIsLoading}
				/>
			);
		}

		return (
			<View>
				<View style={styles.cameraContainer}>
					{isFocused && (
						<Camera
							ref={(ref) => (camera.current = ref)}
							type={type}
							ratio={"1:1"}
							style={styles.fixedRatio}
						>
							<TouchableOpacity
								style={{
									backgroundColor: "transparent",
									backfaceVisibility: "hidden",
									width: widthPercentageToDP("15%"),
								}}
								onPress={() => flipImage()}
							>
								<Animated.View
									style={{ transform: [{ rotate: spin }] }}
								>
									<Icon
										type="material-community"
										name="cached"
										size={30}
										color={"white"}
										style={{ margin: 8 }}
									/>
								</Animated.View>
							</TouchableOpacity>
						</Camera>
					)}
				</View>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						marginTop: 35,
					}}
				>
					<TouchableOpacity
						style={{
							padding: 4,
							backgroundColor: "grey",
							borderRadius: 50,
						}}
						onPress={() => takePicture()}
					>
						<Icon
							type="material-community"
							name="circle"
							size={60}
							color={"white"}
							style={{ margin: 4 }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<ActivityIndicator color="#555555" size="large" />
		</View>
	);
};

export default CameraScreen;

const styles = StyleSheet.create({
	cameraContainer: {
		flexDirection: "row",
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1,
		justifyContent: "flex-end",
	},
});
