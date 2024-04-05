import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useRef, useState } from 'react';
import useDistrict from '@/hooks/useDistrict';
import useProvince from '@/hooks/useProvince';
import { Interaction } from '@/interfaces/interaction';
import useInteraction from '@/hooks/useInteraction';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import useStaff from '@/hooks/useStaff';
import useOrganization from '@/hooks/useOrganization';
import useOfficers from '@/hooks/useOfficers';

export default function InteractionDialog(props: PropsDialog) {
    const theme = useTheme()
    const { addInteraction, updateInteraction } = useInteraction()
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props
    const [formData, setFormData] = useState<Interaction>();
    const [loading, setLoaing] = useState<boolean>(false)
    const [selectedDate, setDateChange] = useState(formData?.thoiGian);
    const { dataStaff, getAllStaff } = useStaff()
    const { dataOrganization, getAllOrganization } = useOrganization()
    const { dataOfficers, getOfficersByOrganizationID } = useOfficers()

    useEffect(() => {
        getAllStaff()
        getAllOrganization()
        getOfficersByOrganizationID(formData?.coQuanID)
    }, [formData?.coQuanID])

    useEffect(() => {
        if (defaulValue) setFormData(defaulValue)
    }, [defaulValue])

    const handleChange = (e: any) => {

        if (e.target) {
            console.log(e.target.name);
            setFormData((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
        else {
            setDateChange(e)
            setFormData((prevState: any) => ({
                ...prevState,
                ['thoiGian']: dayjs(e).format('DD/MM/YYYY'),
            }));
        }
    };
    const handleAdd = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        console.log(formData);

        if (formData) addInteraction(formData)
        setLoaing(false);
        handleOpen(false)
    }

    const handleUpdate = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        if (formData) updateInteraction(formData)
        setLoaing(false);
        handleOpen(false)
    }

    return (
        <>
            <Dialog
                maxWidth='md'
                fullWidth
                open={open}
                onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant='h3'>{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 3 }} >
                    <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap='12px'>
                        <Grid container spacing={3}>
                            <Grid item md={4}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Nhân viên</Typography>
                                    <Select
                                        defaultValue={defaulValue?.tinhID}
                                        name='nhanVienID'
                                        value={formData?.nhanVienID}
                                        onChange={handleChange}
                                        fullWidth
                                    >
                                        {dataStaff.map((item, index) => (
                                            <MenuItem key={index} defaultValue={formData?.nhanVienID} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                        ))}
                                    </Select>

                                </Box>
                            </Grid>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Cơ quan</Typography>
                                    
                                    <Select
                                        defaultValue={defaulValue?.coQuanID}
                                        name='coQuanID'
                                        value={formData?.coQuanID}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    >
                                        {dataOrganization.map((item, index) => (
                                            <MenuItem key={index} defaultValue={formData?.coQuanID} value={item.coQuanID}>{item.tenCoQuan}</MenuItem>
                                        ))}
                                         {dataOrganization.length===0 &&
                                            <MenuItem value={undefined}>Không có dữ liệu</MenuItem>
                                        }
                                    </Select>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Cán bộ tiếp xúc</Typography>
                            <OutlinedInput
                                name='canBoTiepXuc'
                                value={formData?.canBoTiepXuc}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                            {/* <Select
                                defaultValue={formData?.canBoTiepXuc}
                                name='canBoTiepXuc'
                                value={formData?.canBoTiepXuc}
                                onChange={handleChange}
                                fullWidth
                            >
                                {dataOfficers.map((item, index) => (
                                    <MenuItem key={index} defaultValue={formData?.canBoTiepXuc} value={item.canBoID}>{item.hoVaTen}</MenuItem>
                                ))}
                            </Select> */}
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Thông tin liên hệ</Typography>
                                    <OutlinedInput
                                        name='thongTinLienHe'
                                        style={{ width: '100%' }}
                                        value={formData?.thongTinLienHe}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Sản phẩm quan tâm</Typography>
                                    <OutlinedInput
                                        name='nhomHangQuanTam'
                                        style={{ width: '100%' }}
                                        value={formData?.nhomHangQuanTam}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>

                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Bước thị trường</Typography>
                            <OutlinedInput
                                name='buocThiTruong'
                                style={{ width: '100%' }}
                                value={formData?.buocThiTruong}
                                onChange={handleChange}
                            />
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Thời gian</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name='thoiGian'
                                    sx={{ width: '100%' }}
                                    defaultValue={dayjs(defaulValue?.thoiGian)}
                                    value={selectedDate}
                                    onChange={handleChange}
                                    disableFuture={true}
                                    format="DD/MM/YYYY"
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Thông tin tiếp xúc</Typography>
                            <TextField
                                name='thongTinTiepXuc'
                                style={{ width: '100%' }}
                                value={formData?.thongTinTiepXuc}
                                onChange={handleChange}
                            />
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Ghi chú</Typography>
                            <TextField
                                name='ghiChu'
                                style={{ width: '100%' }}
                                value={formData?.ghiChu}
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {isInsert &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={handleAdd}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Thêm tương tác
                        </LoadingButton>
                    }
                    {isUpdate &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={handleUpdate}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Cập nhật tương tác
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}