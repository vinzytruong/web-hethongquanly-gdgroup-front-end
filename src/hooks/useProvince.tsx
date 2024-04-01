import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_ALL } from '@/store/province/action';

export default function useProvince() {
    const dataProvince = useAppSelector((state) => state.province)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllProvince = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/Tinh/GetTinh', { headers });
            
            dispatch(GET_ALL({ province: response.data.sort((a:any, b:any) =>a.tenTinh.toUpperCase()<= b.tenTinh.toUpperCase()?-1:1) }))
           
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataProvince, getAllProvince
    };
}
