import React, { useEffect, useRef, useState } from 'react';
import { Box, useTheme, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, styled } from '@mui/material';
import { StyledButton } from '@/components/styled-button';
import { IconEdit } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TableOnLeave from '@/components/table/table-on-leave/TableOnLeave';
import CustomDialog from '@/components/dialog/CustomDialog';
import FormCreateLeave from '@/components/form/FormCreateLeave'
import useLeaves from '@/hooks/useLeave';
import { toast } from 'react-toastify';
import TabHtmlEditor from './TabHtmlEditor';
import EmployeeDetails from '@/components/table/table-on-leave/EmployeeDetails';
import { CustomInput } from '@/components/input';
import ReactToPrint from 'react-to-print';
import { IconPrinter } from '@tabler/icons-react';
import { slice } from 'lodash';
import TotalItemCard from '@/components/card/TotalItemCard';

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
}
const TypographyPrint = styled(Typography)(() => ({
    fontFamily: "Times New Roman",
    fontSize: "17px"
}))

const TypographyPrintSmall = styled(Typography)(() => ({
    fontFamily: "Times New Roman",
    fontSize: "13px"
}))

const Line = styled(Box)(({ theme }) => ({

    alignContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100px',
    height: '1px',
    backgroundColor: 'black',
    margin: '20px 0',
}));


