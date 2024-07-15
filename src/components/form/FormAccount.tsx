import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from "@mui/material"
import { StyledButton } from "@/components/styled-button";
import { useEffect, useState, forwardRef } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    useMediaQuery,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Radio,
    Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useStaff from "@/hooks/useStaff";
import dayjs from 'dayjs';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { CustomInput } from "../input";

export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

const CustomButton = styled(Button)(({ }) => ({
    textTransform: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    }
}));


const FormProfile = (props: Props) => {

    const { defaulValue } = props
    const { resetPasswordStaff, changeUserNameStaff, deleteStaff2, lockStaff, unLockStaff } = useStaff()

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    const handleClickOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const [statusAccont, setStatusAccount] = useState(defaulValue?.active ? defaulValue?.active : true)
    const [newPassword, setNewPassword] = useState('')
    const [newNameLogin, setNewNameLogin] = useState('')

    const handleChangePassword = async () => {
        if (newPassword === '') toast.warning('Mật khẩu không được rỗng')
        else {
            let status = await resetPasswordStaff(defaulValue.nhanVienID, newPassword)
            if (status === 200) toast.success('Thay đổi mật khẩu thành công')
            else toast.error('Thay đổi mật khẩu thất bại');
        }
    }

    const handleChangeUserName = async () => {
        if (newNameLogin === '') toast.warning('Tên đăng nhập không được rỗng')
        else {
            let status = await changeUserNameStaff(defaulValue.nhanVienID, newNameLogin)
            if (status === 200) toast.success('Thay đổi tên đăng nhập thành công')
            else toast.error('Thay đổi tên đăng nhập thất bại');
        }
    }

    const handleLockAccount = async () => {
        let status = statusAccont ? await lockStaff(defaulValue.nhanVienID) : await unLockStaff(defaulValue.nhanVienID)
        if (status === 200) toast.success(`${statusAccont ? 'Khóa' : 'Mở khóa'} tài khoản thành công`)
        else toast.error(`${statusAccont ? 'Khóa' : 'Mở khóa'} tài khoản thất bại`)
        setOpen1(false)
        setStatusAccount(!statusAccont)
    }

    const handleDeleteAccount = async () => {
        let status = await deleteStaff2(defaulValue.nhanVienID)
        if (status === 200) toast.success('Xóa tài khoản thành công')
        else toast.error('Xóa tài khoản thất bại')
        setOpen2(false)
    }

    return (defaulValue ? <>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <Grid container spacing={2} alignItems={'flex-end'}>
                    <Grid item xs={12} sm={12} lg={8} xl={10}>
                        <FormControl sx={{ width: '100%' }}>
                            <Typography>Tên đăng nhập mới</Typography>
                            <CustomInput
                                fullWidth
                                id="outlined-adornment-tenNhanVien-register"
                                type='text'
                                onChange={(e) => setNewNameLogin(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4} xl={2}>
                        <Box minWidth={150}>
                            <Button
                                variant="contained"
                                sx={{ height: '55px', borderRadius: '8px', textTransform: 'capitalize', ":hover": { backgroundColor: '#00CCFF' } }}
                                size="large"
                                fullWidth
                                onClick={() => handleChangeUserName()}
                                startIcon={<BadgeIcon />}
                            >
                                Đổi tên đăng nhập
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Grid container spacing={2} alignItems={'flex-end'}>
                    <Grid item xs={12} sm={12} lg={8} xl={10}>
                        <FormControl sx={{ width: '100%' }}>
                            <Typography>Mật khẩu mới</Typography>
                            <CustomInput
                                fullWidth
                                id="outlined-adornment-tenNhanVien-register"
                                type='text'
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4} xl={2}>
                        <Box minWidth={150}>
                            <Button
                                sx={{ height: '55px', borderRadius: '8px', textTransform: 'capitalize', ":hover": { backgroundColor: '#00CCFF' } }}
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => handleChangePassword()}
                                startIcon={<VpnKeyIcon />}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={2} pt={3}>
                    <CustomButton
                        variant="contained"
                        sx={{
                            backgroundColor: statusAccont ? '#FF9933' : '#33CCFF',
                            ":hover": {
                                backgroundColor: statusAccont ? '#FF9900' : '#33CCFF'
                            }
                        }}
                        size="large"
                        onClick={() => statusAccont ? handleClickOpen1() : handleLockAccount()}
                        startIcon={statusAccont ? <LockIcon /> : <LockOpenIcon />}
                    >
                        {statusAccont ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    </CustomButton>
                    <CustomButton
                        variant="contained"
                        sx={{
                            backgroundColor: '#EE0000',
                            ":hover": {
                                backgroundColor: '#DD0000'
                            }
                        }}
                        size="large"
                        onClick={() => handleClickOpen2()}
                        startIcon={<DeleteIcon />}
                    >
                        Xóa tài khoản
                    </CustomButton>
                </Stack>
            </Grid>
        </Grid >
        <Dialog
            open={open1}
            onClose={handleClose1}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>
                {`Xác nhận khóa tài khoản nhân viên ${defaulValue.tenNhanVien}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: 'red' }}>
                    Việc khóa tài khoản sẽ làm cho nhân viên không thể truy cập hệ thống. Bạn chắc chắn muốn khóa chứ ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose1}>Quay lại</Button>
                <Button onClick={() => handleLockAccount()} autoFocus sx={{ color: 'red' }}>
                    Khóa
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={open2}
            onClose={handleClose2}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ color: 'red' }}>
                {`Xác nhận xóa tài khoản nhân viên ${defaulValue.tenNhanVien}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: 'red' }}>
                    Việc xóa tài khoản là một hành động gây nguy hiểm và không thể hoàn tác. Bạn chắc chắn muốn xóa chứ ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose2}>Quay lại</Button>
                <Button onClick={() => handleDeleteAccount()} autoFocus sx={{ color: 'red' }}>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    </>
        :
        <Typography>Lỗi lấy dữ liệu </Typography>

    )
}
export default FormProfile;