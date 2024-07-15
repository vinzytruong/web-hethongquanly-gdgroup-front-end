import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_CONTRACTORINTERACTIONS, DELETE_CONTRACTORINTERACTIONS, GET_ALL, UPDATE_CONTRACTORINTERACTIONS } from '@/store/contractorInteraction/action';
import { ContractorInteractions } from '@/interfaces/contractorInteraction';
import { getContractorInteraction, deleteContractorInteraction, updateContractorInteraction, addContractorInteraction, getAllContractorInteractionsByContractor } from '@/constant/api';
let isCallAPI = false
export default function useContractorInteractions() {
    const dataContractorInteractions = useAppSelector((state: any) => state.contractorInteractions)
    const [isLoadding, setIsLoading] = useState(true);
    const [getAll, setGetAll] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isCallAPI === false) {
            getAllContractorInteractions()
            setGetAll(true)
        }
    }, [])

    const getAllContractorInteractions = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getContractorInteraction, { headers });


            const contractors = response.data.map((item: ContractorInteractions) => {

                let parsedNhanVienPhuTrach;
                try {
                    parsedNhanVienPhuTrach = JSON.parse(item.canBoTiepXuc);
                } catch (error) {
                    parsedNhanVienPhuTrach = []; // Handle parsing error gracefully
                }

                // Return the modified item object with parsed nhanVienPhuTrach
                return {
                    ...item,
                    listCanBoTiepXuc: parsedNhanVienPhuTrach
                };
            });
            dispatch(GET_ALL({ contractorInteractions: contractors }))
            setIsLoading(false)
        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }
    const callGetAllContractorInteractionsByContractor = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getAllContractorInteractionsByContractor + '?nhaThauID=' + id, { headers });

            dispatch(GET_ALL({ contractorInteractions: response.data }))
            setIsLoading(false)
        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }
    const addContractorInteractions = async (contractorInteractions: ContractorInteractions) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addContractorInteraction, contractorInteractions, { headers });
            // dispatch(ADD_CONTRACTORINTERACTIONS({ contractorInteractions: response.data }))
            getAllContractorInteractions()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const updateContractorInteractions = async (contractorInteractions: ContractorInteractions) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateContractorInteraction, contractorInteractions, { headers });
            // dispatch(UPDATE_CONTRACTORINTERACTIONS({ contractorInteractions: dataContractorInteractions, id: response.data.nhaThauID }))

            getAllContractorInteractions()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const deleteContractorInteractions = async (id: number) => {
        alert(21);
        try {
            await axios.delete(deleteContractorInteraction, { params: { id } });
            dispatch(DELETE_CONTRACTORINTERACTIONS({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataContractorInteractions, getAllContractorInteractions, addContractorInteractions, updateContractorInteractions, deleteContractorInteractions
    };
}
