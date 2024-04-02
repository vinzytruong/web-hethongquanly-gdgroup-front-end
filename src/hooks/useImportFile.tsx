import { useState } from 'react';
import axios from 'axios';

export default function useImportFile() {
    const [isLoadding, setIsLoading] = useState(true);

    const uploadFileCustomer = async (file:File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };
            await axios.post('http://192.168.50.238:8899/api/Import/importKhachHang',formData, { headers });

            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoadding, uploadFileCustomer
    };
}
