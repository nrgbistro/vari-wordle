import {useContext, createContext, useEffect, useState} from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import {auth} from "../firebase";

interface IAuthContext {
    googleSignIn: () => void;
}

const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

const defaultState: IAuthContext = {
    googleSignIn,
};
const AuthContext = createContext(defaultState);

export const AuthContextProvider = ({children}: {children: any}) => {
const [user, setUser] = useState({});


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser!);
            console.log(user);
        });
        return () => unsubscribe();
    }, [user])
    
    return (
        <AuthContext.Provider value={{googleSignIn}}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext);
}