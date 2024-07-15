import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { Staff, StaffDetail } from '@/interfaces/user';
import { DELETE_STAFF, GET_ALL } from '@/store/staff/action';
import { addNhanVienChucVu, deleteNhanVien, authDoiMatKhau, getNhanVien, getNhanVienByID, getNhanVienChiTiet, updateNhanVienByID, getNhanVienChiTietByChucVuID, datLaiMatKhau, editTenDangNhap, deleteNguoiDung, khoaNguoiDung, moKhoaNguoiDung, deleteNhanVienChucVu, getUserOfRole } from '@/constant/api';
import { GET_STAFF_DETAIL_BY_ID } from '@/store/staffDetail/action';

import dayjs from 'dayjs';
import { string } from 'yup';

interface Image {
    fileID: number | null
    fileName: string;
    fileType: string;
    fileUrl: string;
    loaiID: number;
}


export default function useStaff() {
    const dataStaff = useAppSelector((state) => state.staff)
    const dataStaffDetail = useAppSelector((state) => state.staffDetail)
    const [isLoadding, setIsLoading] = useState(true);
    const [isLoaddingDetail, setIsLoadingDetail] = useState(true);
    const [isLoaddingStaffDepartment, setIsLoadingStaffDepartment] = useState(true);
    const [staffDetailByPositionID, setStaffDetailByPositionID] = useState<StaffDetail[]>([])
    const dispatch = useAppDispatch();
    const [dataStaffDepartment, setDataStaffDepartment] = useState<Staff[]>([])

    useEffect(() => {
        const getAllStaff = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getNhanVien, { headers });
                dispatch(GET_ALL({ staff: response.data }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        getAllStaff()
    }, [dispatch])


    const getAllUserOfRole = async (roleNames: string[]) => {
        try {
            const arrUserUnique: any[] = [];

            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };

            const promises = roleNames?.map(async (roleName) => {
                try {
                    const response = await axios.get(`${getUserOfRole}?roleName=${roleName}`, { headers });
                    return response.data;
                } catch (error: any) {
                    if (error.response && error.response.status === 500) {
                        return []; // Trả về mảng rỗng nếu lỗi 500
                    } else {
                        console.error("Error fetching data for role:", roleName, error);
                        return [];
                    }
                }
            });

            const results = await Promise.all(promises);

            results.forEach((data: any[]) => {
                data.forEach((item: any) => {
                    if (!arrUserUnique.find(user => user.nhanVienID === item.nhanVienID)) {
                        arrUserUnique.push(item);
                    }
                });
            });

            setDataStaffDepartment(arrUserUnique);
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoadingStaffDepartment(false);
        }
    };

    const getAllStaffDetailByPositionID = async (chucVuID: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            if (chucVuID !== undefined) {
                const response = await axios.get(`${getNhanVienChiTietByChucVuID}/${chucVuID}`, { headers });
                setStaffDetailByPositionID(response.data)
            }
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getAllStaff = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getNhanVien, { headers });
            dispatch(GET_ALL({ staff: response.data }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const updateStaff = async (User: any, newavatar: Image | null, newDiploma: Image[]) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            let arrImage = [...newDiploma];
            if (newavatar && newavatar !== null && newavatar.fileName !== '') {
                arrImage = arrImage.filter(item => item.loaiID !== 1);
                arrImage.push(newavatar);
            } else {
                arrImage = arrImage.filter(item => item.loaiID !== 1 || (item.loaiID === 1 && item.fileName !== ''));
            }

            arrImage = arrImage.map((item: Image) => {
                const newItem: any = { ...item };
                if (newItem.fileID === null) {
                    delete newItem.fileID;
                }
                return newItem;
            });

            const data = {
                nhanVienDto: {
                    nhanVienID: User?.nhanVienID,
                    tenNhanVien: User?.tenNhanVien,
                    gioiTinh: User?.gioiTinh === 'Nam' ? 1 : 0,
                    ngaySinh: typeof User?.ngaySinh === 'string' ? User.ngaySinh : dayjs(User?.ngaySinh).format('DD/MM/YYYY HH:mm:ss').toString(),
                    ngayKyHopDong: typeof User?.ngayKyHopDong === 'string' ? User.ngayKyHopDong : dayjs(User?.ngayKyHopDong).format('DD/MM/YYYY HH:mm:ss').toString(),
                    soDienThoai: User?.soDienThoai,
                    email: User?.email,
                    diaChi: User?.diaChi,
                },
                fileDinhKemDto: arrImage,
            }
            const response = await axios.put(updateNhanVienByID, data, { headers });
            // console.log('response', response);
            return response.status
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const updateStaffClient = async (User: any, newavatar: Image | null, newDiploma: Image[]) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            let arrImage = [...newDiploma];
            if (newavatar && newavatar !== null && newavatar.fileName !== '') {
                arrImage = arrImage.filter(item => item.loaiID !== 1);
                arrImage.push(newavatar);
            } else {
                arrImage = arrImage.filter(item => item.loaiID !== 1 || (item.loaiID === 1 && item.fileName !== ''));
            }

            arrImage = arrImage.map((item: Image) => {
                const newItem: any = { ...item };
                if (newItem.fileID === null) {
                    delete newItem.fileID;
                }
                return newItem;
            });

            const data = {
                nhanVienDto: {
                    nhanVienID: User?.nhanVienID,
                    tenNhanVien: User?.tenNhanVien,
                    gioiTinh: User?.gioiTinh === 'Nam' ? 1 : 0,
                    ngaySinh: typeof User?.ngaySinh === 'string' ? User.ngaySinh : dayjs(User?.ngaySinh).format('DD/MM/YYYY HH:mm:ss').toString(),
                    ngayKyHopDong: typeof User?.ngayKyHopDong === 'string' ? User.ngayKyHopDong : dayjs(User?.ngayKyHopDong).format('DD/MM/YYYY HH:mm:ss').toString(),
                    soDienThoai: User?.soDienThoai,
                    email: User?.email,
                    diaChi: User?.diaChi,
                },
                fileDinhKemDto: arrImage,
            }
            console.log('data update', data);
            const response = await axios.put(updateNhanVienByID, data, { headers });
            // console.log('response', response);
            return response.status
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }
    const getStaffDetailByID = async (nhanVienID: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            if (nhanVienID !== undefined) {
                const response = await axios.get(`${getNhanVienChiTiet}/${nhanVienID}`, { headers });
                // console.log('response get NhanVien by ID', response.data);
                dispatch(GET_STAFF_DETAIL_BY_ID({ staffDetail: response.data }))
            }
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoadingDetail(false)
        }
    }

    const changePasswordStaff = async (ID: number, OldPassword: string, NewPassword: string) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const data = {
                nhanVienID: ID,
                matKhauCu: OldPassword,
                matKhauMoi: NewPassword
            };
            // console.log('data', data);
            const response = await axios.post(authDoiMatKhau, data, { headers });
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const resetPasswordStaff = async (ID: number, NewPassword: string) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const data = {
                nhanVienID: ID,
                matKhauMoi: NewPassword
            };
            const response = await axios.post(datLaiMatKhau, data, { headers });
            console.log('response', response);
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const changeUserNameStaff = async (ID: number, newTenDangNhap: string) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const data = {
                nhanVienID: ID,
                tenDangNhap: newTenDangNhap
            };
            const response = await axios.post(editTenDangNhap, data, { headers });
            console.log('response', response);
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const deleteStaff2 = async (ID: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            // console.log('ID', ID);
            const response = await axios.delete(deleteNguoiDung, { params: { nhanVienID: ID } });
            getAllStaff()
            // console.log('response delete user', response);
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const lockStaff = async (ID: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');

            const response = await axios.post(`${khoaNguoiDung}?nhanVienID=${ID}`);
            console.log('response lock user', response);
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };
    const unLockStaff = async (ID: number) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const response = await axios.post(`${moKhoaNguoiDung}?nhanVienID=${ID}`);
            console.log('response un lock user', response);
            return response.status
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };



    const deleteStaff = async (id: number) => {
        try {
            await axios.delete(deleteNhanVien, { params: { id } });
            dispatch(DELETE_STAFF({ id }))
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteMulStaff = async (ids: number[]) => {
        let flag = true;
        ids.map(async (id) => {
            try {
                const rs = await axios.delete(deleteNhanVien, { params: { id } });
                if (rs.status !== 200) {
                    flag = false
                }
                dispatch(DELETE_STAFF({ id }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        })
        return flag

    }
    const addStaffToPosition = async (nhanvienID: any, positionID: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addNhanVienChucVu, { chucVuID: positionID, nhanVienID: nhanvienID }, { headers });
            console.log(response?.status);

            if (response.status !== 200) {
                return false
            }

            getAllStaff()
            getStaffDetailByID(nhanvienID)
            return true

        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }

    }

    const deleteStaffToPosition = async (nhanvienID: any, positionID: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            let data = {
                chucVuID: positionID,
                nhanVienID: nhanvienID,
            }
            const response = await axios.delete(deleteNhanVienChucVu, { headers, data });
            // console.log('response', response);
            if (response.status === 200) {
                getStaffDetailByID(nhanvienID)
                return true
            }
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
        return true
    }

    return {
        isLoadding,
        isLoaddingDetail,
        isLoaddingStaffDepartment,
        dataStaff,
        dataStaffDetail,
        dataStaffDepartment,
        dataStaffDetailByPositionID: staffDetailByPositionID,
        getStaffDetailByID,
        getAllUserOfRole,
        getAllStaff,
        deleteStaff,
        deleteMulStaff,
        addStaffToPosition,
        deleteStaffToPosition,
        getAllStaffDetailByPositionID,
        updateStaff,
        changePasswordStaff,
        resetPasswordStaff,
        changeUserNameStaff,
        deleteStaff2,
        lockStaff,
        unLockStaff,
        updateStaffClient,
    };
}
