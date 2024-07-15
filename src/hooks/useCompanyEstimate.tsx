import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_COMPANYESTIMATES, DELETE_COMPANYESTIMATES, GET_ALL, UPDATE_COMPANYESTIMATES } from '@/store/companyEstimate/action';
import { CompanyEstimates } from '@/interfaces/companyEstimates';
import { addCompanyEstimate, deleteCompanyEstimate, getCompanyEstimate, updateCompanyEstimate } from '@/constant/api';

export default function useCompanyEstimate() {
    const dataCompanyEstimates = useAppSelector((state) => state.companyEstimates)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllCompanyEstimates = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getCompanyEstimate, { headers });

                dispatch(GET_ALL({ companyEstimates: response.data }))
                setIsLoading(false)
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllCompanyEstimates()
    }, [dispatch])

    const getAllCompanyEstimates = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCompanyEstimate, { headers });
            dispatch(GET_ALL({ companyEstimates: response.data }))
            setIsLoading(false)
        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }

    const addCompanyEstimates = async (companyEstimates: CompanyEstimates) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addCompanyEstimate, companyEstimates, { headers });
            // dispatch(ADD_COMPANYESTIMATES({ companyEstimates: response.data }))
            getAllCompanyEstimates()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const updateCompanyEstimates = async (companyEstimates: CompanyEstimates) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateCompanyEstimate, companyEstimates, { headers });
            getAllCompanyEstimates()
            // dispatch(UPDATE_COMPANYESTIMATES({ companyEstimates: dataCompanyEstimates, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCompanyEstimates = async (id: number) => {
        try {
            await axios.delete(deleteCompanyEstimate, { params: { id } });
            dispatch(DELETE_COMPANYESTIMATES({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataCompanyEstimates, getAllCompanyEstimates, addCompanyEstimates, updateCompanyEstimates, deleteCompanyEstimates
    };
}
