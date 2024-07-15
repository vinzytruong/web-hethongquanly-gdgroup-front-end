import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputAdornment,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Typography,
    useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/button/AnimateButton';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useOfficers from '@/hooks/useOfficers';
import useInteraction from '@/hooks/useInteraction';
import { step } from '@/constant';
import { useEffect, useState } from 'react';
import useProjectEstimate from '@/hooks/useProjectEstimate';
import { formatCurrencyNoUnit, removeCommasAndDots } from '@/utils/formatCurrency';
import { IconUpload } from '@tabler/icons-react';

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
    buttonActionText: string
}
const FormReportInteractValue = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    /* Custom Hook */
    const { addProjectEstimate, updateProjectEstimate, dataSteps, getAllSteps } = useProjectEstimate()

    const [fileCompany, setFileCompany] = useState<File | null>(null);
    const [fileProject, setFileProject] = useState<File | null>(null);
    const [fileCompanyBase64, setFileCompanyBase64] = useState<string | null>(null);
    const [fileProjectBase64, setFileProjectBase64] = useState<string | null>(null);
    const [valueResult, setValueResult] = useState<any>(null)

    useEffect(() => {
        getAllSteps()
    }, [])
    /* Default value */
    const handleFileCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileCompany(file)
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const fileBase64 = e.target.result as string;
                    setFileCompanyBase64(fileBase64)
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileProjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileProject(file)
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const fileBase64 = e.target.result as string;
                    setFileProjectBase64(fileBase64)
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        values.coQuanID = Number(values?.coQuanID)
        values.thoiGianKetThucDuKien = values.thoiGianKetThucDuKien.format("DD/MM/YYYY HH:mm:ss").toString()
        values.thoiGian = values.thoiGian.format("DD/MM/YYYY HH:mm:ss").toString()
        let rs;
        // Nếu như thêm mới
        console.log(values);
        if (!props?.isEdit) {
            values.coQuanID = Number(props?.id)
            values.doanhThuDuKien = Number(values.doanhThuDuKien)
            if (values.buocThiTruongId !== 5) {
                values.fileCoQuan = fileProjectBase64
                values.tenFileCoQuan = fileProject?.name
            }
            else {
                values.fileCoQuan = null
                values.tenFileCoQuan = null
            }
            values.fileCongTy = null,
                values.tenFileCongTy = null,

                rs = await addProjectEstimate(values)
        }
        // Nếu cập nhật
        else {
            // Nếu hoàn thành và đến bước cuối cùng
            if (values.buocThiTruongID === 7) {

                if (values.ketQua === "Thành công") {

                    rs = await updateProjectEstimate({
                        duToanID: Number(props?.id),
                        coQuanID: values.coQuanID,
                        tenDuToan: values.tenDuToan,
                        ketQua: true,
                        doanhThuThucTe: Number(values.doanhThuThucTe),
                        doanhThuDuKien: values?.doanhThuDuKien,
                        fileCoQuan: values.fileCoQuan,
                        tenFileCoQuan: values.tenFileCoQuan,
                        fileCongTy: values.fileCongTy,
                        tenFileCongTy: values.tenFileCongTy,
                        buocThiTruongID: values?.buocThiTruongID,
                        thoiGianKetThucDuKien: values?.thoiGianKetThucDuKien
                    }, Number(props?.id)!)
                }
                else {
                    rs = await updateProjectEstimate({
                        duToanID: Number(props?.id),
                        coQuanID: values.coQuanID,
                        tenDuToan: values.tenDuToan,
                        ketQua: false,
                        lyDoThatBai: values.lyDoThatBai,
                        fileCoQuan: values.fileCoQuan,
                        tenFileCoQuan: values.tenFileCoQuan,
                        fileCongTy: values.fileCongTy,
                        tenFileCongTy: values.tenFileCongTy,
                        buocThiTruongID: values?.buocThiTruongID,
                        doanhThuDuKien: values?.doanhThuDuKien,
                        thoiGian: values?.thoiGian,
                        thoiGianKetThucDuKien: values?.thoiGianKetThucDuKien
                    }, Number(values?.coQuanID!)!)
                }
            }
            // Nếu chưa hoàn thành tất cả bước
            else {
                rs = await updateProjectEstimate(values, values?.coQuanID!)
            }
        }
        // console.log("values", values);
        // const rs = props.isEdit ?  : 
        if (rs) {
            toast.success('Thành công')
            resetForm()
            props?.handleOpen!(false)
            setStatus({ success: true });
            setSubmitting(false);
        }
        else {
            setStatus({ success: false });
            setSubmitting(false);
            toast.error('Thất bại')
        }

    };



    return (
        <Formik
            initialValues={{
                coQuanID: props?.defaulValue?.coQuanID,
                tenDuToan: props.defaulValue?.tenDuToan,
                fileCoQuan: props.defaulValue?.fileCoQuan,
                tenFileCoQuan: props.defaulValue?.tenFileCoQuan,
                fileCongTy: props.defaulValue?.fileCongTy,
                tenFileCongTy: props.defaulValue?.tenFileCongTy,
                buocThiTruongID: props.defaulValue?.buocThiTruongID,
                doanhThuDuKien: props.defaulValue?.doanhThuDuKien,
                ghiChu: props.defaulValue?.ghiChu,
                ketQua: null,
                lyDoThatBai: props.defaulValue?.lyDoThatBai,
                doanhThuThucTe: props.defaulValue?.doanhThuThucTe,
                thoiGian: props.defaulValue?.thoiGian,
                thoiGianKetThucDuKien: props.defaulValue?.thoiGianKetThucDuKien,
            }}
            validationSchema={
                valueResult === "Thành công" ?
                    Yup.object().shape({
                        tenDuToan: Yup.string().required('Không được bỏ trống'),
                        buocThiTruongID: Yup.number().min(0).required('Không được bỏ trống'),
                        doanhThuDuKien: Yup.number().min(0).required('Không được bỏ trống'),
                        ketQua: Yup.string().required('Không được bỏ trống'),
                        doanhThuThucTe: Yup.number().required('Không được bỏ trống'),
                    })
                    :
                    valueResult === "Thất bại" ?
                        Yup.object().shape({
                            tenDuToan: Yup.string().required('Không được bỏ trống'),
                            buocThiTruongID: Yup.number().min(0).required('Không được bỏ trống'),
                            doanhThuDuKien: Yup.number().min(0).required('Không được bỏ trống'),
                            ketQua: Yup.string().required('Không được bỏ trống'),
                            lyDoThatBai: Yup.string().required('Không được bỏ trống'),
                        })
                        :
                        Yup.object().shape({
                            // thoiGianKetThucDuKien: Yup.date().required('Thời gian không được bỏ trống'),
                        })
            }
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.tenDuToan && errors.tenDuToan)}>
                                    <Typography>Tên dự toán <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        name='tenDuToan'
                                        style={{ width: '100%' }}
                                        value={values?.tenDuToan}
                                        onChange={handleChange}
                                    />
                                    {touched.tenDuToan && errors.tenDuToan && (
                                        <FormHelperText error>{errors.tenDuToan.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.buocThiTruongID && errors.buocThiTruongID)}>
                                    <Typography>Bước thị trường <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        name='buocThiTruongID'
                                        style={{ width: '100%' }}
                                        value={values?.buocThiTruongID}
                                        onChange={handleChange}
                                        fullWidth
                                        input={<CustomInput />}
                                    >
                                        {step?.slice(4, 7)?.map((item, index) => (
                                            <MenuItem key={index} value={item.buocThiTruongID}>{item.buocThiTruongTen}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.buocThiTruongID && errors.buocThiTruongID && (
                                        <FormHelperText error>{errors.buocThiTruongID.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.doanhThuDuKien && errors.doanhThuDuKien)}>
                                    <Typography>Doanh thu dự kiến <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        // type='number'
                                        name='doanhThuDuKien'
                                        style={{ width: '100%' }}
                                        value={formatCurrencyNoUnit(values?.doanhThuDuKien)}
                                        endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                        onChange={(e) => {
                                            setFieldValue('doanhThuDuKien', Number(removeCommasAndDots(e.target.value)));
                                        }}
                                    />
                                    {touched.doanhThuDuKien && errors.doanhThuDuKien && (
                                        <FormHelperText error>{errors.doanhThuDuKien.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.thoiGian && errors.thoiGian)}>
                                    <Typography>Thời gian tiếp xúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='thoiGian'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values.thoiGian)}
                                            onChange={(newValue) => {
                                                setFieldValue('thoiGian', newValue);
                                            }}
                                            disableFuture={true}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                    {touched.thoiGian && errors.thoiGian && (
                                        <FormHelperText error id="helper-text-thoiGian">{errors.thoiGian.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.thoiGianKetThucDuKien && errors.thoiGianKetThucDuKien)}>
                                    <Typography>Thời gian dự kiến kết thúc <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='thoiGianKetThucDuKien'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values?.thoiGianKetThucDuKien)}
                                            onChange={(newValue) => {
                                                setFieldValue('thoiGianKetThucDuKien', newValue);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider>
                                    {touched.thoiGianKetThucDuKien && errors.thoiGianKetThucDuKien && (
                                        <FormHelperText error>{errors.thoiGianKetThucDuKien.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.ghiChu && errors.ghiChu)}>
                                    <Typography>Ghi chú</Typography>
                                    <CustomInput
                                        name='ghiChu'
                                        multiline
                                        rows={2}
                                        style={{ width: '100%' }}
                                        value={values?.ghiChu}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>

                            {values?.buocThiTruongID === 7 && props?.isEdit &&
                                <>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth error={Boolean(touched.ketQua && errors.ketQua)}>
                                            <Typography>Kết quả <span className="required_text">(*)</span>{" "}</Typography>
                                            <Select
                                                style={{ width: '100%' }}
                                                name='ketQua'
                                                value={values?.ketQua}
                                                onChange={(e) => {
                                                    setFieldValue('ketQua', e.target.value);
                                                    setValueResult(e.target.value)

                                                }}
                                                fullWidth
                                                input={<CustomInput />}
                                            >
                                                {["Thành công", "Thất bại"]?.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                            {touched.ketQua && errors.ketQua && (
                                                <FormHelperText error>{errors.ketQua.toString()}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    {valueResult === "Thành công" ?
                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth error={Boolean(touched.doanhThuThucTe && errors.doanhThuThucTe)}>
                                                <Typography>Doanh thu thực tế <span className="required_text">(*)</span>{" "}</Typography>
                                                <CustomInput
                                                    // type='number'
                                                    name='doanhThuThucTe'
                                                    style={{ width: '100%' }}
                                                    value={formatCurrencyNoUnit(values?.doanhThuThucTe!)}
                                                    endAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                                    onChange={(e) => {
                                                        setFieldValue('doanhThuThucTe', Number(removeCommasAndDots(e.target.value)));
                                                    }}
                                                />
                                                {touched.doanhThuThucTe && errors.doanhThuThucTe && (
                                                    <FormHelperText error>{errors.doanhThuThucTe.toString()}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        :
                                        valueResult === "Thất bại" ?
                                            <Grid item xs={12} sm={12}>
                                                <FormControl fullWidth error={Boolean(touched.lyDoThatBai && errors.lyDoThatBai)}>
                                                    <Typography>Lý do thất bại <span className="required_text">(*)</span>{" "}</Typography>
                                                    <CustomInput
                                                        // type='number'
                                                        multiline
                                                        rows={3}
                                                        name='lyDoThatBai'
                                                        style={{ width: '100%' }}
                                                        value={values?.lyDoThatBai}
                                                        onChange={(e) => {
                                                            setFieldValue('lyDoThatBai', e.target.value);
                                                        }}
                                                    />
                                                    {touched.lyDoThatBai && errors.lyDoThatBai && (
                                                        <FormHelperText error>{errors.lyDoThatBai.toString()}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            : null
                                    }
                                </>


                            }


                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.fileCoQuan && errors.fileCoQuan)}>
                                    <Box sx={{ width: '100%', }}>
                                        <Typography>File dự toán <span className="required_text">(*)</span>{" "}</Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>

                                            {fileProject?.name ?
                                                <Chip
                                                    variant='outlined'
                                                    sx={{ borderRadius: "8px" }}
                                                    label={<Typography>{fileProject?.name}</Typography>}
                                                    onDelete={() => setFileProject(null)}
                                                />
                                                :
                                                <label htmlFor="raised-button-file-project">
                                                    <Button

                                                        startIcon={<IconUpload size={18} stroke={2.5} />}
                                                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 400 }}
                                                        variant="outlined"
                                                        size='large'
                                                        fullWidth
                                                        component="span" >
                                                        Tải file từ máy tính
                                                    </Button>
                                                </label>
                                            }

                                        </Box>

                                        <form className='form'>
                                            <input
                                                // accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                style={{ display: 'none' }}
                                                id="raised-button-file-project"
                                                multiple
                                                onChange={handleFileProjectChange}
                                                type="file"
                                            />
                                        </form>
                                    </Box>
                                    {touched.fileCoQuan && errors.fileCoQuan && (
                                        <FormHelperText error>{errors.fileCoQuan.toString()}</FormHelperText>
                                    )}
                                </FormControl>

                            </Grid>
                            {/* <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.fileCongTy && errors.fileCongTy)}>
                                    <Box sx={{ width: '100%', }}>
                                        <Typography>File công ty</Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>

                                            {fileCompany?.name ?
                                                <Chip
                                                    variant='outlined'
                                                    sx={{ borderRadius: "8px" }}
                                                    label={<Typography>{fileCompany?.name}</Typography>}
                                                    onDelete={() => setFileCompany(null)}
                                                />
                                                :
                                                <label htmlFor="raised-button-file">
                                                    <Button variant="outlined" size='large' fullWidth component="span" >
                                                        Tải file từ máy tính
                                                    </Button>
                                                </label>
                                            }

                                        </Box>

                                        <form className='form'>
                                            <input
                                                // accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                style={{ display: 'none' }}
                                                id="raised-button-file"
                                                multiple
                                                onChange={handleFileCompanyChange}
                                                type="file"
                                            />
                                        </form>
                                    </Box>
                                    {touched.fileCongTy && errors.fileCongTy && (
                                        <FormHelperText error>{errors.fileCongTy.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid> */}
                        </Grid>
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
export default FormReportInteractValue