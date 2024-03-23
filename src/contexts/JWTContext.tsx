import { JWTContextType } from "@/interfaces/auth";
import { KeyedObject } from "@/interfaces/object";
import { AppState } from "@/store";
import { LOGIN, LOGOUT } from "@/store/auth/action";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { createContext, useEffect } from "react";

const response = {
    status: 201,
    data: {
        access_token: 'abc',
        account: {
            username: 'vinhtruong',
            role: 'admin'
        }
    }
}

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null, dataResponse?: any | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
        axios.defaults.headers.post['Content-Type'] = "*/*";
        axios.defaults.headers.post['Accept'] = "*/*";
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
        axios.defaults.headers.post['Strict-Origin-When-Cross-Origin'] = "*";
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    const { account, isLoggedIn } = useAppSelector((state: AppState) => state?.auth)
    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                const accountString: any = localStorage.getItem('dataAccount');
                const accountObject = JSON.parse(accountString)
                if (serviceToken) {
                    setSession(serviceToken, accountObject);
                    dispatch(LOGIN({
                        isLoggedIn: true,
                        account: accountObject
                    }));
                    // accountObject.role === 'admin' ? router.push('/admin') : router.push('/customer')
                }
                else {
                    logout();
                }
            } catch (err) {
                console.error(err);
                logout();
            }
        };
        init();
    }, []);

    const login = async (username: string, password: string) => {
        localStorage.setItem('serviceToken', response?.data.access_token);
        localStorage.setItem('dataAccount', JSON.stringify(response?.data.account));
        if (response.status === 201) {
            setSession(response?.data.access_token, response.data.account);
            dispatch(LOGIN({
                isLoggedIn: true,
                account: response.data.account
            }))
            response.data.account.role === 'admin' ? router.push('/admin') : router.push('/customer')
        } else {
            logout()
            throw new Error('Lỗi hệ thống')
        }
    };
    const logout = () => {
        setSession(null, null);
        dispatch(LOGOUT({
            isLoggedIn: false,
        }));
        localStorage.removeItem('serviceToken')
    };
    return (
        <JWTContext.Provider value={{ login, logout, isLoggedIn, account }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;