import { useContext, createContext, useState } from "react";
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

	// supabase.auth.onAuthStateChange((event, session) => {
	// 	if (session?.user !== undefined) {
	// 		const metadata = session.user.user_metadata;
	// 		const newUser = {
	// 			email: metadata.email,
	// 			avatar: metadata.avatar_url,
	// 			name: metadata.full_name,
	// 		};
	// 		setUser(newUser);
	// 	}
	// });

	return (
		<AuthContext.Provider value={{ googleSignIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
