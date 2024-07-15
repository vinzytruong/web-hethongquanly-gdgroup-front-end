import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { getXaByID, getXaByHuyenID } from '@/constant/api';
import { GET_BY_DISTRICT_ID, GET_XA_BY_ID } from '@/store/commune/action';

export default function useCommune(idXa?: number, idHuyen?: number) {
    const dataCommune = useAppSelector((state) => state.commune)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getCommuneByID = async (id: number) => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getXaByID}/${id}`, { headers });
                dispatch(GET_XA_BY_ID({ commune: response.data }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        const getCommuneByDistrictId = async (id: number) => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getXaByHuyenID}/${id}`, { headers });
                dispatch(GET_BY_DISTRICT_ID({ commune: response.data.sort((a: any, b: any) => a.tenXa.toUpperCase() <= b.tenXa.toUpperCase() ? -1 : 1) }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        if (idXa) getCommuneByID(idXa)
        if (idHuyen) getCommuneByDistrictId(idHuyen)
    }, [dispatch, idHuyen, idXa])

    const getCommuneByDistrictId = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getXaByHuyenID}/${id}`, { headers });
            dispatch(GET_BY_DISTRICT_ID({ commune: response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1) }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getCommuneByID = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getXaByID}/${id}`, { headers });
            dispatch(GET_XA_BY_ID({ commune: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataCommune, getCommuneByDistrictId, getCommuneByID
    };
}
