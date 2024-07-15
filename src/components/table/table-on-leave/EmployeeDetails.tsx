import React from 'react';
import { Grid, Typography, Box, Button, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

interface EmployeeDetailsProps {
    row: any;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const getDayOfWeek = (dateTimeStr: string) => {
    dayjs.locale('vi');
    const date = dayjs(dateTimeStr, 'DD/MM/YYYY HH:mm:ss');
    const dayOfWeek = date.format('dddd');

    return dayOfWeek;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ row, setOpenDialog }) => {
    const theme = useTheme();
    
    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Họ tên nhân viên:</span> {row?.hoTen}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Chức vụ:</span> {row?.tenChucVu}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Phòng ban:</span> {row?.tenPhongBan}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Công ty:</span> {row?.tenCongTy}</Typography>
            </Grid>
            <Grid item sm={4}>
                <Typography><span style={{ fontWeight: "bolder" }}>Từ ngày:</span> {row?.tuNgay?.slice(0, 10)} ({getDayOfWeek(row?.tuNgay)})</Typography>
            </Grid>
            <Grid item sm={4}>
                <Typography><span style={{ fontWeight: "bolder" }}>Đến ngày:</span> {row?.denNgay?.slice(0, 10)} ({getDayOfWeek(row?.denNgay)})</Typography>
            </Grid>
            <Grid item sm={4}>
                <Typography><span style={{ fontWeight: "bolder" }}>Tống số ngày nghỉ:</span> {row?.ngayNghi} ngày</Typography>
            </Grid>
            <Grid item sm={6}>
                <Typography><span style={{ fontWeight: "bolder" }}>Ngày tạo:</span> {row?.createDate?.slice(0, 16)}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Trạng thái duyệt:</span> {row?.nghiPhep_LichSu[0].nghiPhep_TrangThai.tenTrangThai}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Người duyệt:</span> {row?.nghiPhep_LichSu[0].nhanVien.tenNhanVien}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Loại nghỉ phép:</span> {row?.nghiPhepLoai.tenLoaiNghiPhep}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography><span style={{ fontWeight: "bolder" }}>Lý do nghỉ:</span></Typography>
                <Box bgcolor={theme.palette.grey[100]} mt={1} borderRadius={"8px"} width={"100%"} p={2} border={1} borderColor={theme.palette.grey[400]}>
                    <div dangerouslySetInnerHTML={{ __html: row?.lyDo! }}></div>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end"
                }}>
                    <Box>
                        <Button
                            variant='contained'
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                boxShadow: "none",
                            }}
                            onClick={() => setOpenDialog(false)}
                        >
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default EmployeeDetails;
