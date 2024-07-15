import { useState, useEffect } from 'react';
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
import 'dayjs/locale/vi';
dayjs.locale('vi');
import { PlanMonth } from '@/interfaces/plan';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import usePlanMonth from '@/hooks/usePlanMonth';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
    title?: string,
    defaulValue?: PlanMonth,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isEdit?: boolean;
    buttonActionText: string
}
export default function FormPlanMonth(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { updatePlanMonth, addPlanMonth, dataPlanMonth } = usePlanMonth()
    const { userID, userName, dataStaffDepartment } = useRoleLocalStorage()
    const [content, setContent] = useState("");
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ align: [] }],
            [{ color: [] }],
            ["code-block"],
            ["clean"],
        ],
    };
    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "image",
        "align",
        "color",
        "code-block",
    ];

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        values.nam = Number(values?.nam.format("YYYY"))
        values.thang = Number(values?.thang.format("MM"))
        values.tuNgay = dayjs(`${values.nam}-${values.thang}-01`).startOf('month').format("DD/MM/YYYY HH:mm:ss").toString();
        values.denNgay = dayjs(`${values.nam}-${values.thang}-01`).endOf('month').format("DD/MM/YYYY HH:mm:ss").toString();
        values.nguoiDuyet = dataStaffDepartment?.find(item => item.nhanVienID === values.nguoiDuyetID)?.tenNhanVien

        if (props.isEdit) {
            const rs = await updatePlanMonth(values)

            if (rs) {
                toast.success('Cập nhật thành công')
                resetForm()
                setStatus({ success: true });
                setSubmitting(false);
            }
            else {
                setStatus({ success: false });
                setSubmitting(false);
                toast.error('Cập nhật thất bại')
            }
        }
        else {
            const rs = await addPlanMonth(values)
            if (rs) {
                toast.success('Thêm thành công')
                resetForm()
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



    console.log("plan react", dataStaffDepartment);

    return (
        <Formik
            initialValues={{
                noiDung: "",
                tieuDe: "",
                thang: dayjs().add(1, 'month'),
                nam: dayjs().add(1, 'month'),
                tuNgay: dayjs().add(10, 'minute').toString(),
                denNgay: dayjs().add(120, 'minute').toString(),
                nguoiDuyetID: 0,
                nguoiDuyet: ""
            }}
            validationSchema={Yup.object().shape({
                noiDung: Yup.string().required('Không được bỏ trống'),
                thang: Yup.date().required('Tháng không được bỏ trống'),
                nam: Yup.date().required('Năm không được bỏ trống'),
                nguoiDuyetID: Yup.number().required('Không được bỏ trống'),
                tieuDe: Yup.string().required('Không được bỏ trống'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Grid container spacing={matchDownSM ? 1 : 2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.tieuDe && errors.tieuDe)}>
                                    <Typography>Tiêu đề <span className="required_text">(*)</span>{" "}</Typography>
                                    <CustomInput
                                        id="outlined-adornment-tieuDe"
                                        type="text"
                                        value={values?.tieuDe}
                                        name="tieuDe"
                                        placeholder='Tiêu đề'
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue('tieuDe', e.target.value);
                                        }}
                                    />
                                    {touched.tieuDe && errors.tieuDe && (
                                        <FormHelperText error id="helper-text-tieuDe">{errors.tieuDe.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ mb: 4 }}>
                                <FormControl fullWidth error={Boolean(touched.noiDung && errors.noiDung)}>
                                    <Typography>Nội dung <span className="required_text">(*)</span>{" "}</Typography>
                                    {/* <CustomInput
                                        id="outlined-adornment-noiDung"
                                        type="text"
                                        value={values?.noiDung}
                                        name="noiDung"
                                        placeholder='Nội dung'
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue('noiDung', e.target.value);
                                        }}
                                        multiline
                                        rows={5}
                                    /> */}
                                    <QuillEditor
                                        value={content}
                                        onChange={(newContent) => {
                                            setContent(newContent);
                                            setFieldValue("noiDung", newContent);
                                        }}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={{ height: "150px", width: "100%" }}
                                        className="w-full h-full mt-10 bg-white"
                                    />
                                    {touched.noiDung && errors.noiDung && (
                                        <FormHelperText error id="helper-text-noiDung">{errors.noiDung.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.thang && errors.thang)}>
                                    <Typography>Tháng <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='thang'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values?.thang)}
                                            onChange={(value) => {
                                                setFieldValue('thang', value);
                                            }}
                                            openTo="month"
                                            views={['month']}
                                            disablePast={true}
                                            format="MM"
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.nam && errors.nam)}>
                                    <Typography>Năm <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            name='nam'
                                            sx={{ width: '100%' }}
                                            value={dayjs(values?.nam)}
                                            onChange={(value) => {
                                                setFieldValue('nam', value);
                                            }}
                                            openTo="year"
                                            views={['year']}
                                            disablePast={true}
                                            format="YYYY"
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.nguoiDuyetID && errors.nguoiDuyetID)}>
                                    <Typography>Người duyệt kế hoạch <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        labelId="demo-simple-select-label-month"
                                        label="Người duyệt kế hoạch"
                                        name="nguoiDuyetID"
                                        value={values.nguoiDuyetID}
                                        onChange={(e) => {
                                            setFieldValue('nguoiDuyetID', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >
                                        {dataStaffDepartment?.length > 0 && dataStaffDepartment.map((item) => (
                                            <MenuItem key={item.nhanVienID} value={item.nhanVienID}>
                                                {item.tenNhanVien}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

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