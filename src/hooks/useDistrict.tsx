import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_BY_PROVINCE_ID } from '@/store/district/action';

export default function useDistrict() {
    const dataDistrict = useAppSelector((state) => state.district)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getDistrictByProvinceId = async (id:number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get(`http://192.168.50.238:8899/api/Huyen/GetHuyenByTinhID/${id}`, { headers });
            
            dispatch(GET_BY_PROVINCE_ID({ district: response.data.sort((a:any, b:any) =>a.tenHuyen.toUpperCase()<= b.tenHuyen.toUpperCase()?-1:1) }))
           
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataDistrict, getDistrictByProvinceId
    };
}
