import { useState } from 'react';
import axios from 'axios';

export default function useImportFile() {
    const [isLoadding, setIsLoading] = useState(true);

    const uploadFileCustomer = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };
            const response = await axios.post('http://192.168.50.238:8899/api/Import/importKhachHang', formData, { headers });
            console.log("aaaaaaaa", response);

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const uploadFileContractors = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };
            await axios.post('http://192.168.50.238:8899/api/Import/importNhaThau', formData, { headers });

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const uploadFileSupplier = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };
            await axios.post('http://192.168.50.238:8899/api/Import/importNhaCungCap', formData, { headers });

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const uploadFileAuthor = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('formFile', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };
            await axios.post('http://192.168.50.238:8899/api/Import/importNhaTacGia', formData, { headers });

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoadding, uploadFileCustomer, uploadFileContractors, uploadFileSupplier,uploadFileAuthor
    };
}