export default function BeOnLeave() {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [openViewPrint, setOpenViewPrint] = useState(false)
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('month'));
    const [openEditor, setOpenEditor] = useState(false)
    const [statusFiller, setStatusFiller] = useState(0)
    const { dataLeave, dataStatusLeave, dataNgayNghiPhep, getStatusDayLeaveOfStaff, deleteLeave, getAllLeave, dataLoai } = useLeaves();
    const [dataSelectLeave, setDataSelectLeave] = useState<any>()
    const [viewId, setViewId] = useState<number>(0)
    const [id, setId] = React.useState(0)           // ID account

    useEffect(() => {
        let data: any[] = dataLeave.filter((item: any) => item.nghiPhepID === viewId);
        if (data.length > 0) {
            setDataSelectLeave(data[0]);
        } else {
            setDataSelectLeave(undefined);
        }
        console.log('data[0]', data[0]);
    }, [viewId]);

    React.useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        setId(account?.userID)
        getStatusDayLeaveOfStaff(account?.userID)
    }, [])

    React.useEffect(() => {
        getAllLeave()
    }, [open])

    const setEditId = (id: number) => {
        setOpen(true)
        setViewId(id)
    }

    const handleViewId = (id: number) => {
        setOpenViewDetail(true)
        setViewId(id)
    }

    const handleDeleteId = async (id: number) => {
        let status = await deleteLeave(id)
        await getAllLeave()
        if (status) toast.success(`Xóa đơn xin nghỉ phép thành công`)
        else toast.error(`Xóa đơn xin nghỉ phép thất bại`)
    }

    const hangleOpenViewPrint = async (id: number) => {
        setViewId(id)
        setOpenViewPrint(true)
    }

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

    function convertToAbbreviation(fullName: string) {
        if (fullName == null) return;
        let words = fullName.split(' ');
        let abbreviation = '';
        words.forEach(word => {
            abbreviation += word.charAt(0).toUpperCase();
        });

        return abbreviation;
    }

    const filteredData = React.useMemo(() => {
        if (!startDate || !endDate) return dataLeave;

        const start = startDate.startOf('day');
        const end = endDate.endOf('day');

        return dataLeave.filter((item: any) => {
            const itemNgayBatDau = dayjs(item.tuNgay, 'DD/MM/YYYY HH:mm:ss').startOf('day');
            const itemNgayKetThuc = dayjs(item.denNgay, 'DD/MM/YYYY HH:mm:ss').endOf('day');

            let dateRangeMatch = false;

            if (start && end) {
                if (start.isBefore(end)) {
                    dateRangeMatch = (itemNgayBatDau.isSameOrBefore(end, 'day') && itemNgayKetThuc.isSameOrAfter(start, 'day'));
                } else {
                    dateRangeMatch = (itemNgayBatDau.isSame(start, 'day') && itemNgayKetThuc.isSame(end, 'day'));
                }
            }

            return dateRangeMatch && (statusFiller === 0 || statusFiller === item?.nghiPhep_LichSu[0]?.trangThaiID);
        });
    }, [startDate, endDate, dataLeave, statusFiller]);

    /* Use ref */
    const componentRef = useRef(null);

    return (
        <Box padding="24px" >
            <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' width='100%'>
                {openEditor ?
                    <Box sx={{ px: 3, py: 3 }} width='100%'>
                        {/* <TabHtmlEditor /> */}
                    </Box>
                    :
                    <Box sx={{ background: theme.palette.background.paper, px: 0, py: 0 }} width='100%'>
                        <Box display='flex' flexDirection={'row'} alignItems='flex-start' width='100%' padding={0} paddingBottom={2} gap={2}>
                            <Grid container spacing={2}>
                                <Grid item md={6} lg={6}>
                                    <TotalItemCard isLoading={false} title="Số ngày phép cả năm" data={dataNgayNghiPhep?.phepNam} />
                                </Grid>
                                <Grid item md={6} lg={6}>
                                    <TotalItemCard isLoading={false} title="Số ngày phép được sử dụng" data={typeof dataNgayNghiPhep?.phepDuocSuDung !== undefined && Number(dataNgayNghiPhep?.phepDuocSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepDuocSuDung} />
                                </Grid>
                                <Grid item md={6} lg={6}>
                                    <TotalItemCard isLoading={false} title="Số ngày phép đã sử dụng" data={dataNgayNghiPhep?.phepDaSuDung} />
                                </Grid>
                                <Grid item md={6} lg={6}>
                                    <TotalItemCard isLoading={false} title="Số ngày phép có thể sử dụng" data={Number(dataNgayNghiPhep?.phepCoTheSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepCoTheSuDung} />
                                </Grid>
                            </Grid>
                            {/* <Card sx={{ maxWidth: 345 }}> */}
                            {/* <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Thông tin nghỉ phép của tài khoản
                                    </Typography>
                                    <Typography variant="body2" >
                                        Số ngày phép cả năm: {dataNgayNghiPhep?.phepNam}
                                    </Typography>
                                    <Typography variant="body2" >
                                        Số ngày phép năm được sử dụng: {typeof dataNgayNghiPhep?.phepDuocSuDung !== undefined && Number(dataNgayNghiPhep?.phepDuocSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepDuocSuDung}
                                    </Typography>
                                    <Typography variant="body2" >
                                        Số ngày phép năm đã sử dụng: {dataNgayNghiPhep?.phepDaSuDung}
                                    </Typography>
                                    <Typography variant="body2" >
                                        Số ngày phép có thể sử dụng: {Number(dataNgayNghiPhep?.phepCoTheSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepCoTheSuDung}
                                    </Typography>
                                </CardContent> */}
                            {/* </Card> */}
                        </Box>
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
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
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
                            </Box>
                            <Box sx={{ width: '200px' }}>
                                <StyledButton
                                    startIcon={<IconEdit stroke={2} />}
                                    variant="contained"
                                    fullwidth
                                    size='large'
                                    // onClick={() => setOpenEditor(true)}
                                    onClick={() => setOpen(true)}
                                >
                                    Viết đơn
                                </StyledButton>
                            </Box>
                        </Box>
                        <TableOnLeave
                            setDeleteId={handleDeleteId}
                            setViewId={handleViewId}
                            setPrint={hangleOpenViewPrint}
                            setEditId={setEditId}
                            rows={filteredData.filter((item: any) => item.nguoiTaoID
                                === id)}
                            isAdmin={true} />
                    </Box>
                }
            </Box>
            <CustomDialog
                title="Đơn xin nghỉ phép"
                defaulValue={null}
                isInsert
                handleOpen={setOpen}
                open={open}
                content={<FormCreateLeave />}
            />
            <CustomDialog
                title={'Chi tiết'}
                open={openViewDetail}
                handleOpen={setOpenViewDetail}
                content={
                    <EmployeeDetails row={dataSelectLeave} setOpenDialog={setOpenViewDetail} />
                } />
            <CustomDialog
                size='md'
                title={''}
                open={openViewPrint}
                handleOpen={setOpenViewPrint}
                content={
                    <Box display="flex" flexDirection="column" alignItems="flex-end" >
                        <Box>
                            <Grid ref={componentRef} container spacing={0} paddingTop="2cm" paddingBottom="1cm" paddingLeft="3.5cm" paddingRight="2cm" sx={{ marginTop: '-30px', }} >
                                <Grid item sm={12}>
                                    <TypographyPrintSmall fontFamily="Times New Roman" textAlign='right' marginRight={-5} marginTop={-5}>{convertToAbbreviation(dataSelectLeave?.hoTen) + '-' + dataSelectLeave?.nghiPhepID}</TypographyPrintSmall>
                                </Grid>
                                <Grid item sm={4}>
                                    <TypographyPrint fontFamily="Times New Roman" textAlign="center" textTransform={"uppercase"} variant='h4'>{dataSelectLeave?.tenCongTy}</TypographyPrint>
                                    <Box sx={{ marginTop: '-23px', }} width="100%" display="flex" justifyContent="center">
                                        <Line />
                                    </Box>
                                </Grid>
                                <Grid item sm={8}>
                                    <TypographyPrint textAlign="center" variant='h4' align="center" textTransform={"uppercase"}>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</TypographyPrint>
                                    <TypographyPrint textAlign="center" variant='h4' align="center" sx={{ textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</TypographyPrint>

                                    {dataSelectLeave?.createDate &&
                                        <Grid item sm={12} textAlign="center" sx={{ marginTop: '10px' }}>
                                            <TypographyPrint style={{ textIndent: '90px' }} sx={{ fontStyle: 'italic', }}>Cần Thơ, ngày {String(dayjs(dataSelectLeave?.createDate, 'DD/MM/YYYY HH:mm:ss').date()).padStart(2, '0')} tháng {String(dayjs(dataSelectLeave?.createDate, 'DD/MM/YYYY HH:mm:ss').month() + 1).padStart(2, '0')} năm {String(dayjs(dataSelectLeave?.createDate, 'DD/MM/YYYY HH:mm:ss').year()).padStart(2, '0')}</TypographyPrint>
                                        </Grid>}
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography fontFamily="Times New Roman" textAlign="center" py={2.5} variant='h4'>ĐƠN XIN NGHỈ PHÉP</Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <TypographyPrint style={{ textIndent: '50px' }}> Kính gửi: </TypographyPrint>
                                    <TypographyPrint style={{ textIndent: '100px' }}>- Ban giám đốc {dataSelectLeave?.tenCongTy}; </TypographyPrint>
                                    <TypographyPrint style={{ textIndent: '100px' }}>- Ban Pháp chế - Hành chính - Nhân sự. </TypographyPrint>
                                </Grid>
                                <Grid item sm={12} style={{ textIndent: '40px' }}>
                                    <TypographyPrint>Tôi tên là: <span style={{ fontWeight: "bolder" }}>{dataSelectLeave?.hoTen}.</span></TypographyPrint>
                                </Grid>
                                <Grid item sm={12} style={{ textIndent: '40px' }}>
                                    <TypographyPrint>Chức vụ: {dataSelectLeave?.tenChucVu}.</TypographyPrint>
                                </Grid>

                                <Grid item sm={12} >
                                    <TypographyPrint style={{ textIndent: '40px' }}>
                                        {`Nay tôi viết đơn này kính gửi Giám đốc Công ty, Ban PC-HC-NS giải quyết cho tôi được nghỉ ${dataSelectLeave?.ngayNghi} ngày: ${dataSelectLeave?.ngayNghi < 1.5 ? 'ngày ' + dataSelectLeave?.tuNgay.slice(0, 10) + '.' : 'Từ ngày' + dataSelectLeave?.tuNgay.slice(0, 10) + ' đến ngày ' + dataSelectLeave?.denNgay.slice(0, 10)}.`}
                                    </TypographyPrint>

                                </Grid>

                                <Grid item sm={12} >
                                    <TypographyPrint style={{ textIndent: '40px' }} >Lý do: {dataSelectLeave?.lyDo}.</TypographyPrint>
                                </Grid>

                                <Grid item sm={12}>
                                    <TypographyPrint style={{ textIndent: '40px' }} >Tôi sẽ sắp xếp công việc khi nghỉ phép để không làm ảnh hưởng tới công việc chung của Công ty.</TypographyPrint>
                                </Grid>

                                <Grid item sm={12}>
                                    <TypographyPrint style={{ textIndent: '40px' }} >Kính mong BGĐ chấp nhận.</TypographyPrint>
                                </Grid>

                                <Grid item sm={12}>
                                    <TypographyPrint style={{ textIndent: '40px' }} >Tôi xin chân thành cảm ơn./.</TypographyPrint>
                                </Grid>

                                <Grid item sm={12} sx={{ marginTop: '-25px' }}>
                                    <Grid container spacing={1}>
                                        <Grid item sm={5}>
                                            <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                <TypographyPrint textAlign="center" variant='h6'>CẤP QUẢN LÝ TRỰC TIẾP XÁC NHẬN</TypographyPrint>
                                                <TypographyPrint textAlign="center" variant='body1' paddingTop={1}>
                                                    (Đã ký)
                                                </TypographyPrint>
                                                <TypographyPrint textAlign="center" sx={{ marginTop: '0px' }} variant='body1' py={1}>
                                                    <span style={{ fontWeight: "bolder" }}>{dataSelectLeave?.nghiPhep_LichSu[dataSelectLeave?.nghiPhep_LichSu.length - 1]?.tenNguoiDuyet}</span>
                                                </TypographyPrint>
                                            </Box>
                                        </Grid>

                                        <Grid item sm={7}>
                                            <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 4 }}>
                                                <TypographyPrint textAlign="center" variant='h6' >NGƯỜI VIẾT ĐƠN</TypographyPrint>
                                                <TypographyPrint textAlign="center" variant='body1' paddingTop={2}>
                                                    (Đã ký)
                                                </TypographyPrint>
                                                <TypographyPrint textAlign="center" sx={{ marginTop: '20px' }} variant='body1' py={1}>
                                                    <span style={{ fontWeight: "bolder" }}>{dataSelectLeave?.hoTen}</span>
                                                </TypographyPrint>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Grid item sm={12}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", marginTop: '-10px' }}>
                                        <TypographyPrint textAlign="center" variant='h6' >BAN PC-HC-NS XÁC NHẬN</TypographyPrint>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'flex-start', justifyContent: 'flex-start', pt: 0 }}>
                                        <TypographyPrint textAlign="center" >Nhân sự: {dataSelectLeave?.hoTen}</TypographyPrint>
                                        <TypographyPrint textAlign="center" > + Số ngày phép cả năm ({dayjs().year()}): {String(dataNgayNghiPhep?.phepNam).padStart(2, '0')} ngày;</TypographyPrint>
                                        <TypographyPrint textAlign="center" > + Số ngày phép được sử dụng đến tháng {String(dayjs().month() + 1).padStart(2, '0')}/{dayjs().year()}: {String(typeof dataNgayNghiPhep?.phepDuocSuDung !== undefined && Number(dataNgayNghiPhep?.phepDuocSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepDuocSuDung).padStart(2, '0')} ngày;</TypographyPrint>
                                        <TypographyPrint textAlign="center" > + Số ngày phép đã sử dụng đến tháng {String(dayjs().month() + 1).padStart(2, '0')}/{dayjs().year()}: {String(Number(dataNgayNghiPhep?.phepDaSuDung)).padStart(2, '0')} ngày;</TypographyPrint>
                                        <TypographyPrint textAlign="center" > + Số ngày phép còn lại đến tháng {String(dayjs().month() + 1).padStart(2, '0')}/{dayjs().year()}: {String(Number(dataNgayNghiPhep?.phepCoTheSuDung) < 0 ? 0 : (dataNgayNghiPhep?.phepCoTheSuDung + (dataSelectLeave?.nghiPhepLoai.loaiID === 2 ? 0 : dataSelectLeave?.ngayNghi))).padStart(2, '0')} ngày;</TypographyPrint>
                                        <TypographyPrint textAlign="center" > + Số ngày phép chuyển sang tháng kế tiếp (nếu có): {String(Number(dataNgayNghiPhep?.phepCoTheSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepCoTheSuDung).padStart(2, '0')} ngày.</TypographyPrint>
                                    </Box>
                                    <TypographyPrint textAlign="center" variant='body1' paddingTop={2}>
                                        (Đã ký)
                                    </TypographyPrint>
                                    <TypographyPrint textAlign="center" sx={{ marginTop: '0px' }} variant='body1' paddingTop={2}>
                                        <span style={{ fontWeight: "bolder" }}>{dataSelectLeave?.nghiPhep_LichSu[dataSelectLeave?.nghiPhep_LichSu.length - 3]?.nhanVien.tenNhanVien}</span>
                                    </TypographyPrint>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", pt: 2 }}>
                                        <TypographyPrint textAlign="center" variant='h6'>PHÊ DUYỆT CỦA GIÁM ĐỐC</TypographyPrint>
                                        <TypographyPrint textAlign="center" variant='body1' paddingTop={1}>
                                            (Đã ký)
                                        </TypographyPrint>
                                        <TypographyPrint textAlign="center" sx={{ marginTop: '0px' }} variant='body1' paddingTop={1}>
                                            <span style={{ fontWeight: "bolder" }}>{'Cao Quốc Tuân'}</span>
                                        </TypographyPrint>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                        <ReactToPrint
                            trigger={() => <StyledButton variant="contained" startIcon={<IconPrinter stroke={1.5} />} size="large">In đơn</StyledButton>}
                            content={() => componentRef.current}
                        />
                    </Box>
                }
            />
        </Box>
    );
}
