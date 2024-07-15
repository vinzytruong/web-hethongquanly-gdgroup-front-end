import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import axios from 'axios';
import { addRoleNhanVien, addRoleNhanVienToTinh, getRole, getRoleOfUser, getUserOfRole, removeRoleNhanVien, removeRoleNhanVienToTinh } from '@/constant/api';
import { GET_ALL_ROLE } from '@/store/role/action';
import { RoleByUser } from '@/interfaces/role';
import useStaff from './useStaff';
import { Staff } from '@/interfaces/user';

export default function useRole(staffs?: Staff[], staff?: Staff) {
    const dataRole = useAppSelector((state) => state.role)
    const [isLoadding, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();
    const [dataRoleByUser, setDataRoleByUser] = useState<RoleByUser[]>([])
    const [dataStaffDepartment, setDataStaffDepartment] = useState<Staff[]>([])

    useEffect(() => {
        const getAllRole = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getRole, { headers });
                const sorteData = response.data.sort((a: any, b: any) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
                dispatch(GET_ALL_ROLE({ role: sorteData }))
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }
        const getAllRoleOfUser = async (id: any) => {
            try {


                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getRoleOfUser}?nhanVienID=${id}`, { headers });
                const foundItem = dataRoleByUser.find(item => item.nhanVienID === id);

                if (!foundItem) {

                    // dataRoleByUser.push({ nhanVienID: id, roleName: response.data })
                    setDataRoleByUser((prevSelectedTags: any) => {
                        return [...prevSelectedTags, { nhanVienID: id, roleName: response.data }]
                    })
                }



            } catch (e) {
                console.error("Error: ", e);
            } finally {
                setIsLoading(false)
            }
        }

        if (staffs) {
            staffs?.map(item => {
                getAllRoleOfUser(item.nhanVienID)
            })

        }

        else if (staff) {

            getAllRoleOfUser(staff.nhanVienID)
        }
        else getAllRole()
    }, [dataRoleByUser, dispatch, staff, staffs])

    const getAllRole = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(getRole, { headers });
            const sorteData = response.data.sort((a: any, b: any) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
            dispatch(GET_ALL_ROLE({ role: sorteData }))
            return response.data
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllRoleOfUser = async (id: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.get(`${getRoleOfUser}?nhanVienID=${id}`, { headers });
            const foundItem = dataRoleByUser.find(item => item.nhanVienID === id);
            if (!foundItem) {
                setDataRoleByUser((prevSelectedTags: any) => {
                    return [...prevSelectedTags, { nhanVienID: id, roleName: response.data }]
                })
            }
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const getAllUserOfRole = (roleNames: string[]) => {
        try {
            let arrUserUnique: any[] = []
            roleNames?.map(async roleName => {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(`${getUserOfRole}?roleName=${roleName}`, { headers });
                if (response.data.length > 0) {
                    response?.data?.map((data: any) => {

                        if (!arrUserUnique?.find(item => item.nhanVienID === data?.nhanVienID)) {
                            arrUserUnique.push(data)
                        }
                    })
                }
            })
            setDataStaffDepartment(arrUserUnique)
        } catch (e) {
            console.error("Error: ", e);
        } finally {
            setIsLoading(false)
        }
    }

    const addStaffToRole = async (nhanvienID: any, roleName: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.post(`${addRoleNhanVien}?nhanvienID=${nhanvienID}&roleName=${roleName}`, { headers });
            if (response.status === 200) return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
        return true
    }




    const removeStaffToRole = async (nhanvienID: any, roleName: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.post(`${removeRoleNhanVien}?nhanvienID=${nhanvienID}&roleName=${roleName}`, { headers });
            if (response.status === 200) return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
        return true
    }
    const removeStaffToRoleProvince = async (nhanvienID: any, tinhID: any) => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await axios.delete(`${removeRoleNhanVienToTinh}/${tinhID}/${nhanvienID}`);


            if (response.status === 200) return true
        } catch (e) {
            console.error("Error: ", e);
            return false
        } finally {
            setIsLoading(false)
        }
        return true
    }

    return {
        isLoadingRole: isLoadding,
        dataRoleByUser,
        dataRole,
        dataStaffDepartment,
        getAllUserOfRole,
        getAllRole,
        addStaffToRole,
        getAllRoleOfUser,
        removeStaffToRole,
        removeStaffToRoleProvince
    };
}
