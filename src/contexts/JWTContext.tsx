
import { AuthContextType } from '@/interfaces/auth';
import { LOGIN } from '@/store/auth/action';
import { useAppDispatch } from '@/store/hook';
import { setSession } from '@/utils/jwt';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';


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

    const headers = {
        'Content-Type': 'application/json',

    }

    const login = async (username: string, password: string) => {
        const data = {
            "tenDangNhap": username,
            "matKhau": password
        }
        const dataJson = JSON.stringify(data)
        try {
            const response = await axios.post('http://192.168.50.238:8899/api/NguoiDung/DangNhap', dataJson, { headers: headers });
            const accessToken = response.data.token;
            setSession(accessToken);
            dispatch(LOGIN({
                isLoggedIn: true,
                account: accessToken
            }));
            router.push('/home')

        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            throw error;
        }
    };

    const logout = () => {
        setAccessToken(null);
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

    return <AuthContext.Provider value={{
        login,
        logout,
        isAuthenticated,
        apiCall,
    }}>{children}</AuthContext.Provider>;
};
