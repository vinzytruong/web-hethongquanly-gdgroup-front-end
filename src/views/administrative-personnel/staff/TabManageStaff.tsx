import { CustomInput } from "@/components/input";
import { StyledButton } from "@/components/styled-button";
import { addMultipleStaffToManageStaff, gellAllStaffbyManageStaff, getAllStaffs } from "@/constant/api";
import useProvince from "@/hooks/useProvince";
import useRole from "@/hooks/useRole";
import useRoleProvince from "@/hooks/useRoleProvince";
import { Staff } from "@/interfaces/user";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, ListItemText, MenuItem, Select, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Component để hiển thị danh sách checkbox cho các tỉnh
function ProvinceCheckbox({ province, checked, onChange }: any) {
    return (
        <FormControlLabel
            control={<Checkbox checked={checked} onChange={onChange} />}
            label={province.tenTinh} // Hiển thị tên tỉnh
        />
    );
}
export default function TabManageStaff({ rows }: any) {
    const theme = useTheme()
    const { dataRole, getAllRole, addStaffToRole, getAllRoleOfUser, dataRoleByUser, removeStaffToRole, removeStaffToRoleProvince } = useRole(undefined, rows)
    const { dataRoleProvinceByUser, addStaffToRoleProvince, updateStaffToRoleProvince, getAllRoleProvinceOfUser } = useRoleProvince(rows.nhanVienID)
    const { dataProvince } = useProvince()
    // const [selectedProvinces, setSelectedProvinces] = useState<number[]>([]);
    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);

    useEffect(() => {
        if (rows.nhanVienID) getAllRoleProvinceOfUser(rows.nhanVienID)
    }, [rows.nhanVienID])

    // Danh sách phân quyền phòng ban đã chọn
    const [selectedRole, setSelectedRole] = useState<string[]>([])
    // Danh sách tỉnh đã chọn
    const [selectedProvinces, setSelectedProvinces] = useState<number[]>([]);
    const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);

    /* ---------------------CHỌN PHÂN QUYỀN THEO PHÒNG BAN------------------------------- */
    // Lấy dữ liệu phân quyền phòng ban của người dùng
    useEffect(() => {
        if (dataRoleByUser[0]?.roleName) setSelectedRole(dataRoleByUser[0]?.roleName)
    }, [dataRoleByUser])

    // Handler khi thay đổi trạng thái của checkbox
    const handleChangeSelectRole = (event: any) => {
        const { target: { value } } = event;
        setSelectedRole(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    /* ---------------------CHỌN PHÂN QUYỀN THEO TỈNH------------------------------- */
    // Lấy dữ liệu phân quyền tỉnh của người dùng
    useEffect(() => {
        if (dataRoleProvinceByUser) setSelectedProvinces(dataRoleProvinceByUser)
    }, [dataRoleProvinceByUser])

    // const handleSelectAllChange = (event: any) => {
    //     if (event.target.checked) {
    //         setSelectedProvinces(dataProvince.map((item) => item.tinhID));
    //     } else {
    //         setSelectedProvinces([]);
    //     }
    // };

    // const handleItemChange = (tinhID: number) => {
    //     setSelectedProvinces((prev: any) =>
    //         prev.includes(tinhID) ? prev.filter((id: number) => id !== tinhID) : [...prev, tinhID]
    //     );
    // };
    const isAllSelected = selectedStaffs.length === dataStaffs.length;
    /* --------------------CẬP NHẬT DỮ LIỆU------------------------ */
    const handleSave = async (event: any) => {
        console.log("Selected staffs", selectedStaffs);

        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(
                addMultipleStaffToManageStaff,
                {
                    quanLyID: rows.nhanVienID,
                    lstNhanVienID: selectedStaffs,
                },
                { headers }
            );

            if (response.status === 200) {
                toast.success("Cập nhật phân quyền thành công");
            } else {
                toast.error("Cập nhật phân quyền thất bại");
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi trong quá trình cập nhật phân quyền");
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllStaffs, { headers });

                // Assuming you want to filter out rows with nhanVienID === 'specificID'
                const filteredData = response.data.filter((staff: Staff) => staff.nhanVienID !== rows.nhanVienID);
                setDataStaffs(filteredData);
            } catch (error) {
                console.log(error);
            } finally {
                // Optional: Any cleanup or final steps
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(gellAllStaffbyManageStaff + "?quanLyID=" + rows.nhanVienID, { headers });
                console.log("manage-staff", response.data);
                const staffIdsArray = response.data.map((staff: any) => Number(staff.nhanVienID));
                setSelectedStaffs(staffIdsArray);
            } catch (error) {
                console.log(error);
            } finally {
                // Optional: Any cleanup or final steps
            }
        };

        fetchData();
    }, []);

    const handleSelectAllChange = (event: any) => {
        if (event.target.checked) {
            setSelectedStaffs(dataStaffs.map((item) => item.nhanVienID));
        } else {
            setSelectedStaffs([]);
        }
    };
    const handleItemChange = (nhanVienID: number) => {
        setSelectedStaffs((prev: any) =>
            prev.includes(nhanVienID) ? prev.filter((id: number) => id !== nhanVienID) : [...prev, nhanVienID]
        );
    };
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <Grid container spacing={2}>
                <Grid item sm={12}>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant="h6">Phân quyền quản lý nhân viên</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isAllSelected}
                                            indeterminate={
                                                selectedStaffs.length > 0 && selectedStaffs.length < selectedStaffs.length
                                            }
                                            onChange={handleSelectAllChange}
                                        />
                                    }
                                    label="Chọn tất cả"
                                />
                                <Grid container spacing={2}>
                                    {dataStaffs.map((item, index) => (
                                        <Grid key={index} item sm={2}>
                                            <FormControlLabel
                                                key={item.nhanVienID}
                                                control={
                                                    <Checkbox
                                                        checked={selectedStaffs.includes(item.nhanVienID)}
                                                        onChange={() => handleItemChange(item.nhanVienID)}
                                                    />
                                                }
                                                label={item.tenNhanVien}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                            </FormGroup>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={12}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        pt: 2,
                        width: '100%'
                    }}>
                        <StyledButton size="large" onClick={handleSave}>Cập nhật</StyledButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}