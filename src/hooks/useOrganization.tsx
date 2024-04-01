import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_ORGANIZATION, DELETE_ORGANIZATION, GET_ALL, UPDATE_ORGANIZATION } from '@/store/organization/action';
import { Organization } from '@/interfaces/organization';

export default function useOrganization() {
    const dataOrganization = useAppSelector((state) => state.organization)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllOrganization = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/NSCoQuan/GetCoQuan', { headers });

            dispatch(GET_ALL({ organization: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addOrganization = async (organization: Organization) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/NSCoQuan/AddCoQuan',
                organization
                , { headers });

            dispatch(ADD_ORGANIZATION({ organization: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateOrganization = async (organization: Organization) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.put('http://192.168.50.238:8899/api/NSCoQuan/UpdateCoQuan',
                organization
                , { headers });
            

            dispatch(UPDATE_ORGANIZATION({ organization: response.data, id: response.data.coQuanID }))
            console.log("updateCoquan", dataOrganization);
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteOrganization = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.delete(`http://192.168.50.238:8899/api/NSCoQuan/DeleteCoQuan`, { params: { id } });

            dispatch(DELETE_ORGANIZATION({ id }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataOrganization, getAllOrganization, addOrganization, updateOrganization, deleteOrganization
    };
}
