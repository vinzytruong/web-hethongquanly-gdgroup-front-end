import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_OFFICERS, DELETE_OFFICERS, GET_ALL, UPDATE_OFFICERS } from '@/store/officers/action';
import { Officers } from '@/interfaces/officers';
import { addCanBo, deleteCanBo, getCanBo, getCanBoByCoQuanID, updateCanBo } from '@/constant/api';
import useOrganization from './useOrganization';

export default function useOfficers() {
    const dataOfficers = useAppSelector((state) => state.officers)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllOfficers = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCanBo, { headers });
            dispatch(GET_ALL({ officers: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getOfficersByOrganizationID = async (id: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            if (id) {
                const response = await axios.get(getCanBoByCoQuanID + `/${id}`, { headers });
                dispatch(GET_ALL({ officers: response.data }))
            }
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
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addCanBo, objOfficers, { headers });
            dispatch(ADD_OFFICERS({ officers: response.data }))
            if(response?.status!==200){
                return false
            }
            return true
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateOfficers = async (officers: Officers) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateCanBo, officers, { headers });
            if(response?.status!==200){
                return false
            }
            return true
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            getAllOfficers()
            setIsLoading(false)
        }
    }

    const deleteOfficers = async (id: number) => {
        try {
            let response = await axios.delete(deleteCanBo, { params: { id } });
            dispatch(DELETE_OFFICERS({ id }))
            setIsLoading(false)
            return response.status
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataOfficers, getAllOfficers, addOfficers, updateOfficers, deleteOfficers, getOfficersByOrganizationID
    };
}
