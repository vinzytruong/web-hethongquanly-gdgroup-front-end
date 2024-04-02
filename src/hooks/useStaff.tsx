import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_ALL } from '@/store/staff/action';

export default function useStaff() {
    const dataStaff = useAppSelector((state) => state.staff)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllStaff = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/NhanVien/GetNhanVien', { headers });

            dispatch(GET_ALL({ staff: response.data }))
            console.log("staff", response.data);

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataStaff, getAllStaff
    };
}
