import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PLAN_WEEK, DELETE_PLAN_WEEK, GET_ALL, UPDATE_PLAN_WEEK } from '@/store/planWeek/action';
import { PlanWeek } from '@/interfaces/plan';
import { addKeHoachTuan, confirmKeHoachTuan, deleteKeHoachTuan, getKeHoachTuan, updateKeHoachTuan } from '@/constant/api';

export default function usePlanWeek() {
    const dataPlanWeek = useAppSelector((state) => state.planWeek)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllPlanWeek = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getKeHoachTuan, { headers });
            dispatch(GET_ALL({ plan: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addPlanWeek = async (plan: PlanWeek) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addKeHoachTuan, plan, { headers });
            if(response.status===200) {
                dispatch(ADD_PLAN_WEEK({ plan: response.data }))
                return true
            } 
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const confirmPlanWeek = async (id: any, isApprove:boolean) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(`${confirmKeHoachTuan}/${id}?trangThai=${isApprove}`, { headers });
            if(response.status===200) {
                getAllPlanWeek()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const updatePlanWeek = async (plan: PlanWeek) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateKeHoachTuan, plan, { headers });
            if(response.status===200) {
                getAllPlanWeek()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deletePlanWeek = async (id: number) => {
        try {
            const response=await axios.delete(deleteKeHoachTuan, { params: { id } });
            if(response.status===200) {
                dispatch(DELETE_PLAN_WEEK({ id }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulPlanWeek = async (ids: number[]) => {
        let flag = true
        ids.map(async (id) => {
            try {
                const response=await axios.delete(deleteKeHoachTuan, { params: { id } });
                if(response.status===200) {
                    dispatch(DELETE_PLAN_WEEK({ id }))
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
        dataPlanWeek, 
        getAllPlanWeek, 
        addPlanWeek, 
        updatePlanWeek, 
        deletePlanWeek, 
        deleteMulPlanWeek,
        confirmPlanWeek
    };
}
