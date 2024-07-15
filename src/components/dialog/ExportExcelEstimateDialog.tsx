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
    TextareaAutosize,
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
import useCirculars from "@/hooks/useCirculars";
import { prices } from "@/interfaces/prices";
import { ExportExcelProduct } from "@/interfaces/products";
import useCompanyEstimate from "@/hooks/useCompanyEstimate";
import { CompanyEstimates } from "@/interfaces/companyEstimates";
export const validationUtilizedObjectSchema = yup.object({
    fileName: yup.string().required("Vui lòng nhập tên file"),
    isShowGiaVon: yup.string().required("Vui lòng chọn giá vốn"),
});
export interface Props {
    title: string;
    defaulValue?: any;
    isInsert?: boolean;
    isUpdate?: boolean;
    open: boolean;
    id?: number;
    idParent?: number;
    file?: File | null;
    handleUploadFile?: (e: any) => void;
    handleOpen: (e: boolean) => void;
    handlSaveFile?: (e: any) => void;
    onHandleExportExcel?: (data: ExportExcelProduct) => void;
    fetchData?: () => void;
    dataCompanyEstimates?: CompanyEstimates[];

}

export default function ExportExcelEstimateDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, onHandleExportExcel, dataCompanyEstimates } = props;
    const { dataCirculars } = useCirculars();
    const [formData, setFormData] = useState<Units>();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const formik = useFormik({
        initialValues: {
            companyEstimateId: 0,
            fileName: defaulValue?.fileName ?? "",
            circularId: defaulValue?.circularId ?? 0,
            isShowTCKT: defaulValue?.isShowTCKT ?? 0,
            isShowGiaVon: 'false'
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            if (onHandleExportExcel) {
                onHandleExportExcel(values as ExportExcelProduct);
                handleOpen(false);
            }
            try {

            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });

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
                                                    Tên file <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="fileName"
                                                    name="fileName"
                                                    value={formik.values.fileName}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.fileName &&
                                                        Boolean(formik.errors.fileName)
                                                    }
                                                />
                                                {formik.touched.fileName &&
                                                    Boolean(formik.errors.fileName) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.fileName
                                                                ? formik.errors.fileName.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Chọn công ty{" "}
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="companyEstimateId"
                                                        name="companyEstimateId"
                                                        type="companyEstimateId"
                                                        value={formik.values.companyEstimateId}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.companyEstimateId &&
                                                            Boolean(formik.errors.companyEstimateId)
                                                        }
                                                    >
                                                        {dataCompanyEstimates?.map((item, index) => (
                                                            <MenuItem key={index} value={item.id}>
                                                                {item.tenCongTy}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.companyEstimateId &&
                                                    Boolean(formik.errors.companyEstimateId) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.companyEstimateId
                                                                ? formik.errors.companyEstimateId.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Hiển thị giá vốn{" "}
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="isShowGiaVon"
                                                        name="isShowGiaVon"
                                                        type="isShowGiaVon"
                                                        value={formik.values.isShowGiaVon}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.isShowGiaVon &&
                                                            Boolean(formik.errors.isShowGiaVon)
                                                        }
                                                    >
                                                        <MenuItem value="true">
                                                            Có
                                                        </MenuItem>
                                                        <MenuItem value="false">Không</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.isShowGiaVon &&
                                                    Boolean(formik.errors.isShowGiaVon) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.isShowGiaVon
                                                                ? formik.errors.isShowGiaVon.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
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
                            Xuất
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
                            Cập nhật sản phẩm
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
