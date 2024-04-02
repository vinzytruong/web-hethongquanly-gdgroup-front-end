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
import { Author } from '@/interfaces/author';
import useAuthor from '@/hooks/useAuthor';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import moment from 'moment';


export default function AuthorDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props
    const theme = useTheme()
    const [formData, setFormData] = useState<Author>();
    const { getAllProvince, dataProvince } = useProvince()
    const { addAuthor, updateAuthor } = useAuthor()
    const [loading, setLoaing] = useState<boolean>(false)
console.log(formData);


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
            console.log(dayjs(e).format('MM/DD/YYYY')); 
            setFormData((prevState: any) => ({
                ...prevState,
                ['ngaySinh']: dayjs(e).format('MM/DD/YYYY')
            }));
        }
    };
    const handleAdd = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        
        
        if (formData) addAuthor(formData)
        setLoaing(false);
        handleOpen(false)
    }
     
    const handleUpdate = (e: any) => {
        e.preventDefault();
        setLoaing(true);
        // console.log(formData); 
        
        if (formData) updateAuthor(formData)
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
                                    <Typography>Tên tác giả</Typography>
                                    <OutlinedInput
                                        name='tenTacGia'
                                        value={formData?.tenTacGia}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>CCCD</Typography>
                                    <OutlinedInput
                                        name='cccd'
                                        value={formData?.cccd}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Email</Typography>
                            <OutlinedInput
                                name='email'
                                style={{ width: '100%' }}
                                value={formData?.email}
                                onChange={handleChange}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Chức vụ</Typography>
                                    <OutlinedInput
                                        name='chucVuTacGia'
                                        style={{ width: '100%' }}
                                        value={formData?.chucVuTacGia}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Đơn vị công tác</Typography>
                                    <OutlinedInput
                                        name='donViCongTac'
                                        style={{ width: '100%' }}
                                        value={formData?.donViCongTac}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>

                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Môn chuyên ngành</Typography>
                            <OutlinedInput
                                name='monChuyenNghanh'
                                style={{ width: '100%' }}
                                value={formData?.monChuyenNghanh}
                                onChange={handleChange}
                            />
                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Ngày sinh</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                               
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        // defaultValue={formData?.ngaySinh}
                                        name='ngaySinh'
                                        sx={{ width: '100%' }}
                                        value={dayjs(formData?.ngaySinh)}
                                        onChange={handleChange}
                                    />
                                
                            </LocalizationProvider>

                        </Box>
                        <Box style={{ width: '100%' }}>
                            <Typography>Số điện thoại</Typography>
                            <TextField

                                name='soDienThoai'
                                style={{ width: '100%' }}
                                value={formData?.soDienThoai}
                                onChange={handleChange}
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
                            Thêm tác giả
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
                            Cập nhật tác giả
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}