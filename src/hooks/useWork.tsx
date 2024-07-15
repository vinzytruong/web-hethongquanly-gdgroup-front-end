import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_WORK, DELETE_WORK, GET_ALL, UPDATE_WORK } from '@/store/work/action';
import { CreateWorkDto, Work } from '@/interfaces/work';
import { addCongViec, deleteCongViec, getCongViec, getCongViecDuocGiao, getCongViecGiao, updateCongViec } from '@/constant/api';

export default function useWork() {
    const dataWork = useAppSelector((state) => state.work)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllWork = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCongViecGiao, { headers });
            dispatch(GET_ALL({ work: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAssignedWork = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getCongViecDuocGiao, { headers });
            dispatch(GET_ALL({ work: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addWork = async (work: CreateWorkDto) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addCongViec, work, { headers });
            if (response.status === 200) {
                dispatch(ADD_WORK({ work: response.data }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateWork = async (work: CreateWorkDto) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateCongViec, work, { headers });
            if (response.status === 200) {
                getAllWork()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteWork = async (id: number) => {
        try {
            const response = await axios.delete(deleteCongViec, { params: { id } });
            if (response.status === 200) {
                dispatch(DELETE_WORK({ id }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulWork = async (ids: number[]) => {
        let flag = true
        ids.map(async (id) => {
            try {
                const response = await axios.delete(deleteCongViec, { params: { id } });
                if (response.status === 200) {
                    dispatch(DELETE_WORK({ id }))
                    flag = true;
                }
            } catch (e) {
                console.error("Error: ", e);
                flag = false;
            } finally {
                setIsLoading(false)
            }
        })
        return flag;
    }
    return {
        isLoadding,
        dataWork,
        getAllWork,
        addWork,
        updateWork,
        deleteWork,
        deleteMulWork,
        getAssignedWork
    };
}
