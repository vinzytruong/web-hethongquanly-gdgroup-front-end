import { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Input,
    InputAdornment,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { addUnit } from "@/constant/api";
import useUnits from "@/hooks/useUnits";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { useFormik } from "formik";
import * as yup from "yup";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Units } from "@/interfaces/units";
import { Box, Button, useTheme } from "@mui/material";
import { prices } from "@/interfaces/prices";
export const validationUtilizedObjectSchema = yup.object({
    column: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    rowStart: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    rowEnd: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    isShowTCKT: yup.string().required("Vui lòng chọn kiểu tiêu chuẩn kỹ thuật"),
    priceCode: yup.string().required("Vui lòng chọn kiểu giá bán"),
});
export interface Props {
    title: string;
    defaulValue?: any;
    isInsert?: boolean;
    isUpdate?: boolean;
    open: boolean;
    note?: string;
    id?: number;
    idParent?: number;
    file?: File | null;
    handleUploadFile?: (file: any, column: number, row: number) => void;
    handleOpen: (e: boolean) => void;
    handlSaveFile?: (file: any, column: number, rowStart: number, rowEnd: number, isShowFullTCKT: string, priceCode: string) => void;
    fetchData?: () => void;
}

export default function QuoteUploadFileDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id, handlSaveFile, note } = props
    const theme = useTheme()
    const [file, setFile] = useState<File | null>(null);
    const [entityError, setEntityError] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (!open) setFile(null)
    }, [open])
    const formik = useFormik({
        initialValues: {
            column: defaulValue?.tenDVT ?? "",
            rowStart: defaulValue?.rowStart ?? "",
            rowEnd: defaulValue?.rowEnd ?? "",
            isShowTCKT: defaulValue?.isShowTCKT ?? 0,
            priceCode: defaulValue?.priceCode ?? "",
            isShowGiaVon: 'false'
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);

            try {
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });
    const handleSaveForm = (file: File) => {
        handlSaveFile!(file, formik.values.column, formik.values.rowStart, formik.values.rowEnd, formik.values.isShowTCKT, formik.values.priceCode);
        formik.resetForm();
    };
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
                <DialogContent sx={{ px: 3 }} >
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="12px"
                        >
                            {entityError && (
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography
                                            sx={{ mb: 1.5, fontWeight: "bold" }}
                                            className="required_text"
                                        >
                                            {JSON.stringify(entityError)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Cột tên sản phẩm <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="column"
                                                    name="column"
                                                    value={formik.values.column}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.column &&
                                                        Boolean(formik.errors.column)
                                                    }
                                                />
                                                {formik.touched.column &&
                                                    Boolean(formik.errors.column) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.column
                                                                ? formik.errors.column.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Hàng đầu tiên đọc dữ liệu <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="rowStart"
                                                    name="rowStart"
                                                    value={formik.values.rowStart}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.rowStart &&
                                                        Boolean(formik.errors.rowStart)
                                                    }
                                                />
                                                {formik.touched.rowStart &&
                                                    Boolean(formik.errors.rowStart) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.rowStart
                                                                ? formik.errors.rowStart.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Hàng kết thúc dữ liệu <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="rowEnd"
                                                    name="rowEnd"
                                                    value={formik.values.rowEnd}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.rowEnd &&
                                                        Boolean(formik.errors.rowEnd)
                                                    }
                                                />
                                                {formik.touched.rowEnd &&
                                                    Boolean(formik.errors.rowEnd) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.rowEnd
                                                                ? formik.errors.rowEnd.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Chọn  kiểu tiêu chuẩn kỹ thuật{" "}
                                            <span className="required_text">(*)</span>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="isShowTCKT"
                                                name="isShowTCKT"
                                                type="isShowTCKT"
                                                value={formik.values.isShowTCKT}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.isShowTCKT &&
                                                    Boolean(formik.errors.isShowTCKT)
                                                }
                                            >
                                                <MenuItem value="true">
                                                    Hiển thị toàn bộ
                                                </MenuItem>
                                                <MenuItem value="false">Hiển thị gộp</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {formik.touched.isShowTCKT &&
                                            Boolean(formik.errors.isShowTCKT) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.isShowTCKT
                                                        ? formik.errors.isShowTCKT.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                </Grid>
                                <Grid item md={12}>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Chọn  kiểu giá
                                            <span className="required_text"> (*)</span>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="priceCode"
                                                name="priceCode"
                                                type="priceCode"
                                                value={formik.values.priceCode}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.priceCode &&
                                                    Boolean(formik.errors.priceCode)
                                                }
                                            >
                                                {prices.map((item, index) => (
                                                    <MenuItem key={index} value={item.priceCode}>
                                                        {item.priceName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.priceCode &&
                                            Boolean(formik.errors.priceCode) && (
                                                <FormHelperText className="required_text">
                                                    {formik.errors.priceCode
                                                        ? formik.errors.priceCode.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                    <Box sx={{ width: '100%', }}>
                        <Box sx={{
                            height: { xs: '80px', md: '220px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 2,
                            border: `1px dashed ${theme.palette.primary.main}`
                        }} >
                            {file?.name ?
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <rect width="16" height="9" x="28" y="15" fill="#21a366"></rect><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"></path><rect width="16" height="9" x="28" y="24" fill="#107c42"></rect><rect width="16" height="9" x="12" y="15" fill="#3fa071"></rect><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"></path><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"></path><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"></path><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"></path><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"></path><linearGradient id="flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="1" stop-color="#0b6731"></stop></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"></path><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"></path>
                                    </svg>
                                    <Typography>{file?.name}</Typography>
                                </>
                                :
                                <Typography>Chưa có tệp được chọn</Typography>
                            }
                        </Box>
                        <form className='form'>
                            <input
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                onChange={(event: any) => setFile(event.target.files[0])}
                                type="file"
                            />
                        </form>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 4 }}>
                    <Box sx={{ width: '100%' }} >
                        {file && formik.errors ?
                            <Button variant="contained" size='large' fullWidth component='span' onClick={() => handleSaveForm(file)}>
                                Lưu
                            </Button>
                            :
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" size='large' fullWidth component='span'>
                                    Tải file từ máy tính
                                </Button>
                            </label>
                        }
                    </Box>
                </DialogActions>
            </Dialog >
        </>
    )
}
