import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    Dialog,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { strengthColor, strengthIndicator } from '@/utils/passwordStrength';
import AnimateButton from '@/components/button/AnimateButton';
import useAuth from '@/hooks/useAuth';
import useRole from '@/hooks/useRole';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Staff } from '@/interfaces/user';

import useCompanys from '@/hooks/useCompanys'
import useStaff from '@/hooks/useStaff'
import useDerparmentOfCompany from '@/hooks/useDerparmentOfCompany'
import usePosition from '@/hooks/usePosition';
import useWork from '@/hooks/useWork';
import { TypeOfWork } from '@/interfaces/typeOfWork';
import axios from 'axios';
import { apiPort, getAllTypeOfWorks } from '@/constant/api';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import StyledIconButton from '../styled-button/StyledIconButton';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import { red } from '@mui/material/colors';
import { CreateWorkDto, CreateWorkFileDto, Work } from '@/interfaces/work';
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isEdit?: boolean;
    isInsert?: boolean;
    buttonActionText: string
}
const FormCreateAssign = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { title, defaulValue, handleOpen, open, isInsert } = props;
    /* Custom Hook */
    const { dataCompanys } = useCompanys()
    const { addWork, updateWork } = useWork()
    const { dataStaffDetailByPositionID, getAllStaffDetailByPositionID } = useStaff()

    /* State */
    const { dataPosition, getAllPositionByDepartment } = usePosition()
    const { dataDepartmentOfCompany, getAllDepartmentOfCompany } = useDerparmentOfCompany()
    const [selectedCongTy, setSelectedCongTy] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState(0);
    const [selectedPosition, setSelectedPosition] = useState(0);
    const [typeOfWorks, setTypeOfWorks] = useState<TypeOfWork[]>([]);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [openFile, setOpenFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    /* Default value */

    useEffect(() => {
        if (props.defaulValue?.congTyID) setSelectedCongTy(props.defaulValue?.congTyID);
        if (props.defaulValue?.phongBanID) setSelectedDepartment(props.defaulValue?.phongBanID);
        if (props.defaulValue?.chuVuID) setSelectedPosition(props.defaulValue?.chuVuID);
        console.log("cccccccccccccddđ", props.defaulValue?.fileCongViec);

        let arrayImage: CreateWorkFileDto[] = [];
        let arrayFile: CreateWorkFileDto[] = [];

        if (props.defaulValue?.fileCongViec && props.defaulValue?.fileCongViec.length > 0) {
            props.defaulValue?.fileCongViec.forEach((item: any) => {
                // Create a shallow copy of the item before modifying it
                let newItem = { ...item };
                if (newItem.loai === 1) {
                    arrayImage.push(newItem);
                } else {
                    arrayFile.push(newItem);
                }
            });
        }
        setImagePreviews(arrayImage);
        setFilePreviews(arrayFile);

    }, [props.defaulValue?.chuVuID, props.defaulValue?.congTyID, props.defaulValue?.phongBanID]);

    useEffect(() => {
        getAllDepartmentOfCompany(selectedCongTy)
    }, [selectedCongTy])

    useEffect(() => {
        getAllPositionByDepartment(selectedDepartment)
    }, [selectedDepartment])

    useEffect(() => {
        if (selectedPosition !== 0) getAllStaffDetailByPositionID(selectedPosition)
    }, [selectedPosition])


    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        // const startDate = new Date(values.ngayBatDau);
        // const endDate = new Date(values.ngayKetThuc);
        // const formattedStartDate = formatDate(startDate);
        // const formattedEndDate = formatDate(endDate);
        const nguoiThucHienTen = dataStaffDetailByPositionID.find((staff: any) => staff.nhanVienID === values?.nguoiThucHienID);
        const tenNhanVien = nguoiThucHienTen ? nguoiThucHienTen.tenNhanVien : '';
        let createCongViecDto: Work = {
            ...values,
            nguoiThucHienTen: tenNhanVien,
            ngayBatDau: dayjs(values.ngayBatDau).format('DD/MM/YYYY HH:mm:ss'),
            ngayKetThuc: dayjs(values.ngayKetThuc).format('DD/MM/YYYY HH:mm:ss')
        }
        let data: CreateWorkDto = {
            congViecDto: createCongViecDto,
            fileCongViecDto: [
                ...imagePreviews,
                ...filePreviews
            ]
        }
        if (props.isEdit) {
            data.congViecDto.congViecID = defaulValue.congViecID;
            const rs = await updateWork(data)
            if (rs) {
                toast.success('Cập nhật thành công')

                setStatus({ success: true });
                setSubmitting(false);
                // if (handleOpen) {
                //     handleOpen(false)
                // }
            }
            else {
                setStatus({ success: false });
                setSubmitting(false);
                toast.error('Cập nhật thất bại')
            }
        }
        else {
            const rs = await addWork(data)
            if (handleOpen) {
                handleOpen(false)
            }
            if (rs) {
                toast.success('Thêm thành công')
                setStatus({ success: true });
                setSubmitting(false);
            }
            else {
                setStatus({ success: false });
                setSubmitting(false);
                toast.error('Thêm thất bại')
            }
        }

    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }

                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllTypeOfWorks, { headers });

                setTypeOfWorks(response.data);
            } catch (error) {
                console.log(error);
            } finally {
            }
        };
        fetchData();
    }, []);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<{ fileUrl: string, fileType: string, fileName: string, fileID?: number | null }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePreviews, setFilePreviews] = useState<{ fileUrl: string, fileName: string, fileType: string, fileID?: number | null }[]>([]);
    const handleButtonClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };
    const handleButtonClickFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setOpenImage(true);
    };
    const handleDownloadFile = (file: string) => {
        const downloadUrl = `${apiPort}${file}`;
        window.open(downloadUrl, "_blank");
    };
    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imagesArray = Array.from(e.target.files);

            const readerPromises = imagesArray.map((image) => {
                return new Promise<{ fileUrl: string, fileType: string, fileName: string, fileID: number | null }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve({
                            fileUrl: base64String,
                            fileType: image.type,
                            fileName: image.name,
                            fileID: 0
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(image); // Read image as base64
                });
            });

            Promise.all(readerPromises).then(imageFiles => {
                setImagePreviews(prevState => [...prevState, ...imageFiles]);
            });

            e.target.value = "";
        }
    };
    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            const readerPromises = filesArray.map((file) => {
                return new Promise<{ fileUrl: string, fileName: string, fileType: string, fileID: number | null }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve({
                            fileUrl: base64String,
                            fileName: file.name,
                            fileType: file.type,
                            fileID: 0 // Assuming fileID is initially null for new uploads
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file); // Read file as base64
                });
            });

            Promise.all(readerPromises).then(fileObjects => {
                setFilePreviews(prevState => [...prevState, ...fileObjects]);
            });

            e.target.value = "";
        }
    };
    const handleFileClick = (file: File) => {
        setSelectedFile(file);
        setOpenFile(true);
    };

    const handleCloseFile = () => {
        setOpenFile(false);
        setSelectedFile(null);
    };
    const handleDeleteFile = (index: number) => {
        setFilePreviews(prevState => {
            const updatedPreviews = [...prevState];
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };
    const handleDeleteImage = (index: number) => {
        setImagePreviews(prevState => prevState.filter((_, i) => i !== index));
    };
    const handleClose = () => {
        setOpenImage(false);
        setSelectedImage(null);
    };
    console.log("files", filePreviews);
    console.log("images", imagePreviews);

    return (
        <Formik
            initialValues={{
                tenCongViec: props.defaulValue?.tenCongViec || '',
                moTa: props.defaulValue?.moTa,
                uuTienID: props.defaulValue?.uuTienID,
                ngayBatDau: props.defaulValue?.ngayBatDau ? dayjs(props.defaulValue.ngayBatDau).format('DD-MM-YYYY HH:mm:ss') : dayjs().add(10, 'minute').toString(),
                ngayKetThuc: props.defaulValue?.ngayKetThuc ? dayjs(props.defaulValue.ngayKetThuc).format('DD-MM-YYYY HH:mm:ss') : dayjs().add(120, 'minute').toString(),
                // nguoiThucHienID: [] as Array<number>,
                congTyID: props.defaulValue?.congTyID,
                phongBanID: props.defaulValue?.phongBanID,
                chuVuID: props.defaulValue?.chuVuID,
                nguoiThucHienID: props.defaulValue?.nguoiThucHienID,
                nhomCongViecID: props.defaulValue?.nhomCongViecID,
            }}
            validationSchema={Yup.object().shape({
                tenCongViec: Yup.string().max(255).required('Tên công việc không được bỏ trống'),
                moTa: Yup.string().max(2000).required('Mô tả công việc không được bỏ trống'),
                uuTienID: Yup.string().max(255).required('Mức độ ưu tiên không được bỏ trống'),
                ngayBatDau: Yup.date()

                    .required('Thời gian bắt đầu không được bỏ trống'),
                ngayKetThuc: Yup.date()
                    .min(
                        Yup.ref('ngayBatDau'),
                        'Thời gian kết thúc không thể trước thời gian bắt đầu'
                    )
                    .required('Thời gian kết thúc không được bỏ trống'),
                nguoiThucHienID: Yup.number().required('Người được giao việc không được bỏ trống'),
                congTyID: Yup.string().required('Tên công ty không được bỏ trống'),
                phongBanID: Yup.string().required('Phòng ban không được bỏ trống'),
                chuVuID: Yup.number().required('Chức vụ không được bỏ trống'),
                nhomCongViecID: Yup.number().required('Loại công việc không được bỏ trống')
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.tenCongViec && errors.tenCongViec)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Tên công việc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <TextField
                                        id="outlined-adornment-tenCongViec"
                                        type="text"
                                        value={values.tenCongViec}
                                        name="tenCongViec"
                                        placeholder='Tên công việc'
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {touched.tenCongViec && errors.tenCongViec && (
                                        <FormHelperText error id="helper-text-tenCongViec">{errors.tenCongViec.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.moTa && errors.moTa)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Mô tả công việc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <CustomInput
                                        id="outlined-adornment-moTa"
                                        type='text'
                                        value={values.moTa}
                                        multiline
                                        minRows={3}
                                        name="moTa"
                                        placeholder="Mô tả công việc"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.moTa && errors.moTa && (
                                        <FormHelperText error id="helper-text-moTa">{errors.moTa.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.ngayBatDau && errors.ngayBatDau)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Ngày bắt đầu <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='ngayBatDau'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values.ngayBatDau)}
                                            onChange={(newValue) => {
                                                setFieldValue('ngayBatDau', newValue);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm:ss"
                                        />
                                    </LocalizationProvider>
                                    {touched.ngayBatDau && errors.ngayBatDau && (
                                        <FormHelperText error id="helper-text-ngayBatDau">{errors.ngayBatDau.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.ngayKetThuc && errors.ngayKetThuc)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Ngày kết thúc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='ngayKetThuc'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values.ngayKetThuc)}
                                            onChange={(newValue) => {
                                                setFieldValue('ngayKetThuc', newValue);
                                            }}
                                            minDateTime={dayjs(values.ngayBatDau)}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm:ss"
                                        />
                                    </LocalizationProvider>
                                    {touched.ngayKetThuc && errors.ngayKetThuc && (
                                        <FormHelperText error id="helper-text-ngayKetThuc">{errors.ngayKetThuc}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.uuTienID && errors.uuTienID)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Mức độ ưu tiên <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        labelId="uuTienID-label"
                                        id="uuTienID-select"
                                        name="uuTienID"
                                        value={values.uuTienID}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        displayEmpty
                                    >
                                        {['Thấp', 'Trung bình', 'Cao'].map((item, index) => (
                                            <MenuItem key={index} value={index + 1}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.uuTienID && errors.uuTienID && (
                                        <FormHelperText error id="helper-text-uuTienID">{errors.uuTienID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.nhomCongViecID && errors.nhomCongViecID)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Loại công việc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        labelId="nhomCongViecID-label"
                                        id="nhomCongViecID-select"
                                        name="nhomCongViecID"
                                        value={values.nhomCongViecID}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        displayEmpty
                                    >
                                        {typeOfWorks?.length > 0 && typeOfWorks.map((item, index) => (
                                            <MenuItem key={index} value={item.nhomCongViecID}>{item.tenNhomCongViec}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.nhomCongViecID && errors.nhomCongViecID && (
                                        <FormHelperText error id="helper-text-nhomCongViecID">{errors.nhomCongViecID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.congTyID && errors.congTyID)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Tên công ty <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        labelId="congTyID-label"
                                        id="congTyID-select"
                                        name="congTyID"
                                        value={values.congTyID}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedCongTy(Number(e.target.value));
                                        }}
                                        onBlur={handleBlur}
                                        displayEmpty
                                    >
                                        {dataCompanys.length > 0 && dataCompanys.map((item, index) => (
                                            <MenuItem key={item.congTyID} value={item.congTyID}>{item.tenCongTy}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.congTyID && errors.congTyID && (
                                        <FormHelperText error id="helper-text-congTyID">{errors.congTyID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.phongBanID && errors.phongBanID)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Phòng/ban <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        labelId="phongBanID-label"
                                        id="outlined-adornment-phongBanID"
                                        name="phongBanID"
                                        value={values.phongBanID}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedDepartment(Number(e.target.value));
                                        }}
                                        onBlur={handleBlur}
                                        displayEmpty
                                    >
                                        {dataDepartmentOfCompany?.length > 0 && dataDepartmentOfCompany.map((item, index) => (
                                            <MenuItem key={item.phongBanID} value={item.phongBanID}>{item.tenPhongBan}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.phongBanID && errors.phongBanID && (
                                        <FormHelperText error id="helper-text-phongBanID">{errors.phongBanID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.chuVuID && errors.chuVuID)}   >
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Chức vụ <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        id="outlined-adornment-chuVuID-register"
                                        name="chuVuID"
                                        value={values.chuVuID}
                                        onChange={(e) => { handleChange(e); setSelectedPosition(e.target.value) }}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {dataPosition?.length > 0 && dataPosition?.map((item, index) => (
                                            <MenuItem key={index} value={item.chucVuID}>{item.tenChucVu}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.chuVuID && errors.chuVuID && (
                                        <FormHelperText error id="standard-weight-helper-text-chucVuID-register">{errors.chuVuID.toString()} </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.nguoiThucHienID && errors.nguoiThucHienID)}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Người được giao việc <span className="required_text">(*)</span>{" "}
                                    </Typography>
                                    <Select
                                        name='nguoiThucHienID'
                                        value={values.nguoiThucHienID}
                                        onChange={(e) => handleChange(e)}
                                        input={<CustomInput />}
                                        displayEmpty
                                    // multiple
                                    // renderValue={(selected) => {
                                    //     const renderSelectedNames = (selectedIds: number[], data: Staff[]) => {
                                    //         const selectedNames = data
                                    //             .filter(item => selectedIds.includes(item.nhanVienID))
                                    //             .map(item => item.tenNhanVien);
                                    //         return selectedNames.join(', ');
                                    //     };
                                    //     return renderSelectedNames(selected as number[], dataStaff);
                                    // }}
                                    >
                                        {dataStaffDetailByPositionID?.map((item, index) => (
                                            <MenuItem key={item.nhanVienID} value={item.nhanVienID}>
                                                {/* <Checkbox
                                                    checked={values.nguoiThucHienID.includes(item.nhanVienID)}
                                                />
                                                <ListItemText primary={item.tenNhanVien} /> */}
                                                {item.tenNhanVien}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.nguoiThucHienID && errors.nguoiThucHienID && (
                                        <FormHelperText error id="helper-text-phongBanID">{errors.nguoiThucHienID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Box style={{ width: "100%" }}>
                                {isInsert ? (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Hình ảnh
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                            {imagePreviews.map((image, index) => (
                                                <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <img src={image.fileUrl} alt={`Uploaded Image ${index}`} style={{ maxWidth: '100px', marginRight: '10px' }} onClick={() => handleImageClick(image.fileUrl)} />
                                                    <ClearIcon
                                                        sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: red[500] }}
                                                        onClick={() => handleDeleteImage(index)} />
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            onClick={handleButtonClick}
                                        >
                                            Chọn hình ảnh
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Hình ảnh liên quan
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                            {imagePreviews.map((image, index) => (
                                                <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <img src={apiPort + image.fileUrl} alt={`Uploaded Image ${index}`} style={{ maxWidth: '100px', marginRight: '10px' }} onClick={() => handleImageClick(apiPort + image.fileUrl)} />
                                                    <ClearIcon
                                                        sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: red[500] }}
                                                        onClick={() => handleDeleteImage(index)} />
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            onClick={handleButtonClick}
                                        >
                                            Chọn hình ảnh
                                        </Button>
                                    </>
                                )}
                                <div>
                                    <Box>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: "none" }}
                                            ref={imageInputRef}
                                            onChange={handleChangeImage}
                                        />
                                    </Box>
                                </div>
                            </Box>
                            <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                {isInsert ? (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Tệp đính kèm
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                            {filePreviews.map((file, index) => (
                                                <Box key={index} sx={{ position: 'relative', mb: 1 }}>
                                                    <Typography variant="body1" component="span" sx={{ cursor: 'pointer' }}>
                                                        {file.fileName}
                                                    </Typography>
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleDeleteFile(index)}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            onClick={handleButtonClickFile}
                                        >
                                            Chọn tệp
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Cập nhật tệp đính kèm
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                            {filePreviews.map((file, index) => (
                                                <Box key={index} sx={{ position: 'relative', mb: 1 }}>
                                                    <Typography variant="body1" component="span" sx={{ cursor: 'pointer' }}>
                                                        {file.fileName}
                                                    </Typography>
                                                    <IconButton>
                                                        <FileDownloadIcon
                                                            sx={{ ml: 1, cursor: 'pointer' }}
                                                            onClick={() => handleDownloadFile(file.fileUrl!)}
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleDeleteFile(index)}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>

                                                </Box>
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            onClick={handleButtonClickFile}
                                        >
                                            Chọn tệp
                                        </Button>
                                    </>
                                )}
                                <div>
                                    <Box>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            multiple
                                            style={{ display: "none" }}
                                            ref={fileInputRef}
                                            onChange={handleChangeFile}
                                        />
                                    </Box>
                                </div>

                                {/* Modal or enlarged view logic can be added similar to the image handling */}
                            </Box>
                        </Grid>
                        <Dialog open={openImage} onClose={handleClose} maxWidth="lg">
                            <img src={selectedImage!} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
                        </Dialog>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                {props.buttonActionText}
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik >
    )
}
export default FormCreateAssign