import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useRef, useState } from 'react';
import useOrganization from '@/hooks/useOrganization';
import { Officers } from '@/interfaces/officers';
import useOfficers from '@/hooks/useOfficers';

export default function OfficersDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id } = props
    const theme = useTheme()
    const [formData, setFormData] = useState<Officers>();
    const { addOrganization, updateOrganization, getAllOrganization, dataOrganization } = useOrganization()
    const { addOfficers, updateOfficers, getAllOfficers, dataOfficers } = useOfficers()
    const [loading, setLoaing] = useState<boolean>(false)

    useEffect(() => {
        getAllOrganization()
    }, [])

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
        console.log("add",formData);
        if (formData) addOfficers(formData,id)
        setLoaing(false);
        handleOpen(false)
    }

    const handleUpdate = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        if (formData) updateOfficers(formData)
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
                        <Box style={{ width: '100%' }}>
                            <Typography>Họ và tên</Typography>
                            <OutlinedInput
                                name='hoVaTen'
                                value={formData?.hoVaTen}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Email</Typography>
                                    <OutlinedInput
                                        name='email'
                                        style={{ width: '100%' }}
                                        value={formData?.email}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Số điện thoại</Typography>
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
                            <Typography>Chức vụ</Typography>
                            <OutlinedInput
                                name='chucVu'
                                value={formData?.chucVu}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Giới tính</Typography>
                            <RadioGroup
                                name='gioiTinh'
                                defaultValue={defaulValue?.gioiTinh}
                                value={formData?.gioiTinh}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                            </RadioGroup>
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
                            Thêm cán bộ
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
                            Cập nhật cán bộ
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}