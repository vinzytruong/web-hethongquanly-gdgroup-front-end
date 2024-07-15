import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { GET_ALL_REPORT_PROJECT_INTERACT } from '@/store/reportProjectInteract/action';
import { getReportCoQuan } from '@/constant/api';
import { convertStringToDate } from '@/utils/convertStringToDate';

export default function useReportProjectInteract(id?: any) {
    const dataReportProjectInteract = useAppSelector((state) => state.reportProjectInteract)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllReportProjectInteract = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getReportCoQuan, { headers });
                console.log("responseData", response.data);

                dispatch(GET_ALL_REPORT_PROJECT_INTERACT({ reportProjectInteract: response.data.sort((a: any, b: any) => convertStringToDate(a.thoiGian) <= convertStringToDate(b.thoiGian) ? 1 : -1) }))


            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllReportProjectInteract()

    }, [dispatch])
    const getAllReportProjectInteract = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getReportCoQuan, { headers });
            console.log("responseData", response.data);
            dispatch(GET_ALL_REPORT_PROJECT_INTERACT({ reportProjectInteract: response.data.sort((a: any, b: any) => convertStringToDate(a.thoiGian) <= convertStringToDate(b.thoiGian) ? 1 : -1) }))


        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding,
        dataReportProjectInteract,
        getAllReportProjectInteract,
    };
}
