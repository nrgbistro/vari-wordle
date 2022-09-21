import { useContext, createContext } from "react";
import supabase from "../supabase";

let AuthContext: any;
AuthContext = createContext(null);

export const AuthContextProvider = ({ children }: { children: any }) => {
	const googleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: "http://localhost:3000",
			},
		});
	};

	return (
		<AuthContext.Provider value={{ googleSignIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
