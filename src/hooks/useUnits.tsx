import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_UNITS, DELETE_UNITS, GET_ALL, UPDATE_UNITS } from '@/store/units/action';
import { Units } from '@/interfaces/units';
import { addUnit, deleteUnit, getUnit, updateUnit } from '@/constant/api';
let isCallAPI = false;
export default function useUnits() {
    const dataUnits = useAppSelector((state) => state.units)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isCallAPI === false) {
            getAllUnits()
            isCallAPI = true;
        }
    }, [])

    const getAllUnits = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getUnit, { headers });
            dispatch(GET_ALL({ units: response.data }))
            setIsLoading(false)
        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }

    const addUnits = async (units: Units) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addUnit, units, { headers });
            // dispatch(ADD_UNITS({ units: response.data }))
            getAllUnits()
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const updateUnits = async (units: Units) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateUnit, units, { headers });
            getAllUnits()
            // dispatch(UPDATE_UNITS({ units: dataUnits, id: response.data.nhaThauID }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
            throw e;
        } finally {
            setIsLoading(false)
        }
    }

    const deleteUnits = async (id: number) => {
        try {
            await axios.delete(deleteUnit, { params: { id } });
            dispatch(DELETE_UNITS({ id }))
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, dataUnits, getAllUnits, addUnits, updateUnits, deleteUnits
    };
}
