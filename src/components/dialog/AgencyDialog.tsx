import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useRef, useState } from 'react';
import useProvince from '@/hooks/useProvince';
import { Agency } from '@/interfaces/agency';
import useAgency from '@/hooks/useAgency';
import useAgencyType from '@/hooks/useAgencyType';
import { toast } from 'react-toastify';
import { CustomInput } from '../input';

export default function AgencyDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props
    const theme = useTheme()
    const [formData, setFormData] = useState<Agency>();
    const { getAllProvince, dataProvince } = useProvince()
    const { addAgency, updateAgency } = useAgency()
    const { dataAgencyType } = useAgencyType()
    const [loading, setLoaing] = useState<boolean>(false)

    useEffect(() => {
        getAllProvince()
    }, [formData?.tinhID])

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
    };
    const handleAdd = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        try {

            if (formData) addAgency(formData)
            toast.success('Thêm đại lý thành công')
            setLoaing(false);
            handleOpen(false)
            setFormData(undefined)
        }
        catch (err: any) {
            console.error(err);
            setLoaing(false);
            toast.error('Thêm đại lý thất bại')
        }
    }

    const handleUpdate = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        try {
            if (formData) updateAgency(formData)
            toast.success('Cập nhật đại lý thành công')
            setLoaing(false);
            handleOpen(false)
            setFormData(undefined)
        }
        catch (err: any) {
            console.error(err);
            setLoaing(false);
            toast.error('Cập nhật đại lý thất bại')
        }
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
                                    <Typography>Mã số thuế</Typography>
                                    <CustomInput
                                        name='maSoThue'
                                        value={formData?.maSoThue}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Tên đại lý (*)</Typography>
                                    <CustomInput
                                        name='tenDaiLy'
                                        value={formData?.tenDaiLy}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Địa chỉ (*)</Typography>
                            <CustomInput
                                name='diaChi'
                                value={formData?.diaChi}
                                onChange={handleChange}
                            />
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Tỉnh (*)</Typography>
                                    <Select
                                        defaultValue={defaulValue?.tinhID}
                                        name='tinhID'
                                        value={formData?.tinhID}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataProvince.map((item, index) => (
                                            <MenuItem key={index} defaultValue={formData?.tinhID} value={item.tinhID}>{item.tenTinh}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Loại (*)</Typography>
                                    <Select
                                        defaultValue={defaulValue?.loaiDLID}
                                        name='loaiDLID'
                                        value={formData?.loaiDLID}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataAgencyType.map((item, index) => (
                                            <MenuItem key={index} defaultValue={formData?.loaiDLID} value={item.loaiDLID}>{item.tenLoai}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box style={{ width: '100%' }}>
                            <Typography>Người đại diện</Typography>
                            <CustomInput
                                name='nguoiDaiDien'
                                value={formData?.nguoiDaiDien}
                                onChange={handleChange}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>SĐT người đại diện</Typography>
                                    <CustomInput
                                        name='nddSoDienThoai'
                                        value={formData?.nddSoDienThoai}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Chức vụ người đại diện</Typography>
                                    <CustomInput
                                        name='nddChucVu'
                                        value={formData?.nddChucVu}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Box style={{ width: '100%' }}>
                            <Typography>Nhân viên phụ trách</Typography>
                            <CustomInput
                                name='nhanVienPhuTrach'
                                value={formData?.nhanVienPhuTrach}
                                onChange={handleChange}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>SĐT nhân viên phụ trách</Typography>
                                    <CustomInput
                                        name='soDienThoai'
                                        value={formData?.soDienThoai}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Chức vụ nhân viên phụ trách</Typography>
                                    <CustomInput
                                        name='chucVu'
                                        value={formData?.chucVu}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Ghi chú</Typography>
                            <CustomInput
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
                            Thêm đại lý
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
                            Cập nhật đại lý
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}