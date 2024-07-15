import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_INTERACTION, DELETE_INTERACTION, GET_ALL, UPDATE_INTERACTION } from '@/store/interaction/action';
import { DetailInteraction, Interaction } from '@/interfaces/interaction';
import { addQuanLyTuongTac, deleteQuanLyTuongTac, getBuocThiTruong, getByBuocThiTruong, getByCoQuan, getChiTietQuanLyTuongTac, getNguonVon, getQuanLyTuongTac, updateQuanLyTuongTac } from '@/constant/api';
import { Step } from '@/interfaces/step';
import { Capital } from '@/interfaces/capital';

export default function useInteraction(id?: any) {
    const dataInteraction = useAppSelector((state) => state.interaction)
    const [isLoadding, setIsLoading] = useState(true);
    const [dataSteps, setDataSteps] = useState<Step[]>();
    const [dataCapitals,setDataCapitals] = useState<Capital[]>();
    const dispatch = useAppDispatch();
    const [interactDetails, setInteractDetails] = useState<DetailInteraction[]>()

    useEffect(() => {
        const getAllInteractionByCoQuan = async (id: any) => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getByCoQuan}?coQuanID=${id}`, { headers });
                dispatch(GET_ALL({ interaction: response.data }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }

        getAllSteps()
        getAllCapitals()
        if (id !== undefined) getAllInteractionByCoQuan(id)
    }, [dispatch, id])

    const getAllInteraction = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getQuanLyTuongTac, { headers });
            dispatch(GET_ALL({ interaction: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllDetails = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getChiTietQuanLyTuongTac, { headers });
            setInteractDetails(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllInteractionByCoQuan = async (id: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getByCoQuan}?coQuanID=${id}`, { headers });
            dispatch(GET_ALL({ interaction: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllInteractionByBuocThiTruong = async (buocThiTruongID: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getByBuocThiTruong}?BuocThiTruongID=${buocThiTruongID}`, { headers });
            dispatch(GET_ALL({ interaction: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllSteps = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getBuocThiTruong, { headers });
            setDataSteps(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllCapitals = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getNguonVon, { headers });
            setDataCapitals(response.data)
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
            if (response.status === 200) {
                dispatch(ADD_INTERACTION({ interaction: response.data }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateInteraction = async (id:number,interaction: Interaction) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const interact = {

                tuongTacID: Number(id),
                coQuanID: interaction.coQuanID,
                thoiGian: interaction.thoiGian,
                thongTinLienHe: interaction.thongTinLienHe,
                buocThiTruongID: interaction.buocThiTruongID,
                thongTinTiepXuc: interaction.thongTinTiepXuc,
                canBoTiepXuc: interaction.canBoTiepXuc,
                nhomHangQuanTam: interaction.nhomHangQuanTam,
                doanhThuDuKien: interaction.doanhThuDuKien,
                ghiChu: interaction.ghiChu

            }

            const response = await axios.put(updateQuanLyTuongTac, interact, { headers });
            if (response.status == 200) {
                dispatch(UPDATE_INTERACTION({ interaction: response.data, id: response.data.nhaThauID }))
                getAllInteractionByCoQuan(interact.coQuanID)
                return true;
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteInteraction = async (id: number) => {
        try {
            const response = await axios.delete(deleteQuanLyTuongTac, { params: { id } });
            dispatch(DELETE_INTERACTION({ id }))

        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulInteraction = async (ids: number[]) => {
        try {
            let flag=true
            ids.map(async id => {
                const response = await axios.delete(deleteQuanLyTuongTac, { params: { id } });
                dispatch(DELETE_INTERACTION({ id }))
                if(response?.status!==200) flag=false
            })
            return flag

        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding,
        dataInteraction,
        dataSteps,
        dataCapitals,
        dataDetailInteract: interactDetails,
        deleteMulInteraction,
        getAllInteraction,
        addInteraction,
        updateInteraction,
        deleteInteraction,
        getAllSteps,
        getAllCapitals,
        getAllDetails,
        getAllInteractionByCoQuan,
        getAllInteractionByBuocThiTruong
    };
}
