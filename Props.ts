import {
	BottomTabNavigationProp,
	BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {
	CompositeNavigationProp,
	CompositeScreenProps,
	ParamListBase,
	RouteProp,
} from "@react-navigation/native";
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import Modal from "react-native-modalbox";
import {
	MainStackParamList,
	RootStackParamList,
} from "./screens/RootStackPrams";
import { UserData, UserFollowingPost } from "./store/type";

export type MainScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Main"
>;
export type ProfileScreenNavigationProps = CompositeScreenProps<
	BottomTabScreenProps<MainStackParamList, "Profile">,
	StackScreenProps<RootStackParamList>
>;

export type SearchScreenNavigationProps = CompositeScreenProps<
	BottomTabScreenProps<MainStackParamList, "Search">,
	StackScreenProps<RootStackParamList>
>;
export type loginScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Login"
>;
export type registerScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Register"
>;

export type SavePostScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"SavePost"
>;

export type EditPostScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"EditPost"
>;

export type PostScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Post"
>;

export type ProfileHeaderProps = {
	navigation: CompositeNavigationProp<
		BottomTabNavigationProp<MainStackParamList, "Profile">,
		StackNavigationProp<RootStackParamList, keyof RootStackParamList>
	>;
	route: RouteProp<MainStackParamList, "Profile">;
	currentUser: UserData;
};

export type ProfileEditScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"ProfileEdit"
>;

export type HeaderScreenProps = {
	navigation: BottomTabNavigationProp<ParamListBase, string>;
};

export type PickImageProps = NativeStackScreenProps<
	RootStackParamList,
	"PickImage"
>;

export enum ImageType {
	ProfileImage = "profile",
	PostImage = "post",
}

export type CameraAndGalleryScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, "PickImage">;
	imgType: ImageType;
};

export type ImageAdjustmentProps = {
	image: string;
	setImage: React.Dispatch<React.SetStateAction<string | null>>;
	navigation: NativeStackNavigationProp<RootStackParamList, "PickImage">;
	imgType: ImageType;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type EditHeaderProps = {
	title: string;
	navigation:
		| StackNavigationProp<ParamListBase, string>
		| BottomTabNavigationProp<ParamListBase, string>;
};

export type PostProps = {
	post: UserFollowingPost;
	homeEdit?: React.RefObject<Modal>;
	profileEdit?: React.RefObject<Modal>;
	navigation: any;

};

export type HomeScreenProps = {
	navigation: CompositeNavigationProp<
		BottomTabNavigationProp<MainStackParamList, "Home">,
		StackNavigationProp<RootStackParamList, keyof RootStackParamList>
	>;
};
