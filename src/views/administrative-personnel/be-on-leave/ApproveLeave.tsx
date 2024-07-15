import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { Box, Typography, Button, useTheme, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { StyledButton } from '@/components/styled-button';
import TabHtmlEditor from './TabHtmlEditor';
import { IconEdit } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TableApproveLeave from '@/components/table/table-on-leave/TableApproveLeave';
import CustomDialog from '@/components/dialog/CustomDialog';
import FormCreateLeave from '@/components/form/FormCreateLeave'
import useLeaves from '@/hooks/useLeave';
import { toast } from 'react-toastify';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';
import { CustomInput } from '@/components/input';

interface FormValues {
    nghiPhepID: number,
    congTyID: number;
    tenCongTy: string;
    hoTen: string;
    PhongBanID: number;
    chucVuID: number;
    nguoiDuyetID: number;
    tenNguoiDuyet: string;
    nhanVienID: number;
    buoiBatDau: number;
    ngayBatDau: string;
    buoiKetThuc: number;
    ngayKetThuc: string;
    ngayNghi: number;
    thu: string;
    lyDo: string;
    createDate: string
}

export default function BeOnLeave() {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-17'));
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('month'));
    const [employeeName, setEmployeeName] = useState("");
    const [statusFiller, setStatusFiller] = useState(0)
    const [typeFiller, setTypeFiller] = useState(0)
    const [openEditor, setOpenEditor] = useState(false)
    const { dataLeave, deleteLeave, getAllLeave, dataStatusLeave, dataLoai, updateStatusLeave } = useLeaves();
    const [dataSelectLeave, setDataSelectLeave] = useState<FormValues>()
    const [viewId, setViewId] = useState<number>(0)


    const employeeOptions = useMemo(() => {
        const names = dataLeave.map((item: any) => item.hoTen);
        const uniqueNames = Array.from(new Set(names));
        return uniqueNames.map(name => ({ name, id: name }));
    }, [dataLeave]);


    const setEditId = (id: number) => {
        setOpen(true)
        setViewId(id)
    }

    const handleViewId = (id: number) => {
        setOpen(true)
        setViewId(id)
    }

    useEffect(() => {

        let data: FormValues[] = dataLeave.filter((item: FormValues) => item.nghiPhepID === viewId);
        if (data.length > 0) {
            setDataSelectLeave(data[0]);
        } else {
            setDataSelectLeave(undefined);
        }
    }, [viewId]);

    const [id, setId] = React.useState(0)
    //-------------------------------------Default---------------------------------------------------//
    const idTongGiamDoc = 1025;  // 1025
    const nameTongGiamDoc = 'Cao Quốc Tuân'
    //-------------------------------------Default---------------------------------------------------//

    React.useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        setId(account?.userID)
    }, [])

    const handleDeleteId = async (id: number) => {
        let status = await deleteLeave(id)
        if (status) toast.success(`Xóa đơn xin nghỉ phép thành công`)
        else toast.error(`Xóa đơn xin nghỉ phép thất bại`)
    }

    const handleUpdateStatus = async (data: any) => {
        let status = await updateStatusLeave(data)
        if (status) toast.success(`Duyệt đơn xin nghỉ phép thành công`)
        else toast.error(`Duyệt đơn xin nghỉ phép thất bại`)
        await getAllLeave()
    }

    const {
        isLoadingRole,
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isProductDeparmentAdmin1,
        isProductDeparmentStaff,
        isAccountantAdmin1,
        isAccountantAdmin2,
        isAccountantStaff,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isMarketDepartmentStaff
    } = useRoleLocalStorage()

    const handleStartDateChange = (newValue: Dayjs | null) => {
        if (newValue && endDate && newValue.isAfter(endDate)) {
            setEndDate(newValue);
        }
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue: Dayjs | null) => {
        if (newValue && startDate && newValue.isBefore(startDate)) {
            setStartDate(newValue);
        }
        setEndDate(newValue);
    };

    /* Quyền xem */
    const viewRole = isAdmin
        || isPersonelStaff

    /* Quyền tạo */
    const editRole = isAdmin
        || isPersonelAdmin1
        || isPersonelAdmin2
        || isGeneralDirector

    const filteredData = useMemo(() => {
        return dataLeave.filter((item: any) => {
            const nghiPhep_LichSu = item.nghiPhep_LichSu;

            const checkApproval = nghiPhep_LichSu.some((record: any) => record.nguoiDuyetID === id);
            const checkRole = editRole || viewRole || id === idTongGiamDoc;
            const checkEmployeeName = employeeName === '' || item.hoTen === employeeName;

            if ((checkApproval || checkRole) && checkEmployeeName) {
                if (!startDate || !endDate) {
                    return true;
                } else {
                    const start = dayjs(startDate).startOf('day');
                    const end = dayjs(endDate).endOf('day');

                    const itemNgayBatDau = dayjs(item.tuNgay, 'DD/MM/YYYY HH:mm:ss').startOf('day');
                    const itemNgayKetThuc = dayjs(item.denNgay, 'DD/MM/YYYY HH:mm:ss').endOf('day');

                    let dateRangeMatch = false;

                    if (start.isBefore(end)) {
                        dateRangeMatch = itemNgayBatDau.isSameOrBefore(end, 'day') && itemNgayKetThuc.isSameOrAfter(start, 'day');
                    } else {
                        dateRangeMatch = itemNgayBatDau.isSame(start, 'day') && itemNgayKetThuc.isSame(end, 'day');
                    }
                    return dateRangeMatch &&
                        (statusFiller === 0 || statusFiller === item?.nghiPhep_LichSu[0]?.trangThaiID) &&
                        (typeFiller === 0 || typeFiller === item?.nghiPhepLoai.loaiID);
                }
            }
            return false;
        });
    }, [dataLeave, startDate, endDate, id, editRole, viewRole, statusFiller, typeFiller, employeeName]);



    return (
        <Box padding="24px" >

            <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' width='100%'>
                {openEditor ?
                    <Box sx={{ px: 3, py: 3 }} width='100%'>
                        {/* <TabHtmlEditor /> */}
                    </Box>
                    :
                    <Box sx={{ background: theme.palette.background.paper, px: 0, py: 0 }} width='100%'>
                        <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center' width='100%' gap={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Từ ngày"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        format="DD/MM/YYYY"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            },
                                        }}
                                    />
                                    <DatePicker
                                        label="Đến ngày"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        format="DD/MM/YYYY"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <FormControl variant="outlined" >
                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-type"
                                        label="Trạng thái"
                                        id="filterStatusAssignment"
                                        name="filterStatusAssignment"
                                        type="filterStatusAssignment"
                                        value={statusFiller}
                                        onChange={(e) => setStatusFiller(Number(e.target.value))}
                                        input={<CustomInput size="medium" sx={{ width: '200px' }} label="Trạng thái" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {dataStatusLeave.map((item: any) => (
                                            <MenuItem key={item.trangThaiID} value={item.trangThaiID}>{item.tenTrangThai}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" >
                                    <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.primary }}>Loại nghỉ phép</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label-type"
                                        label="Loại"
                                        id="filterTypeAssignment"
                                        name="filterTypeAssignment"
                                        type="filterTypeAssignment"
                                        value={typeFiller}
                                        onChange={(e) => setTypeFiller(Number(e.target.value))}
                                        input={<CustomInput size="medium" sx={{ width: '200px' }} label="Loại nghỉ phép" />}
                                    >
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {dataLoai.map((item: any) => (
                                            <MenuItem key={item.loaiID} value={item.loaiID}>{item.tenLoaiNghiPhep}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" >
                                    <InputLabel id="filter-employee-name-label" sx={{ color: theme.palette.text.primary }}>Tên nhân viên</InputLabel>
                                    <Select
                                        labelId="filter-employee-name-label"
                                        label="Tên nhân viên"
                                        id="filter-employee-name"
                                        name="filteremloyeeAssignment"
                                        type="filteremloyeeAAssignment"
                                        onChange={(e) => setEmployeeName(String(e.target.value))}
                                        value={employeeName}
                                        input={<CustomInput size="medium" sx={{ width: '200px' }} label="Tên nhân viên" />}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {employeeOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <TableApproveLeave
                            rows={filteredData}
                            setDeleteId={handleDeleteId} handleUpdateStatus={handleUpdateStatus} setViewId={handleViewId} setEditId={setEditId} isAdmin={true} />
                    </Box>
                }
            </Box>
        </Box>
    );
}
