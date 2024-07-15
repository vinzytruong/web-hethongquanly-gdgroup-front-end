import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_ALL } from '@/store/province/action';
import { getTinh } from '@/constant/api';

export default function useProvince() {
    const dataProvince = useAppSelector((state) => state.province)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllProvince = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}`};
                const response = await axios.get(getTinh, { headers });
                dispatch(GET_ALL({ province: response.data.sort((a:any, b:any) =>a.tenTinh.toUpperCase()<= b.tenTinh.toUpperCase()?-1:1) }))
                setIsLoading(false)
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllProvince()
    }, [dispatch])

    const getAllProvince = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`};
            const response = await axios.get(getTinh, { headers });
            dispatch(GET_ALL({ province: response.data.sort((a:any, b:any) =>a.tenTinh.toUpperCase()<= b.tenTinh.toUpperCase()?-1:1) }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataProvince, getAllProvince
    };
}
