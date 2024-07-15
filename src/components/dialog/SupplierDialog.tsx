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
import { Supplier } from '@/interfaces/supplier';
import useSupplier from '@/hooks/useSupplier';
import useSupplierType from '@/hooks/useSupplierType';

export default function SupplierDialog(props: PropsDialog) {
    const theme = useTheme()
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props
    const { getAllProvince, dataProvince } = useProvince()
    const { dataSupplierType } = useSupplierType()
    const { addSupplier, updateSupplier } = useSupplier()
    const [loading, setLoaing] = useState<boolean>(false)
    const [formData, setFormData] = useState<Supplier>();

    useEffect(() => {
        if (defaulValue) setFormData(defaulValue)
    }, [defaulValue])

    const handleChange = (e: any) => {
        if (e.target) {
            setFormData((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    };

    const handleAdd = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        if (formData) addSupplier(formData)
        setLoaing(false);
        handleOpen(false)
    }

    const handleUpdate = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        if (formData) updateSupplier(formData)
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
                                    <Typography>Mã số thuế</Typography>
                                    <OutlinedInput
                                        name='maSoThue'
                                        value={formData?.maSoThue}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Tên công ty (*)</Typography>
                                    <OutlinedInput
                                        name='tenCongTy'
                                        value={formData?.tenCongTy}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Loại (*)</Typography>
                            <Select
                                defaultValue={defaulValue?.loaiNCCID}
                                name='loaiNCCID'
                                value={formData?.loaiNCCID}
                                onChange={handleChange}
                                fullWidth
                            >
                                {dataSupplierType.map((item, index) => (
                                    <MenuItem key={index} defaultValue={formData?.loaiNCCID} value={item.loaiNCCID}>{item.tenLoai}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Địa chỉ</Typography>
                            <OutlinedInput
                                name='diaChi'
                                style={{ width: '100%' }}
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
                                    >
                                        {dataProvince.map((item, index) => (
                                            <MenuItem key={index} defaultValue={formData?.tinhID} value={item.tinhID}>{item.tenTinh}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Người đại diện (*)</Typography>
                                    <OutlinedInput
                                        name='nguoiDaiDien'
                                        style={{ width: '100%' }}
                                        value={formData?.nguoiDaiDien}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Nhân viên phụ trách (*)</Typography>
                            <OutlinedInput
                                name='nhanVienPhuTrach'
                                style={{ width: '100%' }}
                                value={formData?.nhanVienPhuTrach}
                                onChange={handleChange}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Chức vụ (*)</Typography>
                                    <OutlinedInput
                                        name='chucVu'
                                        style={{ width: '100%' }}
                                        value={formData?.chucVu}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Số điện thoại (*)</Typography>
                                    <OutlinedInput
                                        name='soDienThoai'
                                        style={{ width: '100%' }}
                                        value={formData?.soDienThoai}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Ghi chú</Typography>
                            <OutlinedInput
                                name='thongTinThem'
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
                            Thêm nhà cung cấp
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
                            Cập nhật nhà cung cấp
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}