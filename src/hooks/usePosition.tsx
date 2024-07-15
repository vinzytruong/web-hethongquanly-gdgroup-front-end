import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_POSITION_OF_COMPANY, DELETE_POSITION_OF_COMPANY, GET_ALL_POSITION, UPDATE_POSITION_BY_ID, GET_POSITION_BY_DEPARTMENT } from '@/store/position/action';
import { Position } from '@/interfaces/position';
import { addPositionOfDepartment, deletePositionOfCompany, getPositionOfDepartmenById, getPositionOfDepartment, updatePositionOfDepartment } from '@/constant/api';


export default function usePosition() {
    const dataPosition = useAppSelector((state) => state.position)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllPositionByDepartment = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getPositionOfDepartment + `/${id}`, { headers });
            dispatch(GET_POSITION_BY_DEPARTMENT({ position: response.data }))

        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getPositionById = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getPositionOfDepartmenById + `/${id}`, { headers });

            return response.data
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    const addPosition = async (contractors: Position) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addPositionOfDepartment, contractors, { headers });
            dispatch(ADD_POSITION_OF_COMPANY({ position: response.data }))
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updatePosition = async (contractors: Position) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updatePositionOfDepartment, contractors, { headers });
            dispatch(UPDATE_POSITION_BY_ID({ position: contractors }))
            return response.status === 200
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deletePosition = async (id: number) => {
        try {
            await axios.delete(deletePositionOfCompany, { params: { id } });
            dispatch(DELETE_POSITION_OF_COMPANY({ id }))
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
        dataPosition,
        getAllPositionByDepartment,
        addPosition,
        updatePosition,
        getPositionById,
        deletePosition
    };
}
