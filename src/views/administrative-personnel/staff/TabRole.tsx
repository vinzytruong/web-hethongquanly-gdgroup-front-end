import { CustomInput } from "@/components/input";
import { StyledButton } from "@/components/styled-button";
import useProvince from "@/hooks/useProvince";
import useRole from "@/hooks/useRole";
import useRoleProvince from "@/hooks/useRoleProvince";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, ListItemText, MenuItem, Select, Typography, useTheme } from "@mui/material";
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
export default function TabRole({ rows }: any) {
    const theme = useTheme()
    const { dataRole, getAllRole, addStaffToRole, getAllRoleOfUser, dataRoleByUser, removeStaffToRole, removeStaffToRoleProvince } = useRole(undefined, rows)
    const { dataRoleProvinceByUser, addStaffToRoleProvince, updateStaffToRoleProvince, getAllRoleProvinceOfUser } = useRoleProvince(rows.nhanVienID)
    const { dataProvince } = useProvince()
    // const [selectedProvinces, setSelectedProvinces] = useState<number[]>([]);

    useEffect(() => {
        if (rows.nhanVienID) getAllRoleProvinceOfUser(rows.nhanVienID)
    }, [rows.nhanVienID])

    // Danh sách phân quyền phòng ban đã chọn
    const [selectedRole, setSelectedRole] = useState<string[]>([])
    // Danh sách tỉnh đã chọn
    const [selectedProvinces, setSelectedProvinces] = useState<number[]>([]);

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

    const handleSelectAllChange = (event: any) => {
        if (event.target.checked) {
            setSelectedProvinces(dataProvince.map((item) => item.tinhID));
        } else {
            setSelectedProvinces([]);
        }
    };

    const handleItemChange = (tinhID: number) => {
        setSelectedProvinces((prev: any) =>
            prev.includes(tinhID) ? prev.filter((id: number) => id !== tinhID) : [...prev, tinhID]
        );
    };
    const isAllSelected = selectedProvinces.length === dataProvince.length;
    /* --------------------CẬP NHẬT DỮ LIỆU------------------------ */
    const handleSave = async (event: any) => {
        var isSucess = true
        // Những role không được chọn
        const noSelectedProvinces = dataRole.filter(item => !selectedRole.includes(item.name))


        // Nếu chưa có role nào thì gọi api thêm role
        if (selectedRole?.length === 0) {
            for (let i = 0; i < selectedRole.length; i++) {
                const rs = await addStaffToRole(rows.nhanVienID, selectedRole[i]);
                if (rs === false) isSucess = rs;
            }
            
        }
        else{
            for (let i = 0; i < selectedRole.length; i++) {
                const rs = await removeStaffToRole(rows.nhanVienID, selectedRole[i]);
                if (rs === false) isSucess = rs;
            }
            for (let i = 0; i < selectedRole.length; i++) {
                const rs = await addStaffToRole(rows.nhanVienID, selectedRole[i]);
                if (rs === false) isSucess = rs;
            }
        }

        // Nếu có role rồi thì cập nhật những role được chọn vào 
        // for (let i = 0; i < selectedRole.length; i++) {
        //     const rs = await addStaffToRole(rows.nhanVienID, selectedRole[i]);
        //     if (rs === false) isSucess = rs;
        // }

        // Xoá những phân quyền không được chọn
        if (noSelectedProvinces.length > 0) {
            for (let i = 0; i < selectedRole.length; i++) {
                noSelectedProvinces.map(async itemRole => {
                    const rs = await removeStaffToRole(rows.nhanVienID, itemRole.name)
                    if (rs === false) isSucess = rs;
                    console.log("rsDeleteRole", rs);
                })
            }
        }

        // Những role tỉnh không được chọn
        const noSelectedProvincesProvince = dataProvince.filter(item => !selectedProvinces.includes(item.tinhID))

        // Nếu chưa có role tỉnh nào được chọn
        if (selectedProvinces?.length === 0) {
            for (let i = 0; i < selectedProvinces.length; i++) {
                const rs = await addStaffToRoleProvince(rows.nhanVienID, selectedProvinces[i]);
                if (rs === false) isSucess = rs;
            }
        }
        else {
            // Nếu có role tỉnh được chọn cập nhật những role tỉnh được chọn vào
            for (let i = 0; i < selectedProvinces.length; i++) {
                const rs = await updateStaffToRoleProvince(rows.nhanVienID, selectedProvinces[i]);
                if (rs === false) isSucess = rs;
            }
        }



        // Xoá những phân quyền tỉnh không được chọn
        if (noSelectedProvincesProvince.length > 0) {
            for (let i = 0; i < selectedProvinces.length; i++) {
                noSelectedProvincesProvince.map(async itemRoleProvince => {


                    const rs = await removeStaffToRoleProvince(rows.nhanVienID, itemRoleProvince?.tinhID)
                    if (rs === false) isSucess = rs;
                    console.log("rsDeleteTinh", rs);

                })
            }
        }

        if (isSucess) toast.success("Cập nhật phân quyền thành công")
        else toast.error("Cập nhật phân quyền thất bại")
    }
    console.log("default", selectedRole, selectedProvinces);

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            py={3}
        >
            <Grid container spacing={2}>
                <Grid item sm={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={5} xl={2}>
                            <Typography variant="h6">Phân quyền tài khoản theo ban</Typography>
                        </Grid>
                        <Grid item xs={12} lg={7} xl={10}>
                            <Box width="100%" display="flex" justifyContent="flex-start" alignItems="center">
                                <FormControl sx={{ width: "100%" }}>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={selectedRole}
                                        onChange={handleChangeSelectRole}
                                        input={<CustomInput />}
                                        renderValue={() => selectedRole.join(', ')}
                                    >
                                        {dataRole.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>
                                                <Checkbox checked={selectedRole?.indexOf(item.name) > -1} />
                                                <ListItemText primary={item.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={12}>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant="h6">Phân quyền phụ trách tỉnh</Typography>

                        </Grid>

                        <Grid item sm={12}>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isAllSelected}
                                            indeterminate={
                                                selectedProvinces.length > 0 && selectedProvinces.length < dataProvince.length
                                            }
                                            onChange={handleSelectAllChange}
                                        />
                                    }
                                    label="Chọn tất cả"
                                />
                                <Grid container spacing={2}>
                                    {dataProvince.map((item, index) => (
                                        <Grid key={index} item xs={6} md={4} lg={3}>
                                            <FormControlLabel
                                                key={item.tinhID}
                                                control={
                                                    <Checkbox
                                                        checked={selectedProvinces.includes(item.tinhID)}
                                                        onChange={() => handleItemChange(item.tinhID)}
                                                    />
                                                }
                                                label={item.tenTinh}
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