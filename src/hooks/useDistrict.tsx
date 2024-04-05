import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_BY_PROVINCE_ID, GET_HUYEN_BY_ID } from '@/store/district/action';
import { getHuyenByID, getHuyenByTinhID } from '@/constant/api';

export default function useDistrict() {
    const dataDistrict = useAppSelector((state) => state.district)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getDistrictByProvinceId = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getHuyenByTinhID}/${id}`, { headers });
            dispatch(GET_BY_PROVINCE_ID({ district: response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1) }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getDistrictByID = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getHuyenByID}/${id}`, { headers });
            dispatch(GET_HUYEN_BY_ID({ district: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataDistrict, getDistrictByProvinceId, getDistrictByID
    };
}
