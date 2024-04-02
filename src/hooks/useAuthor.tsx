import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { ADD_AUTHOR, DELETE_AUTHOR, GET_ALL, UPDATE_AUTHOR } from '@/store/author/action';
import { Author } from '@/interfaces/author';

export default function useAuthor() {
    const dataAuthor = useAppSelector((state) => state.author)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllAuthor = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };
            const response = await axios.get('http://192.168.50.238:8899/api/TacGia/GetTacGia', { headers });
            dispatch(GET_ALL({ author: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const addAuthor = async (author: Author) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/TacGia/AddTacGia',author, { headers });
            dispatch(ADD_AUTHOR({ author: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateAuthor = async (author: Author) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const response = await axios.put('http://192.168.50.238:8899/api/TacGia/UpdateTacGia',author, { headers });
            dispatch(UPDATE_AUTHOR({ author: response.data, id: response.data.tacGiaID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteAuthor = async (id: number) => {
        try {
            await axios.delete(`http://192.168.50.238:8899/api/TacGia/DeleteTacGia`, { params: { id } });
            dispatch(DELETE_AUTHOR({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataAuthor, getAllAuthor, addAuthor, updateAuthor, deleteAuthor
    };
}
