import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PRODUCTTYPES, DELETE_PRODUCTTYPES, GET_ALL, UPDATE_PRODUCTTYPES } from '@/store/productTypes/action';
import { Products } from '@/interfaces/products';
import { addProductType, deleteProductType, getProductType, updateProductType } from '@/constant/api';
import { ProductTypes } from '@/interfaces/productTypes';
let isCallAPI = false;
export default function useProductTypes() {
    const dataProductTypes = useAppSelector((state) => state.productTypes)
    const [isLoadding, setIsLoading] = useState(true);
    const [getAll, setGetAll] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isCallAPI === false) {
            getAllProductTypes()
            isCallAPI = true;
        }
    }, [])

    const getAllProductTypes = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getProductType, { headers });
            dispatch(GET_ALL({ productTypes: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addProductTypes = async (products: ProductTypes) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addProductType, products, { headers });
            // dispatch(ADD_PRODUCTTYPES({ productTypes: response.data }))
            getAllProductTypes()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateProductTypes = async (products: ProductTypes) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateProductType, products, { headers });
            getAllProductTypes()
            // dispatch(UPDATE_PRODUCTTYPES({ products: dataProducts, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProductTypes = async (id: number) => {
        try {
            await axios.delete(deleteProductType, { params: { id } });
            dispatch(DELETE_PRODUCTTYPES({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataProductTypes, getAllProductTypes, addProductTypes, updateProductTypes, deleteProductTypes
    };
}
