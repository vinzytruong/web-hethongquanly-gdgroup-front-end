import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_SUPPLIER, DELETE_SUPPLIER, GET_ALL, UPDATE_SUPPLIER } from '@/store/supplier/action';
import { Supplier } from '@/interfaces/supplier';
import { addNhaCungCap, deleteNhaCungCap, getNhaCungCap, updateNhaCungCap } from '@/constant/api';

export default function useSupplier() {
    const dataSupplier = useAppSelector((state) => state.supplier)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllSupplier = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`};
            const response = await axios.get(getNhaCungCap, { headers });
            dispatch(GET_ALL({ supplier: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    
    const addSupplier = async (supplier: Supplier) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};
            const response = await axios.post(addNhaCungCap,  supplier , { headers });
            dispatch(ADD_SUPPLIER({ supplier: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateSupplier = async (supplier: Supplier) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json'};
            const response = await axios.put(updateNhaCungCap,supplier, { headers });
            dispatch(UPDATE_SUPPLIER({ supplier: response.data, id: response.data.nhaCungCapID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSupplier = async (id: number) => {
        try {
            await axios.delete(deleteNhaCungCap, { params: { id } });
            dispatch(DELETE_SUPPLIER({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataSupplier, getAllSupplier, addSupplier, updateSupplier, deleteSupplier
    };
}
