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
import AnimateButton from '@/components/button/AnimateButton';
import { toast } from 'react-toastify';
import { CustomInput } from '@/components/input';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import { PlanWeek } from '@/interfaces/plan';
import usePlanWeek from '@/hooks/usePlanWeek';
import usePlanMonth from '@/hooks/usePlanMonth';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
    title?: string,
    defaulValue?: PlanWeek,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
    isEdit?: boolean;
    buttonActionText: string
}
export default function FormPlanWeek(props: Props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { updatePlanWeek, addPlanWeek, dataPlanWeek } = usePlanWeek()
    const { getAllPlanMonth, updatePlanMonth, addPlanMonth, dataPlanMonth, deleteMulPlanMonth } = usePlanMonth()
    const { userID, userName, dataStaffDepartment } = useRoleLocalStorage()
    console.log("react plan", dataStaffDepartment);

    const { handleOpen } = props;
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
    useEffect(() => {
        getAllPlanMonth()
    }, [])

    const onSubmit = async (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
        values.nam = dataPlanMonth.find(item => item.thangID === values.thangID)?.nam
        values.nguoiDuyet = dataStaffDepartment?.find(item => item.nhanVienID === values.nguoiDuyetID)?.tenNhanVien
        console.log("ds", values);
        dayjs(values.ngayBatDau).format('DD/MM/YYYY HH:mm:ss')
        values.tuNgay = dayjs(values.tuNgay).format('DD/MM/YYYY HH:mm:ss');
        values.denNgay = dayjs(values.denNgay).format('DD/MM/YYYY HH:mm:ss');
        if (props.isEdit) {
            const rs = await updatePlanWeek(values)

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

            const rs = await addPlanWeek(values)
            if (rs) {
                if (handleOpen) {
                    handleOpen(false)
                }
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

    return (
        <Formik
            initialValues={{
                noiDung: "",
                tieuDe: "",
                nam: 0,
                tuan_Thang: 0,
                thangID: 0,
                nguoiDuyetID: 0,
                tuNgay: dayjs().add(10, 'minute').toString(),
                denNgay: dayjs().add(120, 'minute').toString(),
                nguoiDuyet: ""
            }}
            validationSchema={Yup.object().shape({
                noiDung: Yup.string().required('Không được bỏ trống'),
                thangID: Yup.number().required('Không được bỏ trống'),
                nguoiDuyetID: Yup.number().required('Không được bỏ trống'),
                tieuDe: Yup.string().required('Không được bỏ trống'),
                tuan_Thang: Yup.number().required('Không được bỏ trống'),
                tuNgay: Yup.date()
                    .min(
                        new Date(),
                        'Thời gian bắt đầu không được trước thời điểm hiện tại'
                    )
                    .required('Thời gian bắt đầu không được bỏ trống'),
                denNgay: Yup.date()
                    .min(
                        Yup.ref('tuNgay'),
                        'Thời gian kết thúc không thể trước thời gian bắt đầu'
                    )
                    .required('Thời gian kết thúc không được bỏ trống'),
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

                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.thangID && errors.thangID)}>
                                    <Typography>Kế hoạch tháng <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        labelId="demo-simple-select-label-month"
                                        label="Tháng"
                                        name="thang"
                                        value={values.thangID}
                                        onChange={(e) => {
                                            setFieldValue('thangID', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >

                                        {dataPlanMonth?.filter(plan => plan?.createBy === userName).map((item, index) => (
                                            <MenuItem key={index} value={item.thangID}>Tháng {item.thang}: {item.tieuDe}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
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
                                        style={{ height: "150px", width: "100%", paddingBottom: "32px" }}
                                        className="w-full h-full mt-10 bg-white"
                                    />
                                    {touched.noiDung && errors.noiDung && (
                                        <FormHelperText error id="helper-text-noiDung">{errors.noiDung.toString()}</FormHelperText>
                                    )}
                                </FormControl>

                            </Grid>
                            {/* Từ ngày */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.tuNgay && errors?.tuNgay)}>
                                    <Typography>Từ ngày <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='tuNgay'
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            value={dayjs(values?.tuNgay)}
                                            onChange={(value) => {
                                                setFieldValue('tuNgay', value);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </LocalizationProvider>
                                    {touched.tuNgay && errors.tuNgay && (
                                        <FormHelperText error id="helper-text-tuNgay">{errors.tuNgay?.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {/* Đến ngày */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(touched?.denNgay && errors?.denNgay)}>
                                    <Typography>Đến ngày <span className="required_text">(*)</span>{" "}</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            name='denNgay'
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                },
                                            }}
                                            value={dayjs(values?.denNgay)}
                                            onChange={(value) => {
                                                setFieldValue('denNgay', value);
                                            }}
                                            disablePast={true}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </LocalizationProvider>
                                    {touched.denNgay && errors.denNgay && (
                                        <FormHelperText error id="helper-text-denNgay">{errors.denNgay?.toString()}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth error={Boolean(touched.tuan_Thang && errors.tuan_Thang)}>
                                    <Typography>Tuần <span className="required_text">(*)</span>{" "}</Typography>
                                    <Select
                                        labelId="demo-simple-select-label-week"
                                        label="Tuần"
                                        name="tuan_Thang"
                                        value={values.tuan_Thang}
                                        onChange={(e) => {
                                            setFieldValue('tuan_Thang', e.target.value);
                                        }}
                                        input={<CustomInput />}
                                    >

                                        {[1, 2, 3, 4, 5].map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
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

                                        {dataStaffDepartment?.length > 0 && dataStaffDepartment.map((item, index) => (
                                            <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
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