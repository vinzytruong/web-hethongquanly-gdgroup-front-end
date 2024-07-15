import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_ORGANIZATION, DELETE_ORGANIZATION, GET_ALL_ORGANIZATION, UPDATE_ORGANIZATION } from '@/store/organization/action';
import { Organization } from '@/interfaces/organization';
import { addCoQuan, deleteCoQuan, getCoQuan, getCoQuanByUserRole, updateCoQuan } from '@/constant/api';

export default function useOrganization() {
    const dataOrganization = useAppSelector((state) => state.organization)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllOrganization = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getCoQuan, { headers });
                dispatch(GET_ALL_ORGANIZATION({ organization: response.data }))

                setIsLoading(false)
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllOrganization()
    }, [dispatch])
    const getDepartmentByUserRole = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCoQuanByUserRole, { headers });
            dispatch(GET_ALL_ORGANIZATION({ organization: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllOrganization = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCoQuan, { headers });
            dispatch(GET_ALL_ORGANIZATION({ organization: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addOrganization = async (organization: Organization) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addCoQuan, organization, { headers });
            dispatch(ADD_ORGANIZATION({ organization: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateOrganization = async (organization: Organization) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateCoQuan, organization, { headers });
            getAllOrganization()
            // dispatch(UPDATE_ORGANIZATION({ organization: response.data, id: response.data.coQuanID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteOrganization = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            await axios.delete(deleteCoQuan, { params: { id } });
            dispatch(DELETE_ORGANIZATION({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataOrganization, getAllOrganization, addOrganization, updateOrganization, deleteOrganization,getDepartmentByUserRole
    };
}
