import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_CONTRACTORS, DELETE_CONTRACTORS, GET_ALL, UPDATE_CONTRACTORS } from '@/store/contractors/action';
import { Contractors } from '@/interfaces/contractors';
import { addNhaThau, deleteNhaThau, getNhaThau, updateNhaThau } from '@/constant/api';
let isCallAPI = false;
export default function useContractors() {
    const dataContractors = useAppSelector((state) => state.contractors)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isCallAPI === false) {
            getAllContractors()
            isCallAPI = true;
        }
    }, [])

    const getAllContractors = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getNhaThau, { headers });

            // Parse JSON strings in response data
            const contractors = response.data.map((item: Contractors) => {

                let parsedNhanVienPhuTrach = [];
                try {
                    const parsed = JSON.parse(item.nhanVienPhuTrach);
                    // Check if the parsed result is an array
                    parsedNhanVienPhuTrach = Array.isArray(parsed) ? parsed : [];
                } catch (error) {
                    // Handle parsing error gracefully
                    parsedNhanVienPhuTrach = [];
                }

                // Return the modified item object with parsed nhanVienPhuTrach
                return {
                    ...item,
                    listNhanVienPhuTrach: parsedNhanVienPhuTrach
                };
            });

            dispatch(GET_ALL({ contractors: contractors }))
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
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const updateContractors = async (contractors: Contractors) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateNhaThau, contractors, { headers });
            console.log("updatedItems_hook", response.data);
            getAllContractors()
            // dispatch(UPDATE_CONTRACTORS({ contractors: dataContractors, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
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
    const deleteMulContractors = async (ids: number[]) => {
        ids.map(async (id) => {
            try {
                await axios.delete(deleteNhaThau, { params: { id } });
                dispatch(DELETE_CONTRACTORS({ id }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        })

    }
    return {
        isLoadding, dataContractors, getAllContractors, addContractors, updateContractors, deleteContractors, deleteMulContractors
    };
}
