import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_INTERACTION, DELETE_INTERACTION, GET_ALL, UPDATE_INTERACTION } from '@/store/interaction/action';
import { Interaction } from '@/interfaces/interaction';
import { addQuanLyTuongTac, deleteQuanLyTuongTac, getQuanLyTuongTac, updateQuanLyTuongTac } from '@/constant/api';

export default function useInteraction() {
    const dataInteraction = useAppSelector((state) => state.interaction)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllInteraction = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`};
            const response = await axios.get(getQuanLyTuongTac, { headers });
            dispatch(GET_ALL({ interaction: response.data }))
            console.log("interaction",response.data);
            
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addInteraction = async (interaction: Interaction) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addQuanLyTuongTac, interaction, { headers });
            dispatch(ADD_INTERACTION({ interaction: response.data }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateInteraction = async (interaction: Interaction) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateQuanLyTuongTac, interaction, { headers });
            dispatch(UPDATE_INTERACTION({ interaction: response.data, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    
    const deleteInteraction = async (id: number) => {
        try {
            await axios.delete(deleteQuanLyTuongTac, { params: { id } });
            dispatch(DELETE_INTERACTION({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataInteraction, getAllInteraction, addInteraction, updateInteraction, deleteInteraction
    };
}
