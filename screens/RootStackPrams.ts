import { NavigatorScreenParams } from "@react-navigation/native";
import { ImageType } from "../Props";

export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Main: NavigatorScreenParams<MainStackParamList>;
	SavePost: {
		image: string;
	};

	ProfileEdit: {
		uid: string;
	};

	Camera: undefined;
	Gallery: undefined;
	PickImage: {
		imageType: ImageType;
	};

	Post: {
		id: string;
		uid: string;
	};

	EditPost: {
		id: string
	}
};

export type MainStackParamList = {
	Home: undefined;
	Search: undefined;
	Profile: {
		uid: string;
	};
};
