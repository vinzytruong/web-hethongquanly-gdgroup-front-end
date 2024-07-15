import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getLoaiNhaThau } from '@/constant/api';
import { GET_ALL_CONTRACTOR_TYPE } from '@/store/contractorsType/action';
let isCallAPI = false;
export default function useContractorsType() {
    const dataContractorsType = useAppSelector((state) => state.contractorsType)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isCallAPI === false) {
            getAllContractors()
            isCallAPI = true;
        }
    }, [dispatch])

    const getAllContractors = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getLoaiNhaThau, { headers });
            dispatch(GET_ALL_CONTRACTOR_TYPE({ contractorsType: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataContractorsType, getAllContractors
    };
}
