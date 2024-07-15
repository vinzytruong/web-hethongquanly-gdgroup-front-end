import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getLoaiDaiLy } from '@/constant/api';
import { GET_ALL_AGENCY_TYPE } from '@/store/agencyType/action';

export default function useAgencyType() {
    const dataAgencyType = useAppSelector((state) => state.agencyType)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     const getAllAgencyType = async () => {
    //         try {
    //             const accessToken = window.localStorage.getItem('accessToken');
    //             const headers = {Authorization: `Bearer ${accessToken}`};
    //             const response = await axios.get(getLoaiDaiLy, { headers });
    //             dispatch(GET_ALL_AGENCY_TYPE({ agencyType: response.data }))
    //             setIsLoading(false)
    //         } catch (e) {
    //             console.error("Error: ", e);
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    //     getAllAgencyType()
    // }, [dispatch])
    useEffect(() => {
        console.log('<<<', dataAgencyType);
        if (dataAgencyType.length === 0) {
            getAllAgency()
        }
    }, [])
    const getAllAgency = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getLoaiDaiLy, { headers });
            dispatch(GET_ALL_AGENCY_TYPE({ agencyType: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataAgencyType, getAllAgency
    };
}
