import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "../index.css";
import store from "./redux/store";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

declare global {
	interface Window {
		global: typeof globalThis;
	}
}

window.global = globalThis;

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<div className="text-black dark:text-white dark:bg-gray-800">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</div>
	</React.StrictMode>
);
