import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_CONTRACTORS, DELETE_CONTRACTORS, GET_ALL, UPDATE_CONTRACTORS } from '@/store/contractors/action';
import { Contractors } from '@/interfaces/contractors';
import { addNhaThau, deleteNhaThau, getNhaThau, updateNhaThau } from '@/constant/api';

export default function useContractors() {
    const dataContractors = useAppSelector((state) => state.contractors)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllContractors = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`};
            const response = await axios.get(getNhaThau, { headers });
            dispatch(GET_ALL({ contractors: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addContractors = async (contractors: Contractors) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addNhaThau, contractors, { headers });
            dispatch(ADD_CONTRACTORS({ contractors: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateContractors = async (contractors: Contractors) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateNhaThau, contractors, { headers });
            dispatch(UPDATE_CONTRACTORS({ contractors: response.data, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    
    const deleteContractors = async (id: number) => {
        try {
            await axios.delete(deleteNhaThau, { params: { id } });
            dispatch(DELETE_CONTRACTORS({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataContractors, getAllContractors, addContractors, updateContractors, deleteContractors
    };
}
