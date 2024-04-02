import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_CONTRACTORS, DELETE_CONTRACTORS, GET_ALL, UPDATE_CONTRACTORS } from '@/store/contractors/action';
import { Contractors } from '@/interfaces/contractors';

export default function useContractors() {
    const dataContractors = useAppSelector((state) => state.contractors)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllContractors = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/NhaThau/GetNhaThau', { headers });

            dispatch(GET_ALL({ contractors: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addContractors = async (contractors: Contractors) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/NhaThau/AddNhaThau',
                contractors
                , { headers });

            dispatch(ADD_CONTRACTORS({ contractors: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateContractors = async (contractors: Contractors) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.put('http://192.168.50.238:8899/api/NhaThau/UpdateNhaThau',
                contractors
                , { headers });
            

            dispatch(UPDATE_CONTRACTORS({ contractors: response.data, id: response.data.nhaThauID }))
            console.log("updateCoquan", dataContractors);
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteContractors = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.delete(`http://192.168.50.238:8899/api/NhaThau/DeleteNhaThau`, { params: { id } });

            dispatch(DELETE_CONTRACTORS({ id }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataContractors, getAllContractors, addContractors, updateContractors, deleteContractors
    };
}
