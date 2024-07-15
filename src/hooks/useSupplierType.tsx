import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { GET_ALL_SUPPLIER_TYPE } from '@/store/supplierType/action';
import { getLoaiNhaCungCap } from '@/constant/api';

export default function useSupplierType() {
    const dataSupplierType = useAppSelector((state) => state.supplierType)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const getAllSupplierType = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = {Authorization: `Bearer ${accessToken}`};
                const response = await axios.get(getLoaiNhaCungCap, { headers });
                dispatch(GET_ALL_SUPPLIER_TYPE({ supplierType: response.data }))
                setIsLoading(false)
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllSupplierType()
    }, [dispatch])

    const getAllSupplier = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`};
            const response = await axios.get(getLoaiNhaCungCap, { headers });
            dispatch(GET_ALL_SUPPLIER_TYPE({ supplierType: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataSupplierType, getAllSupplier
    };
}
