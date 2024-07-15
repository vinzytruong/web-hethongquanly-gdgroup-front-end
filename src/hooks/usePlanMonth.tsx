import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PLAN_MONTH, DELETE_PLAN_MONTH, GET_ALL, UPDATE_PLAN_MONTH } from '@/store/planMonth/action';
import { PlanMonth } from '@/interfaces/plan';
import { addKeHoachThang, confirmKeHoachThang, deleteKeHoachThang, getKeHoachThang, updateKeHoachThang } from '@/constant/api';

export default function usePlanMonth() {
    const dataPlanMonth = useAppSelector((state) => state.plan)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const getAllPlanMonth = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getKeHoachThang, { headers });
            dispatch(GET_ALL({ plan: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
   

    const addPlanMonth = async (plan: PlanMonth) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addKeHoachThang, plan, { headers });
            if(response.status===200) {
                dispatch(ADD_PLAN_MONTH({ plan: response.data }))
                return true
            } 
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updatePlanMonth = async (plan: PlanMonth) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateKeHoachThang, plan, { headers });
            if(response.status===200) {
                getAllPlanMonth()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const confirmPlanMonth = async (id: any,isApprove:boolean) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(`${confirmKeHoachThang}/${id}?trangThai=${isApprove}`, { headers });
            if(response.status===200) {
                getAllPlanMonth()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deletePlanMonth = async (id: number) => {
        try {
            const response=await axios.delete(deleteKeHoachThang, { params: { id } });
            if(response.status===200) {
                dispatch(DELETE_PLAN_MONTH({ id }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulPlanMonth = async (ids: number[]) => {
        let flag = true
        ids.map(async (id) => {
            try {
                const response=await axios.delete(deleteKeHoachThang, { params: { id } });
                if(response.status===200) {
                    dispatch(DELETE_PLAN_MONTH({ id }))
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
        dataPlanMonth, 
        getAllPlanMonth, 
        addPlanMonth, 
        updatePlanMonth, 
        deletePlanMonth, 
        deleteMulPlanMonth,
        confirmPlanMonth
    };
}
