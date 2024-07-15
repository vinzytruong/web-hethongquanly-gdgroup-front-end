import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { addNghiPhep, getAllNghiPhep, deleteNghiPhep, capNhatTrangThaiNghiPhep, getAllTrangThaiNghiPhep, getAllLoaiNghiPhep, getTrangThaiNgayNghiTaiKhoan } from '@/constant/api';
import dayjs from 'dayjs';

interface FormValues {
    congTyID: number;
    phongBanID: number;
    chucVuID: number;
    nguoiDuyetID: number;
    tenNguoiDuyet: string;
    nhanVienID: number;
    buoiBatDau: number;
    ngayBatDau: string;
    buoiKetThuc: number;
    ngayKetThuc: string;
    ngayNghi: number;
    loaiID: number;
    thu: string;
    lyDo: string;
}

interface DataNghiPhep {
    nhanVienID: number;
    phepNam: number;
    phepDuocSuDung: number;
    phepDaSuDung: number;
    phepCoTheSuDung: number;
}

export default function useLeaves() {
    const [isLoadding, setIsLoading] = useState(true);
    const [dataLeave, setDataLeave] = useState([])
    const [dataStatusLeave, setDataStatusLeave] = useState([])
    const [dataLoai, setDataLoai] = useState([])
    const [dataNgayNghiPhep, setDataNgayNghiPhep] = useState<DataNghiPhep>()
    useEffect(() => {
        getAllLoai()
        getAllLeave()
        getAllStatusLeave()
    }, [])

    const createNewLeave = async (dataForm: FormValues) => {
        try {
            const data = {
                nghiPhepID: 0,
                tuNgay: dayjs(dataForm.ngayBatDau).format('DD/MM/YYYY HH:mm:ss'),
                denNgay: dayjs(dataForm.ngayKetThuc).format('DD/MM/YYYY HH:mm:ss'),
                thu: dataForm.thu,
                ngayNghi: dataForm.ngayNghi,
                lyDo: dataForm.lyDo,
                nguoiDuyetID: dataForm.nguoiDuyetID,
                tenNguoiDuyet: dataForm.tenNguoiDuyet,
                loaiID: dataForm.loaiID,
            }

            console.log('data sent', data);

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.post(addNghiPhep, data, { headers });
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllLeave = async () => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get(getAllNghiPhep, { headers });
            setDataLeave(response.data)
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllLoai = async () => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get(getAllLoaiNghiPhep, { headers });
            setDataLoai(response.data)
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusDayLeaveOfStaff = async (id: number) => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get(`${getTrangThaiNgayNghiTaiKhoan}/?nhanvienID=${id}`, { headers });
            setDataNgayNghiPhep(response.data)
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllStatusLeave = async () => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.get(getAllTrangThaiNghiPhep, { headers });
            setDataStatusLeave(response.data)
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteLeave = async (id: number) => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.delete(deleteNghiPhep, { params: { id: id }, headers });;
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateStatusLeave = async (data: {}) => {
        try {

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.put(capNhatTrangThaiNghiPhep, data, { headers });
            setIsLoading(false)
            return response.status === 200
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    }



    return {
        isLoadding, createNewLeave, getAllLeave, deleteLeave, updateStatusLeave, getAllLoai, dataLoai, getStatusDayLeaveOfStaff, dataNgayNghiPhep, dataLeave, dataStatusLeave
    };
}
