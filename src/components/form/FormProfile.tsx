import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from "@mui/material"
import { useEffect, useState, forwardRef } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {
    FormControl,
    FormHelperText,
    InputLabel,
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
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CustomInput } from "../input";
import Certificate from "@/views/admin/profile/certificate";
import { apiPort } from "@/constant/api";
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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

interface Image {
    fileID: number | null
    fileName: string;
    fileType: string;
    fileUrl: string;
    loaiID: number;
}


interface UserInfo {
    nhanVienID?: number;
    tenNhanVien: string;
    anhdaidien: string;
    vanbang: string[]
    gioiTinh: string;
    email: string;
    diaChi: string;
    soDienThoai: string;
    ngaySinh: string;
    ngayKyHopDong: string;
    lstChucVuView: string[];
    lstFile: Image[];
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const FormProfile = (props: Props) => {

    const { defaulValue } = props

    const { updateStaff } = useStaff();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [image, setImage] = useState<File | null>(null);
    const [newavatar, setNewAvatar] = useState<Image | null>(null);       // Ảnh đại diện mới
    const [newDiploma, setNewDiploma] = useState<Image[]>([]);            // Danh sách văn bằng cũ + mới
    const [isImageProcessed, setIsImageProcessed] = useState(false)       // Status Xử lý ảnh
    const [userInfo, setUserInfo] = useState<UserInfo>();

    const renderImage = () => {
        if (image) {
            const { name, type } = image;
            if (!isImageProcessed || newavatar?.fileName !== name) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileUrl = e.target?.result as string;
                    const imageAvatar = {
                        fileID: null,
                        fileName: name,
                        fileType: type,
                        fileUrl: fileUrl,
                        loaiID: 1
                    };
                    setNewAvatar(imageAvatar);
                    setIsImageProcessed(true);
                };
                reader.readAsDataURL(image);
            }
            return URL.createObjectURL(new Blob([image!], { type: image?.type }))
        } else if (userInfo?.anhdaidien) {
            return apiPort + userInfo?.anhdaidien
        }
        return '/images/no-data-1.png'
    }


    const handleInputChangeDate = (date: any) => {
        if (date) {
            setUserInfo(prevState => {
                return {
                    ...prevState,
                    ngaySinh: date,
                } as UserInfo;
            });
        }
    };

    const handleInputChangeDateContract = (date: any) => {
        if (date) {
            setUserInfo(prevState => {
                return {
                    ...prevState,
                    ngayKyHopDong: date,
                } as UserInfo;
            });
        }
    };


    useEffect(() => {
        if (defaulValue) {

            let dataImage = ''
            let dataVanBang = new Array();

            if (defaulValue.lstFile && defaulValue.lstFile?.length > 0) {
                defaulValue.lstFile.map((item: Image) => {
                    if (item?.loaiID === 1) {
                        dataImage = `${item.fileUrl}`
                    }
                    dataVanBang.push(item)
                })
            }
            setNewDiploma(dataVanBang)

            const nam = defaulValue.ngaySinh?.slice(0, 10).split("/")?.[2]
            const thang = defaulValue.ngaySinh?.slice(0, 10).split("/")?.[1]
            const ngay = defaulValue.ngaySinh?.slice(0, 10).split("/")?.[0]
            const convertFromDate = dayjs(`${nam}-${thang}-${ngay}`).format("DD/MM/YYYY HH:mm:ss")

            const nam2 = defaulValue.ngayKyHopDong?.slice(0, 10).split("/")?.[2]
            const thang2 = defaulValue.ngayKyHopDong?.slice(0, 10).split("/")?.[1]
            const ngay2 = defaulValue.ngayKyHopDong?.slice(0, 10).split("/")?.[0]
            const convertFromDatengayKyHopDong = dayjs(`${nam2}-${thang2}-${ngay2}`).format("DD/MM/YYYY HH:mm:ss")

            setUserInfo({
                nhanVienID: defaulValue.nhanVienID,
                tenNhanVien: defaulValue.tenNhanVien || "",
                anhdaidien: dataImage,
                vanbang: dataVanBang,
                gioiTinh: defaulValue.gioiTinh === 'Nam' ? 'Nam' : 'Nữ',
                email: defaulValue.email || "",
                diaChi: defaulValue.diaChi || "",
                soDienThoai: defaulValue.soDienThoai || "",
                ngaySinh: defaulValue?.ngaySinh ? convertFromDate : '01/01/0001 00:00:00',
                ngayKyHopDong: defaulValue?.ngayKyHopDong ? convertFromDatengayKyHopDong : '01/01/0001 00:00:00',
                lstChucVuView: [],
                lstFile: [],
            });
        }
    }, [defaulValue]);


    const handleGetDefaltGender = () => {                   // Tạm fix lỗi thay đổi giới tính trong Formik
        return defaulValue?.gioiTinh
    }

    const handleGenderChange = () => {                      // Tạm fix lỗi thay đổi giới tính trong Formik

        setUserInfo(prevState => {
            return {
                ...prevState,
                gioiTinh: userInfo?.gioiTinh === 'Nam' ? 'Nữ' : 'Nam'
            } as UserInfo;
        });
    }

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            setStatus({ success: true });
            setSubmitting(false);
            let status = await updateStaff(values, newavatar, newDiploma);
            if (status === 200) toast.success(`Cập nhật thông tin cho tài khoản ${values?.tenNhanVien} thành công`)
            else toast.error(`Cập nhật thông tin cho tài khoản ${values?.tenNhanVien} thất bại`)
        }
        catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    const formatDate = () => {
        const dateFormat = 'DD/MM/YYYY HH:mm:ss';
        if (defaulValue?.ngaySinh !== null) {
            return dayjs(defaulValue?.ngaySinh, dateFormat);
        } else {
            return dayjs('', dateFormat);
        }
    }

    const formatDateContract = () => {
        const dateFormat = 'DD/MM/YYYY HH:mm:ss';
        if (defaulValue?.ngayKyHopDong !== null) {
            return dayjs(defaulValue?.ngayKyHopDong, dateFormat);
        } else {
            return dayjs('', dateFormat);
        }
    }

    console.log('defaulValue', defaulValue);

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    email: userInfo?.email,
                    soDienThoai: userInfo?.soDienThoai,
                    tenNhanVien: userInfo?.tenNhanVien,
                    ngaySinh: userInfo?.ngaySinh,
                    ngayKyHopDong: userInfo?.ngayKyHopDong,
                    gioiTinh: userInfo?.gioiTinh,
                    diaChi: userInfo?.diaChi,
                    nhanVienID: userInfo?.nhanVienID,

                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().max(255),
                    soDienThoai: Yup.string().max(255),
                    tenNhanVien: Yup.string().max(255),
                    diaChi: Yup.string().max(255),
                })}
                onSubmit={onSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Box

                                    display='flex'
                                    flexDirection='column'
                                    justifyContent='center'
                                    alignItems='center'

                                >
                                    <Grid container spacing={matchDownSM ? 1 : 2} pt={1}>
                                        <Grid item xs={12} sm={12}>
                                            <Grid container spacing={matchDownSM ? 1 : 2} pt={1}>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Typography>Ảnh đại diện</Typography>
                                                    <Box
                                                        display='flex'
                                                        flexDirection='column'
                                                        justifyContent='center'
                                                        alignItems='center'
                                                        px={3}
                                                        py={3}
                                                        sx={{ border: `1px solid ${theme.palette.text.secondary}`, borderRadius: '8px' }}
                                                    >
                                                        <Box sx={{
                                                            pb: { xs: 8, md: 10 },
                                                            mb: 3,
                                                            width: { xs: 60, md: 120 },
                                                            height: { xs: 60, md: 120 },
                                                            backgroundSize: 'cover',
                                                            objectFit: 'contain',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'center',
                                                            backgroundImage: `url('${renderImage()}')`,
                                                            borderRadius: '50%',
                                                            border: `1px dashed ${theme.palette.primary.main}`
                                                        }} />

                                                        <input
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            id="raised-button-file"
                                                            multiple
                                                            onChange={(event: any) => setImage(event.target.files[0])}
                                                            type="file"
                                                        />
                                                        <label htmlFor="raised-button-file">
                                                            <Button variant="outlined" size='large' fullWidth component="span" >
                                                                Tải ảnh lên
                                                            </Button>
                                                        </label>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Stack direction={'column'} spacing={2}>
                                                        <FormControl fullWidth error={Boolean(touched.nhanVienID && errors.nhanVienID)}   >
                                                            <Typography>Mã nhân viên</Typography>
                                                            <CustomInput
                                                                id="outlined-adornment-nhanVienID-register"
                                                                type='text'
                                                                value={values.nhanVienID}
                                                                readOnly
                                                                name="nhanVienID"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.nhanVienID && errors.nhanVienID && (
                                                                <FormHelperText error id="standard-weight-helper-text-nhanVienID-register">{errors.nhanVienID.toString()} </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                        <FormControl fullWidth error={Boolean(touched.tenNhanVien && errors.tenNhanVien)}   >
                                                            <Typography>Họ và tên<sup style={{ color: 'red', fontSize: '12px' }}> (*)</sup></Typography>
                                                            <CustomInput
                                                                id="outlined-adornment-tenNhanVien-register"
                                                                type='text'
                                                                value={values.tenNhanVien}
                                                                name="tenNhanVien"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                            />
                                                            {touched.tenNhanVien && errors.tenNhanVien && (
                                                                <FormHelperText error id="standard-weight-helper-text-tenNhanVien-register"> {errors.tenNhanVien.toString()} </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                        <FormControl>
                                                            <Typography>Giới tính</Typography>
                                                            <RadioGroup
                                                                id="demo-radio-buttons-group-label"
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                defaultValue={handleGetDefaltGender}
                                                                onChange={() => handleGenderChange()}

                                                            >
                                                                <Box sx={{ display: "flex" }}>
                                                                    <FormControlLabel value="Nam" control={<Radio size="small" />} label="Nam" />
                                                                    <FormControlLabel value="Nữ" control={<Radio size="small" />} label="Nữ" />
                                                                </Box>
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth error={Boolean(touched.soDienThoai && errors.soDienThoai)}>
                                                <Typography>Số điện thoại</Typography>
                                                <CustomInput
                                                    id="outlined-adornment-soDienThoai-register"
                                                    type='text'
                                                    value={values.soDienThoai}
                                                    name="soDienThoai"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.soDienThoai && errors.soDienThoai && (
                                                    <FormHelperText error id="standard-weight-helper-text-soDienThoai-register">{errors.soDienThoai.toString()}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth error={Boolean(touched.ngaySinh && errors.ngaySinh)}   >
                                                <Typography>Ngày sinh</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name='ngaySinh'
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                            },

                                                        }}
                                                        value={formatDate()}
                                                        onChange={(value) => handleInputChangeDate(value)}
                                                        disableFuture={true}
                                                        format="DD/MM/YYYY"

                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth error={Boolean(touched.ngayKyHopDong && errors.ngayKyHopDong)}   >
                                                <Typography>Ngày ký hợp đồng lao động</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name='ngayKyHopDong'
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                            },

                                                        }}
                                                        value={formatDateContract()}
                                                        onChange={(value) => handleInputChangeDateContract(value)}
                                                        format="DD/MM/YYYY"

                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.email && errors.email)}   >
                                                <Typography>Email</Typography>
                                                <CustomInput
                                                    id="outlined-adornment-email-register"
                                                    type='text'
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-register">{errors.email}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.diaChi && errors.diaChi)}   >
                                                <Typography>Địa chỉ</Typography>
                                                <CustomInput
                                                    id="outlined-adornment-email-register"
                                                    type='text'
                                                    value={values.diaChi}
                                                    name="diaChi"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    inputProps={{}}
                                                />
                                                {touched.diaChi && errors.diaChi && (
                                                    <FormHelperText error id="standard-weight-helper-text-diaChi-register">{errors.diaChi}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <Stack direction={'column'} spacing={0}>
                                                <Typography>
                                                    Văn bằng / chứng chỉ
                                                </Typography>
                                                <Certificate newDiploma={newDiploma} setNewDiploma={setNewDiploma} />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2 }} display='flex' justifyContent='flex-end'>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained">
                                            Cập nhật
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik >
        </>

    )
}
export default FormProfile;