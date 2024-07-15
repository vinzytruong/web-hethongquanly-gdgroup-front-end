import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PRODUCTS, DELETE_PRODUCTS, GET_ALL, UPDATE_PRODUCTS } from '@/store/products/action';
import { Products } from '@/interfaces/products';
import { addProduct, deleteProduct, getProduct, updateProduct } from '@/constant/api';
let isCallAPI = false;
export default function useProducts() {
    const dataProducts = useAppSelector((state) => state.products)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isCallAPI === false) {
            getAllProducts()
            isCallAPI = true;
        }
    }, [dataProducts])

    const getAllProducts = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getProduct, { headers });
            dispatch(GET_ALL({ products: response.data }))
            setIsLoading(false)
        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }

    const addProducts = async (products: Products) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addProduct, products, { headers });
            // dispatch(ADD_PRODUCTS({ products: response.data }))
            getAllProducts()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const updateProducts = async (products: Products) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateProduct, products, { headers });
            getAllProducts()
            // dispatch(UPDATE_PRODUCTS({ products: dataProducts, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProducts = async (id: number) => {
        try {
            await axios.delete(deleteProduct, { params: { id } });
            dispatch(DELETE_PRODUCTS({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataProducts, getAllProducts, addProducts, updateProducts, deleteProducts
    };
}
