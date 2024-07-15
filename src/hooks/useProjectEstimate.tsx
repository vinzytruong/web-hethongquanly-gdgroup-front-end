import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PROJECTESTIMATE, DELETE_PROJECTESTIMATE, GET_ALL, UPDATE_PROJECTESTIMATE } from '@/store/projectEstimate/action';
import { DetailProjectEstimate, ProjectEstimate } from '@/interfaces/projectEstimate';
import { addNSDuToan, deleteNSDuToan, getBuocThiTruongDuToan, getChiTietNSDuToan, getNSDuToan, updateNSDuToan } from '@/constant/api';
import { Step } from '@/interfaces/step';

export default function useProjectEstimate(id?: any) {
    const dataProjectEstimate = useAppSelector((state) => state.projectEstimates)
    const [isLoadding, setIsLoading] = useState(true);
    const [dataSteps, setDataSteps] = useState<Step[]>();
    const dispatch = useAppDispatch();
    const [interactDetails, setInteractDetails] = useState<DetailProjectEstimate[]>()


    const getAllProjectEstimate = async (coQuanID:number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getNSDuToan}?coQuanID=${coQuanID}`, { headers });
            dispatch(GET_ALL({ projectEstimate: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllDetailsProjectEstimate = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getChiTietNSDuToan, { headers });
            setInteractDetails(response.data)
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
            const response = await axios.get(getBuocThiTruongDuToan, { headers });
            setDataSteps(response.data)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addProjectEstimate = async (projectEstimate: ProjectEstimate) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addNSDuToan, projectEstimate, { headers });
            if (response.status === 200) {
                dispatch(ADD_PROJECTESTIMATE({ projectEstimate: response.data }))
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateProjectEstimate = async (projectEstimate: ProjectEstimate, id:number) => {
        try {
            console.log("update",id);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateNSDuToan, projectEstimate, { headers });
            
            
            getAllProjectEstimate(id)
            
            if (response.status !== 200) { 
                return false
            }
            else return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProjectEstimate = async (id: number) => {
        try {
            const response = await axios.delete(deleteNSDuToan, { params: { id } });
            dispatch(DELETE_PROJECTESTIMATE({ id }))

        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const deleteMulProjectEstimate = async (ids: number[]) => {
        try {
            let flag=true
            ids.map(async id => {
                const response = await axios.delete(deleteNSDuToan, { params: { id } });
                dispatch(DELETE_PROJECTESTIMATE({ id }))
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
        dataProjectEstimate,
        dataSteps,
        dataDetailInteract: interactDetails,
        deleteMulProjectEstimate,
        getAllProjectEstimate,
        addProjectEstimate,
        updateProjectEstimate,
        deleteProjectEstimate,
        getAllDetailsProjectEstimate,
        getAllSteps
    };
}
