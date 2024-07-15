import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { PropsDialog } from "@/interfaces/dialog";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { addConfigNotification, addUnit, updateConfigNotification } from "@/constant/api";
import useUnits from "@/hooks/useUnits";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Units } from "@/interfaces/units";
import { ConfigNotification } from "@/interfaces/configNotification";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from "axios";

export const validationUtilizedObjectSchema = yup.object({
    maThongBao: yup.string().required("Vui lòng nhập mã thông báo"),
    tenNhom: yup.string().required("Vui lòng nhập tên nhóm"),
    noiDung: yup.string().required("Vui lòng nhập nội dung"),
    active: yup.boolean().required("Vui lòng xác nhận trạng thái hoạt động"),
});
export default function ConfigNotificationDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, fetchData } = props;
    const theme = useTheme()
    const [formData, setFormData] = useState<Units>();
    const { addUnits, updateUnits, dataUnits } = useUnits();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const formik = useFormik({
        initialValues: {
            maThongBao: defaulValue?.maThongBao ?? "",
            tenNhom: defaulValue?.tenNhom ?? "",
            noiDung: defaulValue?.noiDung ?? "",
            active: defaulValue?.active ?? true,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);

            const data: ConfigNotification = {
                ...values,

            };
            try {
                if (isInsert) {
                    const accessToken = window.localStorage.getItem('accessToken');
                    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                    const response = await axios.post(addConfigNotification, data, { headers });
                    if (response.status === 200) {
                        handleOpen(false);
                        formik.resetForm();
                        fetchData!();
                        setLoading(false);
                        toast.success("Thêm dữ liệu thành công", {});
                    }
                } else {
                    data.thongBaoID = defaulValue.thongBaoID;
                    const accessToken = window.localStorage.getItem('accessToken');
                    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                    const response = await axios.put(updateConfigNotification, data, { headers });
                    if (response.status === 200) {
                        formik.resetForm();
                        fetchData!();
                        toast.success("Cập nhật dữ liệu thành công", {});
                    }

                }
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });

    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (defaulValue) {
            formik.setValues({
                maThongBao: defaulValue.maThongBao || "",
                tenNhom: defaulValue.tenNhom || "",
                noiDung: defaulValue.noiDung || "",
                active: defaulValue.active || true,
            });
        }
    }, [defaulValue]);

    //quill editor
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
    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant="h3">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 3 }}>
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
                                                    Mã thông báo <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="maThongBao"
                                                    name="maThongBao"
                                                    value={formik.values.maThongBao}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={isUpdate}
                                                    error={
                                                        formik.touched.maThongBao &&
                                                        Boolean(formik.errors.maThongBao)
                                                    }
                                                />
                                                {formik.touched.maThongBao &&
                                                    Boolean(formik.errors.maThongBao) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.maThongBao
                                                                ? formik.errors.maThongBao.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tên nhóm <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="tenNhom"
                                                    name="tenNhom"
                                                    value={formik.values.tenNhom}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.tenNhom &&
                                                        Boolean(formik.errors.tenNhom)
                                                    }
                                                />
                                                {formik.touched.tenNhom &&
                                                    Boolean(formik.errors.tenNhom) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tenNhom
                                                                ? formik.errors.tenNhom.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Nội dung
                                                </Typography>
                                                <TextareaAutosize
                                                    id="noiDung"
                                                    name="noiDung"
                                                    value={formik.values.noiDung}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    minRows={4}
                                                />
                                                {formik.touched.noiDung &&
                                                    Boolean(formik.errors.noiDung) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.noiDung
                                                                ? formik.errors.noiDung.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}></Grid>

                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {isInsert && (
                        <LoadingButton
                            sx={{ p: "12px 24px" }}
                            onClick={() => formik.handleSubmit()}
                            type="submit"
                            loading={loading}
                            variant="contained"
                            size="large"
                        >
                            Lưu
                        </LoadingButton>
                    )}
                    {isUpdate && (
                        <LoadingButton
                            sx={{ p: "12px 24px" }}
                            type="submit"
                            onClick={() => formik.handleSubmit()}
                            loading={loading}
                            variant="contained"
                            size="large"
                        >
                            Lưu
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);