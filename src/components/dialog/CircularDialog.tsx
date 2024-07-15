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
import { addCircular } from "@/constant/api";
import useCirculars from "@/hooks/useCirculars";
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
import useSubjects from "@/hooks/useSubjects";
import MultipleSelectCheckBoxSubject from "../multiple-select/MultipleSelectCheckBoxSubject";
export const validationUtilizedObjectSchema = yup.object({
    tenThongTu: yup.string().required("Vui lòng nhập tên danh mục"),
    moTa: yup.string().required("Vui lòng nhập mô tả"),
    monHoc: yup
        .array()
        .min(1, "Vui lòng nhập  môn học"),
});
export default function CircularsDialog(props: PropsDialog) {
    const { dataSubjects } = useSubjects();
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [formData, setFormData] = useState<Circulars>();
    const { addCirculars, updateCirculars, dataCirculars } = useCirculars();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState<Subjects[]>([]);
    const formik = useFormik({
        initialValues: {
            tenThongTu: defaulValue?.tenThongTu ?? "",
            moTa: defaulValue?.moTa ?? "",
            monHoc: defaulValue?.lstMonHoc ? selectedSubjects : [
                {
                    tenMonHoc: "hide",
                    monHocID: 0,
                }
            ],
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            const data: Circulars = {
                tenThongTu: values.tenThongTu,
                lstMonHoc: values.monHoc,
                moTa: values.moTa
            };
            try {
                if (isInsert) {
                    const response = await addCirculars(data);
                    console.log(response);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.thongTuID = defaulValue.thongTuID;
                    await updateCirculars(data);
                    setLoading(false);
                    toast.success("Cập nhật dữ liệu thành công", {});
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
                tenThongTu: defaulValue.tenThongTu || "",
                monHoc: defaulValue.lstMonHoc,
                moTa: defaulValue.moTa || "",
            });
            setSelectedSubjects(defaulValue.lstMonHoc);
        }
    }, [defaulValue]);

    console.log({ defaulValue });

    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    const handleSelectedSubjects = (data: Subjects[]) => {
        formik.setFieldValue("monHoc", data);
        setSelectedSubjects(data);
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
                                                    Tên danh mục <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="tenThongTu"
                                                    name="tenThongTu"
                                                    value={formik.values.tenThongTu}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.tenThongTu &&
                                                        Boolean(formik.errors.tenThongTu)
                                                    }
                                                />
                                                {formik.touched.tenThongTu &&
                                                    Boolean(formik.errors.tenThongTu) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tenThongTu
                                                                ? formik.errors.tenThongTu.toString()
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
                                                    Mô tả <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="moTa"
                                                    name="moTa"
                                                    value={formik.values.moTa}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.moTa &&
                                                        Boolean(formik.errors.moTa)
                                                    }
                                                />
                                                {formik.touched.moTa &&
                                                    Boolean(formik.errors.moTa) && (
                                                        <FormHelperText className="required_text">
                                                            {formik.errors.moTa
                                                                ? formik.errors.moTa.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {
                                    isUpdate && <Grid item md={12}>
                                        <Box style={{ width: "100%" }}>
                                            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                <span style={{ marginRight: '8px' }}>Môn học</span>
                                                <span className="required_text">(*)</span>
                                            </Typography>
                                            <MultipleSelectCheckBoxSubject
                                                touched={Boolean(formik.touched.monHoc)}
                                                error={Boolean(formik.errors.monHoc)}
                                                onHandleSelectedSubjects={handleSelectedSubjects}
                                                subjects={dataSubjects}
                                                selectedSubjects={selectedSubjects}
                                            />
                                            {formik.touched.monHoc &&
                                                Boolean(formik.errors.monHoc) && (
                                                    <FormHelperText className="required_text">
                                                        {" "}
                                                        {formik.errors.monHoc
                                                            ? formik.errors.monHoc.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Box>
                                    </Grid>
                                }

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
                            Cập nhật sản phẩm
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
