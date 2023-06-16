import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "../index.css";
import store from "./redux/store";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { PersistGate } from "redux-persist/integration/react";

window.global = globalThis;

const persistor = persistStore(store);

if (process.env.NODE_ENV === "production") {
	LogRocket.init("nrgworx/vari-wordle");
	setupLogRocketReact(LogRocket);
}

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
