import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_COMPANY, DELETE_COMPANY, GET_ALL, UPDATE_COMPANY } from '@/store/companys/action';
import { Companys } from '@/interfaces/companys';
import { addCompanys, deleteCompanys, getCompanys, getCompany, updateCompanys } from '@/constant/api';


export default function useCompanys() {
    const dataCompanys = useAppSelector((state) => state.companys)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllCompanys = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getCompanys, { headers });
                dispatch(GET_ALL({ companys: response.data }))

            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllCompanys()
    }, [dispatch])

    const getAllCompanys = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCompanys, { headers });
            dispatch(GET_ALL({ companys: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getCompanyById = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCompany + `/${id}`, { headers });
            console.log(response);
            return response.data
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateCompany = async (contractors: Companys) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateCompanys, contractors, { headers });
            dispatch(UPDATE_COMPANY({ companys: contractors }))
            return response.status === 200
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const addCompany = async (contractors: Companys) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addCompanys, contractors, { headers });
            dispatch(ADD_COMPANY({ companys: response.data }))
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCompany = async (id: number) => {
        try {
            await axios.delete(deleteCompanys, { params: { id } });
            dispatch(DELETE_COMPANY({ id }))
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false;
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulCompany = async (ids: number[]) => {
        let flag = true
        ids.map(async (id) => {
            try {
                await axios.delete(deleteCompanys, { params: { id } });
                dispatch(DELETE_COMPANY({ id }))
            } catch (e) {
                console.error("Error: ", e);
                flag = false;
            } finally {
                setIsLoading(false)
            }
        })
        return flag;
    }

    return {
        isLoadding, dataCompanys, getAllCompanys, addCompany, getCompanyById, updateCompany, deleteCompany, deleteMulCompany
    };
}
