import { AuthContext } from "@/contexts/JWTContext";
import { getCurrentUser, isUserLoggedIn, logOutAccount, signInWithEmailPassword, signInWithGooglePopup } from "@/services/authentication";
import { auth } from "@/services/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error('context must be use inside provider');

    return context;
};

export default useAuth;