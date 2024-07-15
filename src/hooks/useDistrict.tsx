import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { GET_BY_PROVINCE_ID, GET_HUYEN_BY_ID } from '@/store/district/action';
import { getHuyenByID, getHuyenByTinhID } from '@/constant/api';
import { District } from '@/interfaces/district';

export default function useDistrict(idHuyen?: number, idTinh?: number) {
    const dataDistrict = useAppSelector((state) => state.district)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const [dataDistrictById, setDataDistrictById] = useState<District>()
    const [dataDistrictByTinhId, setDataDistrictByTinhId] = useState<District[]>([])

    useEffect(() => {
        const getDistrictByID = async (id: number) => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getHuyenByID}/${id}`, { headers });
                dispatch(GET_HUYEN_BY_ID({ district: response.data }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        const getDistrictByProvinceId = async (id: number) => {

            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getHuyenByTinhID}/${id}`, { headers });

                setDataDistrictByTinhId(response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1))
                dispatch(GET_BY_PROVINCE_ID({ district: response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1) }))



            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        if (idHuyen !== undefined) getDistrictByID(idHuyen)
        if (idTinh !== undefined) getDistrictByProvinceId(idTinh)
    }, [dispatch, idHuyen, idTinh])

    const getDistrictByProvinceId = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getHuyenByTinhID}/${id}`, { headers });
            setDataDistrictByTinhId(response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1))
            dispatch(GET_BY_PROVINCE_ID({ district: response.data.sort((a: any, b: any) => a.tenHuyen.toUpperCase() <= b.tenHuyen.toUpperCase() ? -1 : 1) }))

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
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataDistrict, dataDistrictById, dataDistrictByTinhId, getDistrictByProvinceId, getDistrictByID
    };
}
