import { useState } from 'react';
import axios from 'axios';
import { importKhachHang, importNhaCungCap, importNhaThau, importTacGia } from '@/constant/api';

export default function useImportFile() {
    const [isLoadding, setIsLoading] = useState(true);

    const uploadFileCustomer = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' };
            const response = await axios.post(importKhachHang, formData, { headers });
            console.log(response);
            
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
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
            await axios.post(importNhaThau, formData, { headers });
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
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
            await axios.post(importNhaCungCap, formData, { headers });
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
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
            await axios.post(importTacGia, formData, { headers });
            setIsLoading(false)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, uploadFileCustomer, uploadFileContractors, uploadFileSupplier, uploadFileAuthor
    };
}
