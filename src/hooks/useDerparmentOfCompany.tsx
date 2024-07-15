import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_DEPARTMENT_OF_COMPANY, DELETE_DEPARTMENT_OF_COMPANY, GET_ALL, UPDATE_DEPARTMENT_OF_COMPANY, GET_DERPARMENT_OF_COMPANY } from '@/store/derparmentOfCompany/action';
import axios from 'axios';

import { addDepartmentOfCompany, deleteDepartmentOfCompany, getCoQuanByUserRole, getDepartment, getDepartmentById, getDepartmentOfCompany, updateDepartmentOfCompany } from '@/constant/api';
import { DerparmentOfCompany } from '@/interfaces/derparmentOfCompany';

export default function useDerparmentOfCompany() {
    const dataDepartmentOfCompany = useAppSelector((state) => state.derparmentOfCompany)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllDepartment = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getDepartment, { headers });
            dispatch(GET_ALL({ derparmentOfCompany: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllDepartmentOfCompany = async (id: number) => {
        // console.log("d",id);

        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getDepartmentOfCompany + `/${id}`, { headers });
            dispatch(GET_DERPARMENT_OF_COMPANY({ derparmentOfCompany: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getDepartmentOfCompanyById = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getDepartmentById + `/${id}`, { headers });
            console.log(response);
            return response.data
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addDepartmentOfCompanys = async (contractors: DerparmentOfCompany) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addDepartmentOfCompany, contractors, { headers });
            dispatch(ADD_DEPARTMENT_OF_COMPANY({ derparmentOfCompany: response.data }))
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateDepartmentOfCompanys = async (contractors: DerparmentOfCompany) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateDepartmentOfCompany, contractors, { headers });
            dispatch(UPDATE_DEPARTMENT_OF_COMPANY({ derparmentOfCompany: contractors }))
            return response.status === 200
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deleteDepartmentOfCompanys = async (id: number) => {
        try {
            await axios.delete(deleteDepartmentOfCompany, { params: { id } });
            dispatch(DELETE_DEPARTMENT_OF_COMPANY({ id }))
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false;
        } finally {
            setIsLoading(false)
        }
    }
    return {
        isLoadding,
        dataDepartmentOfCompany,
        getAllDepartment,
        getDepartmentOfCompanyById,
        getAllDepartmentOfCompany,
        addDepartmentOfCompanys,
        updateDepartmentOfCompanys,
        deleteDepartmentOfCompanys
    };
}
