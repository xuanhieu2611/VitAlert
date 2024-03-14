import { GoogleAuthProvider, UserCredential, signInWithPopup, Auth, OAuthCredential, User } from "firebase/auth";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const googleAuthProvider = new GoogleAuthProvider();

const handleSignInError = (error: any) => {
	const errorMessage = error.message;
	const email = error.customData.email;
	if (email != null)
		alert("Could not sign in " + email + ".");
	console.error(errorMessage);
}

const checkOAuthCredential = (cred: OAuthCredential | null, valid: (cred: OAuthCredential) => any) => {
	if (cred == null)
		console.error("Credential has no value, but no error was thrown.");
	else valid(cred);
}

/**
 * Promps sign in with Google in a popup.
 * 
 * @param auth Firebase auth app instance
 */
export const signInGoogle = (auth: Auth) =>
	signInWithPopup(auth, googleAuthProvider).then(
		(result: UserCredential) =>
			checkOAuthCredential(GoogleAuthProvider.credentialFromResult(result),
				(credential) => {
					const token = credential.accessToken;
					const user = result.user;
				})).catch(handleSignInError);


/**
 * 
 * @param auth Firebase auth app instance
 * @returns true if user is signed in, false if user is not signed in, undefined if not sure.
 */
export const useSignIn = (auth: Auth): boolean | undefined => {
	const [foundUser, setFoundUser] = useState<boolean | undefined>(undefined);

	useMemo(() =>
		auth.onAuthStateChanged(user => {
			if (user) setFoundUser(true);
			else setFoundUser(false);
		}), []);

	return foundUser;
};


/**
 * Redirects to root path if there is no user logged in.
 * Use in conjunction with <SignInRequired></SignInRequired> for
 * pages where a user must be logged in.
 * 
 * @param auth Firebase auth app instance
 * @returns User if one is signed in, otherwise null.
 */
export const useRequiredSignIn = (auth: Auth): User | null => {
	const navigate = useNavigate();
	const foundUser = useSignIn(auth);
	const [user, setUser] = useState(auth.currentUser);

	useEffect(() => {
		if (foundUser === false) navigate("/");
		else if (foundUser === true) setUser(auth.currentUser);
	}, [foundUser]);

	return user;
};

/**
 * Only renders children if user is signed in.
 */
export const SignInRequired = (props: React.PropsWithChildren<{
	user: User | null,
	auth: Auth
}>) => {
	return (<>
		{props.user ? props.children : <></>}
	</>);
};