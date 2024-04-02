import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_OFFICERS, DELETE_OFFICERS, GET_ALL, UPDATE_OFFICERS } from '@/store/officers/action';
import { Officers } from '@/interfaces/officers';

export default function useOfficers() {
    const dataOfficers = useAppSelector((state) => state.officers)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllOfficers = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/NSCanBo/GetCanBo', { headers });

            dispatch(GET_ALL({ officers: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addOfficers = async (officers: Officers, coQuanID: number | undefined) => {
        try {
            const objOfficers = {
                ...officers,
                coQuanID: coQuanID,
                active: true,
                nsCoQuan: null
            }
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/NSCanBo/AddCanBo',
                objOfficers
                , { headers });

            dispatch(ADD_OFFICERS({ officers: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateOfficers = async (officers: Officers) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.put('http://192.168.50.238:8899/api/NSCanBo/UpdateCanBo',
                officers
                , { headers });


            dispatch(UPDATE_OFFICERS({ officers: response.data, id: response.data.coQuanID }))
            console.log("updateCoquan", dataOfficers);
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteOfficers = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.delete(`http://192.168.50.238:8899/api/NSCanBo/DeleteNSCanBo`, { params: { id } });

            dispatch(DELETE_OFFICERS({ id }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataOfficers, getAllOfficers, addOfficers, updateOfficers, deleteOfficers
    };
}
