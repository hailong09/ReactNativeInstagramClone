import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraAndGalleryScreenProps } from "../Props";
import ImageAdjustment from "../components/ImageAdjustment";
const GalleryScreen = ({
	navigation,
	imgType,
}: CameraAndGalleryScreenProps) => {
	const [hasGalleryPermission, setHasGalleryPermission] = useState<
		boolean | null
	>(null);
	const [image, setImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	useEffect(() => {
		(async () => {
			if (hasGalleryPermission === null) {
				const { status: galleryStatus } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				setHasGalleryPermission(galleryStatus === "granted");
			}
		})();
	}, []);

	if (!isLoading) {
		if (hasGalleryPermission === false) {
			return <Text>No access to gallery</Text>;
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
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Button title="Choose Image" onPress={() => pickImage()} />
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

export default GalleryScreen;
