
import { AuthContextType } from '@/interfaces/auth';
import { LOGIN, LOGOUT } from '@/store/auth/action';
import { useAppDispatch } from '@/store/hook';
import { setSession } from '@/utils/jwt';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';


// Khởi tạo Context với giá trị mặc định
export const AuthContext = createContext<AuthContextType>({
    login: async (username: string, password: string) => { },
    logout: () => { },
    isAuthenticated: () => false,
    apiCall: async (url: any, method?: string, data?: null) => { },
});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const dispatch = useAppDispatch()
    const [accessToken, setAccessToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const account: any = localStorage.getItem('account');

                if (accessToken) {
                    setSession(accessToken, account);
                    dispatch(LOGIN({
                        isLoggedIn: true,
                        account: {
                            username: account.username,
                            role: 'admin',
                            userId: account.userID
                        }
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
        const dataJson = JSON.stringify({ "tenDangNhap": username, "matKhau": password})
        try {
            const response = await axios.post('http://192.168.50.238:8899/api/NguoiDung/DangNhap', dataJson, { headers: { 'Content-Type': 'application/json' } });
            const accessToken = response.data.token;
            const userID = response.data.userID
            const username = response.data.hoVaTen
            setSession(accessToken, JSON.stringify({ userID: userID, username:username }));
            dispatch(LOGIN({
                isLoggedIn: true,
                account: {
                    username: username,
                    role: 'admin',
                    userId: userID
                }
            }));
            router.push('/home')

        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            throw error;
        }
    };

    const logout = () => {
        setSession(null,null);
        dispatch(LOGOUT({
            isLoggedIn: false,
        }));
        localStorage.removeItem('accessToken');
        router.push('/auth')
    };

    const isAuthenticated = () => {
        return !!accessToken;
    };

    const apiCall = async (url: any, method = 'get', data = null) => {
        try {
            const config = {
                method,
                url,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                data,
            };
            const response = await axios(config);
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
            apiCall,
        }}>
        {children}
    </AuthContext.Provider>;
};
