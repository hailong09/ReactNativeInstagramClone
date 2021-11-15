import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { postsReducer } from "./postsReducer";

const Reducers = combineReducers({
	user: userReducer,
	posts: postsReducer,
});

export default Reducers;

export type RootState = ReturnType<typeof Reducers>;
