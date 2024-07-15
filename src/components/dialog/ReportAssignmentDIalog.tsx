import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Card,
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
import {
    addUnit,
    deleteProgress,
    getAllStatusAssignments,
    updateProgress,
} from "@/constant/api";
import useUnits from "@/hooks/useUnits";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { FormikErrors, FormikTouched, useFormik } from "formik";
import * as yup from "yup";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Units } from "@/interfaces/units";
import InfoCard from "../card/InfoCard";
import { ReportAssignments } from "@/interfaces/reportAssignments";
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import { StatusAssignment } from "@/interfaces/statusAssignment";
import axios from "axios";
import useWork from "@/hooks/useWork";
import StyledIconButton from "../styled-button/StyledIconButton";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRouter } from "next/router";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
}));
interface FormValues {
    reportAssignments: ReportAssignments[];
    trangThaiID: number | string;
}
const validationUtilizedObjectSchema = yup.object().shape({
    reportAssignments: yup.array().of(
        yup.object().shape({
            moTa: yup.string().required("Vui lòng nhập mô tả báo cáo"),
            tienDo: yup
                .number()
                .typeError("Vui lòng nhập giá trị số hợp lệ")
                .required("Vui lòng nhập tiến độ")
                .min(1, "Tiến độ phải lớn hơn hoặc bằng 1")
                .max(100, "Tiến độ phải nhỏ hơn hoặc bằng 100"),
        })
    ),
});

// Type guard function to check if an array is FormikErrors<T>
function isFormikErrorsArray<T>(errors: any): errors is Array<FormikErrors<T>> {
    return Array.isArray(errors);
}

