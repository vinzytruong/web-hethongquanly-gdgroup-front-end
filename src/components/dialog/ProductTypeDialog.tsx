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
import { addProductType } from "@/constant/api";
import useProductTypes from "@/hooks/useProductTypes";
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
import { ProductTypes } from "@/interfaces/productTypes";
export const validationUtilizedObjectSchema = yup.object({
    tenLoaiSanPham: yup.string().required("Vui lòng nhập tên loại sản phẩm"),
});
export default function ProductTypesDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [formData, setFormData] = useState<ProductTypes>();
    const { addProductTypes, updateProductTypes, dataProductTypes } = useProductTypes();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);



    const formik = useFormik({
        initialValues: {
            tenLoaiSanPham: defaulValue?.tenLoaiSanPham ?? "",
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);

            const data: ProductTypes = {
                ...values,

            };
            try {
                if (isInsert) {
                    const response = await addProductTypes(data);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.loaiSanPhamID = defaulValue.loaiSanPhamID;
                    await updateProductTypes(data);
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
                tenLoaiSanPham: defaulValue.tenLoaiSanPham || "",
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
    //namSanXuat
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs()); // Initialize with dayjs object

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        // Accept dayjs.Dayjs | null type
        setSelectedDate(date);
    };
    const handleEditorChange = (newContent: any) => {
        setContent(newContent);
        formik.setFieldValue("tieuChuanKyThuat", newContent);
    };

    const formatPrice = (value: string | null | undefined): string => {
        return (value ?? "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const handleChangePrice = (
        e: ChangeEvent<HTMLInputElement>,
        setter: Function
    ) => {
        let inputValue: string = e.target.value;
        let inputName: string = e.target.name;
        inputValue = inputValue.replace(/,/g, "");
        if (!isNaN(Number(inputValue))) {
            const formattedValue: string = formatPrice(inputValue);
            const numericValue = parseFloat(formattedValue.replace(/,/g, ""));

            formik.setFieldValue(inputName, numericValue);
            setter(formattedValue);
        } else {
        }
    };
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
                                                    Tên loại sản phẩm <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="tenLoaiSanPham"
                                                    name="tenLoaiSanPham"
                                                    value={formik.values.tenLoaiSanPham}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.tenLoaiSanPham &&
                                                        Boolean(formik.errors.tenLoaiSanPham)
                                                    }
                                                />
                                                {formik.touched.tenLoaiSanPham &&
                                                    Boolean(formik.errors.tenLoaiSanPham) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tenLoaiSanPham
                                                                ? formik.errors.tenLoaiSanPham.toString()
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