import {
	useContext,
	createContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

interface IAuthContext {
	googleSignIn: () => void;
}

const googleSignIn = () => {
	const provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider);
};

const defaultState: IAuthContext = {
	googleSignIn,
};
const AuthContext = createContext(defaultState);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState({});

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser !== null) {
				setUser(currentUser);
			} else {
				setUser({});
			}
		});
		return () => unsubscribe();
	}, [user]);

	return (
		<AuthContext.Provider value={{ googleSignIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
