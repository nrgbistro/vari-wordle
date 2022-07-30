import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "./slices/wordSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const reducers = combineReducers({
	word: wordReducer,
});

const persistConfig = {
	key: "root",
	storage: storage,
	// Turn off persistence for development
	...(process.env.NODE_ENV !== "production" ? { blacklist: ["word"] } : {}),
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== "production",
	middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
