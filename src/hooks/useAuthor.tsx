/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_AUTHOR, DELETE_AUTHOR, GET_ALL, UPDATE_AUTHOR } from '@/store/author/action';
import { Author } from '@/interfaces/author';
import { addTacGia, deleteTacGia, getTacGia, updateTacGia } from '@/constant/api';

export default function useAuthor() {
    const dataAuthor = useAppSelector((state) => state.author)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllAuthor = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getTacGia, { headers });
                dispatch(GET_ALL({ author: response.data }))  
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllAuthor()
    }, [dispatch])

    const getAllAuthor = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getTacGia, { headers });
            dispatch(GET_ALL({ author: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addAuthor = async (author: Author) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addTacGia, author, { headers });
            dispatch(ADD_AUTHOR({ author: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateAuthor = async (author: Author) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateTacGia, author, { headers });
            getAllAuthor()
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteAuthor = async (id: number) => {
        try {
            await axios.delete(deleteTacGia, { params: { id } });
            dispatch(DELETE_AUTHOR({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulAuthor = async (ids: number[]) => {
        ids.map(async (item) => {
            try {
                await axios.delete(deleteTacGia, { params: { id: item } });
                dispatch(DELETE_AUTHOR({ id: item }))
                setIsLoading(false)
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        })

    }

    return {
        isLoaddingAuthor: isLoadding, dataAuthor, getAllAuthor, addAuthor, updateAuthor, deleteAuthor, deleteMulAuthor
    };
}
