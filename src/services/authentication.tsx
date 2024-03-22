import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account "
});

// Đăng nhập bằng cách chọn tài khoản
export async function signInWithGooglePopup() {
    return await signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            return user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            return error;
        });
}

// Đăng nhập bằng email và mật khẩu
export const signInWithEmailPassword = async (email: any, password: any) => {
    return await signInWithEmailAndPassword(auth, email, password).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        return user;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return error;
    });
};

export async function logOutAccount() {
    return await signOut(auth).then(() => {
        console.log('Đăng xuất thành công')
    }).catch((error: any) => {
        console.log(error)
    });
}

export async function getCurrentUser() {
    return await onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('Đã đăng nhập');
            return user.uid;
        } else {
            console.log('Chưa đăng nhập');
            return null;
        }
    }); 
}
export function isUserLoggedIn() {
    return !!getCurrentUser();
};

