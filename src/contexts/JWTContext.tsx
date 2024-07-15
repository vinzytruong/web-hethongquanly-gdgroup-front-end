
import { authDangKy, authDangNhap } from '@/constant/api';
import { AuthContextType } from '@/interfaces/auth';
import { LOGIN, LOGOUT } from '@/store/auth/action';
import { useAppDispatch } from '@/store/hook';
import axiosCustomize from '@/utils/axios';
import { setSession } from '@/utils/jwt';
import axios from 'axios';
// import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';


// Khởi tạo Context với giá trị mặc định
export const AuthContext = createContext<AuthContextType>({
    login: async (username: string, password: string) => { },
    logout: () => { },
    isAuthenticated: () => true,
    register: async () => { },
});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const dispatch = useAppDispatch()
    const [accessToken, setAccessToken] = useState<any>();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                const accessTokens = window.localStorage.getItem('accessToken');
                setAccessToken(accessTokens)
                const account: any = localStorage.getItem('account');
                if (accessTokens) {
                    setSession(accessTokens, account);
                    dispatch(LOGIN({
                        isLoggedIn: true,
                        account: {
                            username: account.username,
                            role: 'NhanVien',
                            userId: account.userID
                        }
                    }));
                    // accountObject.role === 'admin' ? router.push('/admin') : router.push('/customer')
                }
                else if (router.asPath !== '/auth/login') logout();
            } catch (err) {
                console.error(err);
            }
        };
        init();
    }, [dispatch, accessToken]);

    const login = async (username: string, password: string) => {
        const dataJson = JSON.stringify({ "tenDangNhap": username, "matKhau": password })
        try {
            const response = await axios.post(authDangNhap, dataJson, { headers: { 'Content-Type': 'application/json'} });
            const accessToken = response.data.token;
            const userID = response.data.userID
            const username = response.data.hoVaTen
            setSession(accessToken, JSON.stringify({ userID: userID, username: username }));
            dispatch(LOGIN({
                isLoggedIn: true,
                account: {
                    username: username,
                    role: 'admin',
                    userId: userID
                }
            }));
            router.push('/home')
            if(response.status===200){
                return true
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            return false;
        }
    };

    const logout = () => {
        setSession(null, null);
        dispatch(LOGOUT({
            isLoggedIn: false,
        }));
        localStorage.removeItem('accessToken');
        router.push('/auth/login')
    };

    const isAuthenticated = () => {
        return !accessToken;
    };

    const register = async (data: any) => {
        const dataJson = JSON.stringify(data)
        try {
            const response = await axios.post( authDangKy, dataJson, { headers: { 'Content-Type': 'application/json' } });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            throw error;
        }
    };

    return <AuthContext.Provider
        value={{
            login,
            logout,
            isAuthenticated,
            register,
        }}>
        { children}
    </AuthContext.Provider>;
};
