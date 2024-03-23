import { getCurrentUser, isUserLoggedIn, logOutAccount, signInWithEmailPassword, signInWithGooglePopup } from "@/services/authentication";
import { auth } from "@/services/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuth = () => {
    const user = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {

        try {

        } catch (error) {
            console.error('Error checking authentication state:', error);
        }

    }, [dispatch]);

    const logIn = async (email: any, password: any) => {
        try {
            router.push('/home')
        } catch (error) {
            throw error;
        }
    };

    const logOut = async () => {
        try {

        } catch (error) {
            throw error;
        }
    };

    return {
        user,
        loading,
        logIn,
        logOut
    };
};

export default useAuth;