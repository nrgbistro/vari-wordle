import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "./slices/wordSlice";

const store = configureStore({ reducer: { word: wordReducer } });

export type RootState = ReturnType<typeof store.getState>;

export default store;
