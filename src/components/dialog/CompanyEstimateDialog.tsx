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
import { addCompanyEstimate, addUnit, updateCompanyEstimate } from "@/constant/api";
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
import { CompanyEstimates } from "@/interfaces/companyEstimates";
import useCompanyEstimate from "@/hooks/useCompanyEstimate";
export const validationUtilizedObjectSchema = yup.object({
    tenCongTy: yup.string().required("Vui lòng nhập tên công ty"),
    hinhAnh: yup.string().required("Vui lòng chọn ảnh"),
});
export default function CompanyEstimateDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [formData, setFormData] = useState<CompanyEstimates>();
    const { addCompanyEstimates, updateCompanyEstimates, dataCompanyEstimates } = useCompanyEstimate();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const [filePreview, setFilePreview] = useState<string | undefined>(undefined);
    const [file, setFile] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formik = useFormik({
        initialValues: {
            tenCongTy: defaulValue?.tenCongTy ?? "",
            hinhAnh: defaulValue?.hinhAnh ?? "",
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            const data: CompanyEstimates = {
                ...values,

            };
            try {
                if (isInsert) {
                    const response = await addCompanyEstimates(data);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.id = defaulValue.id;
                    await updateCompanyEstimates(data);
                    setFilePreview(undefined);
                    setFile(undefined);
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
            console.log("ds", defaulValue);
            formik.setValues({
                tenCongTy: defaulValue.tenCongTy || "",
                hinhAnh: defaulValue.hinhAnh || "",
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

    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    //Hình ảnh
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    function handleChangefILE(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setFilePreview(URL.createObjectURL(e.target.files[0]));

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFile(base64String);
                formik.setFieldValue("hinhAnh", base64String);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        e.target.value = "";
    }

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
                                                    Tên công ty <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="tenCongTy"
                                                    name="tenCongTy"
                                                    value={formik.values.tenCongTy}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.tenCongTy &&
                                                        Boolean(formik.errors.tenCongTy)
                                                    }
                                                />
                                                {formik.touched.tenCongTy &&
                                                    Boolean(formik.errors.tenCongTy) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tenCongTy
                                                                ? formik.errors.tenCongTy.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Box style={{ width: "100%" }}>
                                        {formik.touched.hinhAnh &&
                                            Boolean(formik.errors.hinhAnh) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.hinhAnh
                                                        ? formik.errors.hinhAnh.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                        {isInsert ? (
                                            <>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Hình ảnh
                                                </Typography>
                                                <Box> {file && (
                                                    <img src={filePreview} alt="Uploaded File" />
                                                )}</Box>

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
                                                    Hình ảnh hiện tại
                                                </Typography>
                                                <Box>

                                                    {defaulValue && defaulValue.hinhAnh && (
                                                        <img
                                                            src={defaulValue.hinhAnh}
                                                            alt="Uploaded File"
                                                        />
                                                    )}
                                                </Box>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Hình ảnh cập nhật
                                                </Typography>
                                                <Box> {file && (
                                                    <img src={filePreview} alt="Uploaded File" />
                                                )}</Box>

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
                                                    style={{ display: "none" }} // Ẩn input file
                                                    ref={fileInputRef} // Gán tham chiếu cho input file
                                                    onChange={handleChangefILE}
                                                />
                                            </Box>
                                        </div>
                                    </Box>
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
                            Cập nhật sản phẩm
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
