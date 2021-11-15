import { TypedUseSelectorHook, useSelector } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer, { RootState } from "./reducers/index";

export const store = createStore(rootReducer, {}, applyMiddleware(thunk));
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector