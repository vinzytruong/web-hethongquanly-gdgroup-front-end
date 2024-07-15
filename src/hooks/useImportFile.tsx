import { useState } from 'react';
import axios from 'axios';
import { importBaoCaoTiepXuc, importDaiLy, importKhachHang, importNhaCungCap, importNhaThau, importTacGia } from '@/constant/api';
import { useAppDispatch } from '@/store/hook';
import { GET_ALL_ORGANIZATION } from '@/store/organization/action';
import useInteraction from './useInteraction';
import useSupplier from './useSupplier';
import useAuthor from './useAuthor';
import useContractors from './useContractors';
import useOrganization from './useOrganization';
import useAgency from './useAgency';

export default function useImportFile() {
    const [error, setError] = useState<{ maLoi: string }>()
    const [isLoadding, setIsLoading] = useState(true);
    const { getAllInteraction } = useInteraction()
    const { getAllSupplier } = useSupplier()
    const { getAllAuthor } = useAuthor()
    const { getAllContractors } = useContractors()
    const { getAllAgency } = useAgency()
    const { getAllOrganization } = useOrganization()
    const dispatch = useAppDispatch();

    const uploadFileCustomer = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importKhachHang, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            dispatch(GET_ALL_ORGANIZATION({ organization: response.data }))
            getAllOrganization()
            setIsLoading(false)
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const uploadFileContractors = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importNhaThau, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            getAllContractors()
            setIsLoading(false)
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
            
        }
    }

    const uploadFileAgency = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importDaiLy, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            getAllAgency()
            setIsLoading(false)
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const uploadFileSupplier = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importNhaCungCap, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            getAllSupplier()
            setIsLoading(false)
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const uploadFileAuthor = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importTacGia, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            getAllAuthor()
            setIsLoading(false)
            return true;
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }
    const uploadFileInteraction = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importBaoCaoTiepXuc, formData, { headers });
            if (response?.data.error > 0) {
                response.data.importError.map((item: any) => {
                    setError((prevState: any) => ({
                        ...prevState,
                        maLoi: item.maLoi
                    }))
                })
            }
            getAllInteraction()
            setIsLoading(false)
            return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, error, uploadFileCustomer, uploadFileContractors, uploadFileSupplier, uploadFileAuthor, uploadFileInteraction, uploadFileAgency
    };
}
