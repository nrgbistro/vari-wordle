import { useContext, createContext, useState, useEffect } from "react";
import supabase from "../supabase";

let AuthContext: any;
AuthContext = createContext(null);

export const AuthContextProvider = ({ children }: { children: any }) => {
	const [user, setUser] = useState({});

	const magicSignIn = async (email: string) => {
		console.log(email);
		try {
			setTimeout(() => {}, 5000);
			const res = await supabase.auth.signInWithOtp({ email });
			console.log(res);
			if (res.data.user) {
				setUser(res.data.user);
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	return (
		<AuthContext.Provider value={{ magicSignIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
