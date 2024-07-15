import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { addRoleNhanVien, addRoleNhanVienToTinh, getRole, getRoleOfUser, getRoleProvinceOfUser, removeRoleNhanVien, updateRoleNhanVienToTinh } from '@/constant/api';
import { GET_ALL_ROLE } from '@/store/role/action';
import { RoleByUser } from '@/interfaces/role';
import useStaff from './useStaff';
import { Staff } from '@/interfaces/user';
import { RoleProvinceByUser } from '@/interfaces/roleProvince';

export default function useRoleProvince(nhanVienID: any) {
    const dataRoleProvince = useAppSelector((state) => state.roleProvince)
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const [dataRoleProvinceByUser, setDataRoleProvinceByUser] = useState<number[]>([])


    const getAllRoleProvinceOfUser = async (id: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getRoleProvinceOfUser}?NhanVienID=${id}`, { headers });
            const uniqueProvinceID: any[] = [];
            response.data.map((item: any) => {
                if (!uniqueProvinceID.find(unique => unique === item.tinhID)) {
                    uniqueProvinceID.push(item.tinhID);
                }
            })
            setDataRoleProvinceByUser(uniqueProvinceID)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addStaffToRoleProvince = async (nhanvienID: any, roleTinhID: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.post(addRoleNhanVienToTinh, { nhanVienID: nhanvienID, tinhID: roleTinhID }, { headers });
            if (response.status === 200) return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
        return true
    }

    const updateStaffToRoleProvince = async (nhanvienID: any, tinhID: any) => {
        const roleProvince = {nhanvienID:nhanvienID, tinhID:tinhID}
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
            const response = await axios.put(updateRoleNhanVienToTinh, roleProvince, { headers });
            // getAllRoleProvinceOfUser(nhanVienID)
            if(response.status!==200){
                return false
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
        isLoadingRoleProvince: isLoadding,
        dataRoleProvince,
        dataRoleProvinceByUser,
        updateStaffToRoleProvince,
        addStaffToRoleProvince,
        getAllRoleProvinceOfUser
    };
}
