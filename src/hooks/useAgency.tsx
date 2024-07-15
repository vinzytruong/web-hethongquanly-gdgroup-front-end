import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_AGENCY, DELETE_AGENCY, GET_ALL, UPDATE_AGENCY } from '@/store/agency/action';
import { Agency } from '@/interfaces/agency';
import { addDaiLy, deleteDaiLy, getDaiLy, updateDaiLy } from '@/constant/api';

export default function useAgency() {
    const dataAgency = useAppSelector((state) => state.agency)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     const getAllAgency = async () => {
    //         try {
    //             const accessToken = window.localStorage.getItem('accessToken');
    //             const headers = {Authorization: `Bearer ${accessToken}`};
    //             const response = await axios.get(getDaiLy, { headers });
    //             dispatch(GET_ALL({ agency: response.data }))
    //             setIsLoading(false)
    //         } catch (e) {
    //             console.error("Error: ", e);
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    //     getAllAgency()
    // }, [dispatch])
    useEffect(() => {
        console.log('<<<', dataAgency);
        if (dataAgency.length === 0) {
            getAllAgency()
        }
    }, [])
    const getAllAgency = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getDaiLy, { headers });
            dispatch(GET_ALL({ agency: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addAgency = async (agency: Agency) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addDaiLy, agency, { headers });
            dispatch(ADD_AGENCY({ agency: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateAgency = async (agency: Agency) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateDaiLy, agency, { headers });
            console.log("updatedItems_hook", response.data);
            getAllAgency()
            // dispatch(UPDATE_AGENCY({ agency: dataAgency, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteAgency = async (id: number) => {
        try {
            await axios.delete(deleteDaiLy, { params: { id } });
            dispatch(DELETE_AGENCY({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataAgency, getAllAgency, addAgency, updateAgency, deleteAgency
    };
}
