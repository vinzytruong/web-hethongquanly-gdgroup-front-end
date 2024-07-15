import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PLAN_DAY, DELETE_PLAN_DAY, GET_ALL, UPDATE_PLAN_DAY } from '@/store/planDay/action';
import { PlanDay } from '@/interfaces/plan';
import { addChiPhiKeHoachNgay, addChiPhiKhacKeHoachNgay, addKeHoachNgay, addNguoiDiCungKeHoachNgay, addNoiDungKeHoachNgay, addXeKeHoachNgay, confirmKeHoachNgay, deleteKeHoachNgay, getHangMucKeHoachNgay, getKeHoachNgay, getKeHoachNgayByID, getTrangThaiDuyetKeHoachNgay, updateKeHoachNgay } from '@/constant/api';
import { PeopleTogether } from '@/interfaces/peopleTogether';
import { ContentWorkPlan } from '@/interfaces/contentWorkPlan';
import { VehicleWork } from '@/interfaces/vehicleWork';
import { CostWork } from '@/interfaces/costWork';
import { StatusConfirm } from '@/interfaces/status';

export default function usePlanDay() {
    const dataPlanDay = useAppSelector((state) => state.planDay)
    const [isLoadding, setIsLoading] = useState(true);
    const [dataCategory, setDataCategory] = useState<{ id: number, tenHangMuc: string }[]>([]);
    const [addedPlanDayID, setAddedPlanDayID] = useState<number>(0)
    const [dataDetailPlanDayByID, setDataDetailPlanDay] = useState<PlanDay>()
    const [dataStatusConfirm, setDataStatusConfirm] = useState<StatusConfirm[]>([])
    const dispatch = useAppDispatch();

    const getAllPlanDay = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getKeHoachNgay, { headers });
            dispatch(GET_ALL({ plan: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllStatusConfirm = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getTrangThaiDuyetKeHoachNgay, { headers });
            setDataStatusConfirm(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getDetailPlanDayByID = async (id: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getKeHoachNgayByID}/${id}`, { headers });
            setDataDetailPlanDay(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllCategoryCost = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getHangMucKeHoachNgay, { headers });
            setDataCategory(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addPlanDay = async (plan: PlanDay) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addKeHoachNgay, plan, { headers });
            if (response.status === 200) {
                dispatch(ADD_PLAN_DAY({ plan: response.data }))
                console.log("ngayID", response?.data?.ngayID);

                setAddedPlanDayID(response?.data?.ngayID)
                return response?.data?.ngayID
            }
        } catch (e) {
            console.error("Error: ", e);
            return 0
        } finally {
            setIsLoading(false)
        }
    }
    const addPeopleTogetherPlanDay = async (people: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addNguoiDiCungKeHoachNgay, people, { headers });
            if (response.status === 200) {
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const addContentPlanDay = async (content: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addNoiDungKeHoachNgay, content, { headers });
            if (response.status === 200) {
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const addVehiclePlanDay = async (vehicle: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addXeKeHoachNgay, vehicle, { headers });
            if (response.status === 200) {
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const addCostPlanDay = async (cost: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addChiPhiKeHoachNgay, cost, { headers });
            if (response.status === 200) {
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const addCostOtherPlanDay = async (cost: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addChiPhiKhacKeHoachNgay, cost, { headers });
            if (response.status === 200) {
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const confirmPlanDay = async (id: number, trangThaiID: number, nguoiDuyetID: number, tenNguoiDuyet: string) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(confirmKeHoachNgay, {
                ngayID: id,
                trangThaiID: trangThaiID,
                nguoiDuyetID: nguoiDuyetID,
                tenNguoiDuyet: tenNguoiDuyet
            }, { headers });
            console.log("response", response?.data);

            if (response.status === 200) {
                getAllPlanDay()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const updatePlanDay = async (plan: PlanDay) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateKeHoachNgay, plan, { headers });
            if (response.status === 200) {
                getAllPlanDay()
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deletePlanDay = async (id: number) => {
        try {
            const response = await axios.delete(deleteKeHoachNgay, { params: { id } });
            if (response.status === 200) {
                dispatch(DELETE_PLAN_DAY({ id }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulPlanDay = async (ids: number[]) => {
        let flag = true
        ids.map(async (id) => {
            try {
                const response = await axios.delete(deleteKeHoachNgay, { params: { id } });
                if (response.status === 200) {
                    dispatch(DELETE_PLAN_DAY({ id }))
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
        dataPlanDay,
        dataCategory,
        addedPlanDayID,
        dataDetailPlanDayByID,
        dataStatusConfirm,
        getAllPlanDay,
        addPlanDay,
        addPeopleTogetherPlanDay,
        addContentPlanDay,
        addVehiclePlanDay,
        addCostPlanDay,
        updatePlanDay,
        deletePlanDay,
        deleteMulPlanDay,
        confirmPlanDay,
        getDetailPlanDayByID,
        getAllCategoryCost,
        getAllStatusConfirm,
        addCostOtherPlanDay
    };
}
