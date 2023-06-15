import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const persistor = persistStore(store);

if (process.env.NODE_ENV === "production") {
	LogRocket.init("nrgworx/vari-wordle");
	setupLogRocketReact(LogRocket);
}

root.render(
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
