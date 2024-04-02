import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_SUPPLIER, DELETE_SUPPLIER, GET_ALL, UPDATE_SUPPLIER } from '@/store/supplier/action';
import { Supplier } from '@/interfaces/supplier';

export default function useSupplier() {
    const dataSupplier = useAppSelector((state) => state.supplier)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllSupplier = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/NhaCungCap/GetNhaCungCap', { headers });

            dispatch(GET_ALL({ supplier: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addSupplier = async (supplier: Supplier) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/NhaCungCap/AddNhaCungCap',
                supplier
                , { headers });

            dispatch(ADD_SUPPLIER({ supplier: response.data }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateSupplier = async (supplier: Supplier) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.put('http://192.168.50.238:8899/api/NhaCungCap/UpdateNhaCungCap',
                supplier
                , { headers });
            

            dispatch(UPDATE_SUPPLIER({ supplier: response.data, id: response.data.nhaCungCapID }))
            console.log("updateCoquan", dataSupplier);
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteSupplier = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.delete(`http://192.168.50.238:8899/api/NhaCungCap/DeleteNhaCungCap`, { params: { id } });

            dispatch(DELETE_SUPPLIER({ id }))

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, dataSupplier, getAllSupplier, addSupplier, updateSupplier, deleteSupplier
    };
}
