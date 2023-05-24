import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "./slices/wordSlice";
import statisticsReducer from "./slices/statisticsSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunkMiddleware from "redux-thunk";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

const wordPersistConfig = {
	key: "word",
	storage,
	// Turn off persistence for development
	...(process.env.NODE_ENV !== "production" ? { blacklist: ["word"] } : {}),
};

const statsPersistConfig = {
	key: "statistics",
	storage,
	blacklist: ["*"],
};

const rootReducer = combineReducers({
	word: persistReducer(wordPersistConfig, wordReducer),
	statistics: persistReducer(statsPersistConfig, statisticsReducer),
});

const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== "production",
	middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