// Type guard function to check if an array is FormikTouched<T>
function isFormikTouchedArray<T>(
    touched: any
): touched is Array<FormikTouched<T>> {
    return Array.isArray(touched);
}
export default function ReportAssignmentDialog(props: PropsDialog) {
    const { dataWork, deleteMulWork, getAllWork, getAssignedWork } = useWork()
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [reportAssignments, setReportAssignments] = useState([
        { moTa: "", tienDo: 0 },
    ]);
    const router = useRouter()

    const [entityError, setEntityError] = useState<
        FormikErrors<ReportAssignments>[] | null
    >(null);
    const [formData, setFormData] = useState<ReportAssignments>();
    const [statusAssignments, setStatusAssignments] = useState<
        StatusAssignment[]
    >([]);
    const { addUnits, updateUnits, dataUnits } = useUnits();
    const [loading, setLoading] = useState<boolean>(false);
    const formik = useFormik<FormValues>({
        initialValues: {
            reportAssignments: [],
            trangThaiID: 0,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                if (isInsert) {
                    let trangThaiID = values.trangThaiID;
                    const tienDo: number | string = values.reportAssignments[values.reportAssignments.length - 1].tienDo;

                    if (parseInt(tienDo.toString()) === 100) {
                        trangThaiID = 2;
                    }
                    if (parseInt(tienDo.toString()) < 100 && parseInt(tienDo.toString()) > 0) {
                        trangThaiID = 1;
                    }
                    if (trangThaiID === "new") {
                        trangThaiID = 1;
                    }
                    let data = {
                        moTa: values.reportAssignments[values.reportAssignments.length - 1].moTa,
                        tienDo:
                            parseInt(tienDo.toString()),
                        trangThaiID: trangThaiID,
                        congViecID: defaulValue.congViecID,
                        lsid: values.reportAssignments[values.reportAssignments.length - 1].lsid
                    };

                    const accessToken = window.localStorage.getItem("accessToken");
                    const headers = {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    };
                    const response = await axios.put(updateProgress, data, { headers });
                    if (response.status === 200) {
                        // handleOpen(false);
                        formik.resetForm();
                        setLoading(false);
                        toast.success("Thêm dữ liệu thành công", {});
                        const currentPath = router.asPath;
                        console.log("dsdsdsdwerref path", currentPath);
                        if (currentPath === "/workflow/assign") {
                            getAllWork()

                        } else {
                            getAssignedWork()
                        }
                    }
                } else {
                    // await updateUnits(values);
                    setLoading(false);
                    toast.success("Cập nhật dữ liệu thành công", {});
                }
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }

                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllStatusAssignments, { headers });
                setStatusAssignments(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (defaulValue && defaulValue.lichSuCongViec && defaulValue.lichSuCongViec.length > 0) {
            formik.setValues({
                reportAssignments: defaulValue.lichSuCongViec.map((item: any) => ({
                    moTa: item.moTa || "", // Ensure moTa is provided or default to empty string
                    tienDo: item.tienDo || 0,
                    lsid: item.lsid || null,
                    thoiGian: item.thoiGian // Ensure tienDo is provided or default to 0
                })),
                trangThaiID: defaulValue.lichSuCongViec[defaulValue.lichSuCongViec.length - 1].trangThaiID,
            });

        } else {
            // Handle case where defaulValue or lichSuCongViec is not defined or empty
            formik.setValues({
                reportAssignments: [{ moTa: "", tienDo: 0, lsid: undefined, thoiGian: null }],
                trangThaiID: "new",
            });
        }
    }, [defaulValue]);

    const formatPrice = (value: string | null | undefined): string => {
        return (value ?? "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    const handleAddReportAssignment = () => {
        setReportAssignments([...reportAssignments, { moTa: "", tienDo: 0 }]);
        formik.setFieldValue("reportAssignments", [
            ...formik.values.reportAssignments,
            { moTa: "", tienDo: 0 },
        ]);
    };
    const getMoTaError = (index: number) => {
        if (
            formik.errors.reportAssignments &&
            Array.isArray(formik.errors.reportAssignments) &&
            formik.errors.reportAssignments[index] &&
            typeof formik.errors.reportAssignments[index] === "object" && // Ensure it's an object
            !Array.isArray(formik.errors.reportAssignments[index]) // Ensure it's not an array
        ) {
            const error = formik.errors.reportAssignments[
                index
            ] as FormikErrors<ReportAssignments>;
            return error.moTa;
        }
        return undefined;
    };

    const getTienDoError = (index: number) => {
        if (
            formik.errors.reportAssignments &&
            Array.isArray(formik.errors.reportAssignments) &&
            formik.errors.reportAssignments[index] &&
            typeof formik.errors.reportAssignments[index] === "object" && // Ensure it's an object
            !Array.isArray(formik.errors.reportAssignments[index]) // Ensure it's not an array
        ) {
            const error = formik.errors.reportAssignments[
                index
            ] as FormikErrors<ReportAssignments>;
            return error.tienDo;
        }
        return undefined;
    };
    const handleDeleteReportAssignment = async (lsid: number | null | undefined, index: number) => {
        const newReportAssignments = formik.values.reportAssignments.filter(
            (_, i) => i !== index
        );
        formik.setFieldValue("reportAssignments", newReportAssignments);
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };
        if (lsid) {
            await axios.delete(deleteProgress, { params: { id: lsid } });
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
                    <table style={{ width: "100%" }}>
                        <tr style={{ width: "10%" }}>
                            <td style={{ width: "20%", fontWeight: "bold" }}>
                                Tên công việc
                            </td>
                            <td>: {defaulValue?.tenCongViec}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>Mô tả</td>
                            <td>: {defaulValue?.moTa}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>Ngày bắt đầu</td>
                            <td>: {defaulValue?.ngayBatDau}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>
                                Ngày kết thúc{" "}
                            </td>
                            <td>: {defaulValue?.ngayKetThuc}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>Độ ưu tiên </td>
                            <td>: {defaulValue?.tenDoUuTien}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>Người tạo </td>
                            <td>: {defaulValue?.tenNguoiTao}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", fontWeight: "bold" }}>
                                Nhóm công việc{" "}
                            </td>
                            <td>: {defaulValue?.tenNhomCongViec}</td>
                        </tr>
                    </table>
                    <form onSubmit={formik.handleSubmit} style={{ marginTop: "13px" }}>
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
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 1.5,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <span style={{ marginRight: "8px" }}>Trạng thái</span>
                                            <span className="required_text">(*)</span>
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="trangThaiID"
                                                name="trangThaiID"
                                                type="trangThaiID"
                                                value={formik.values.trangThaiID}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.trangThaiID &&
                                                    Boolean(formik.errors.trangThaiID)
                                                }
                                            >
                                                <MenuItem value={"new"}>Chưa thực hiện</MenuItem>
                                                {statusAssignments.map((item, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        defaultValue={formik.values.trangThaiID}
                                                        value={item.trangThaiID}
                                                    >
                                                        {item.tenTrangThai}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.trangThaiID &&
                                            Boolean(formik.errors.trangThaiID) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.trangThaiID
                                                        ? formik.errors.trangThaiID.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Lịch sử báo cáo công việc
                                    </Typography>
                                    {formik.values.reportAssignments.map((report: ReportAssignments, index: number) => (
                                        <Card variant="outlined" key={index} sx={{ mb: 3 }}>
                                            {
                                                report && report.thoiGian ? (<>
                                                    <Typography sx={{ mt: 1.5, ml: 2, fontWeight: "bold" }}>
                                                        Ngày: {report.thoiGian}
                                                    </Typography>
                                                </>) : (<></>)
                                            }
                                            <Grid container spacing={3} sx={{ p: 2 }}>
                                                <Grid item md={9}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Báo cáo công việc <span className="required_text">(*)</span>
                                                        </Typography>
                                                        <TextareaAutosize
                                                            id={`reportAssignments[${index}].moTa`}
                                                            name={`reportAssignments[${index}].moTa`}
                                                            value={report.moTa}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            minRows={2}
                                                            disabled={index !== formik.values.reportAssignments.length - 1}
                                                            style={{
                                                                width: '100%',
                                                                color: index !== formik.values.reportAssignments.length - 1 ? '#ccc' : 'initial', // Gray color if disabled
                                                                cursor: index !== formik.values.reportAssignments.length - 1 ? 'not-allowed' : 'auto' // Change cursor if disabled
                                                            }}
                                                        />
                                                        {formik.touched.reportAssignments?.[index]?.moTa &&
                                                            getMoTaError(index) && (
                                                                <Typography color="error">
                                                                    {getMoTaError(index)}
                                                                </Typography>
                                                            )}
                                                    </Box>
                                                </Grid>
                                                <Grid item md={3} xs={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Tiến độ <span className="required_text">(*)</span>
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id={`reportAssignments[${index}].tienDo`}
                                                            name={`reportAssignments[${index}].tienDo`}
                                                            value={report.tienDo}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <p style={{ fontWeight: 900, color: "black" }}>
                                                                            %
                                                                        </p>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            disabled={index !== formik.values.reportAssignments.length - 1}
                                                        />
                                                        {formik.touched.reportAssignments?.[index]?.tienDo &&
                                                            getTienDoError(index) && (
                                                                <Typography color="error">
                                                                    {getTienDoError(index)}
                                                                </Typography>
                                                            )}
                                                    </Box>
                                                </Grid>
                                                {/* Conditionally render the StyledIconButton */}
                                                {index === formik.values.reportAssignments.length - 1 ? (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        type="button"
                                                        onClick={() => handleDeleteReportAssignment(report.lsid, index)}
                                                        sx={{ mt: 1.5, ml: 3 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                ) : <></>}
                                            </Grid>
                                        </Card>
                                    ))}
                                    <Button
                                        variant="contained"
                                        onClick={handleAddReportAssignment}
                                    >
                                        Báo cáo công việc
                                    </Button>
                                    <Box sx={{ mb: 2 }}></Box>

                                    <BorderLinearProgress
                                        variant="determinate"
                                        value={formik.values.reportAssignments.length > 0 ? formik.values.reportAssignments[formik.values.reportAssignments.length - 1]?.tienDo ?? 0 : 0}
                                    />
                                </Grid>
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
            </Dialog >
        </>
    );
}
const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
};

const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
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
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]
        };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]
        };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
