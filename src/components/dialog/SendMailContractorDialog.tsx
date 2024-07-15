import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
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
import { Contractors, SendMailContractor } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { addUnit, apiPort, sendMailContractor } from "@/constant/api";
import useUnits from "@/hooks/useUnits";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { red } from '@mui/material/colors';

import { useFormik } from "formik";
import * as yup from "yup";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Units } from "@/interfaces/units";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ClearIcon } from "@mui/x-date-pickers/icons";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
// import Quill from "quill";
// import ImageResize from 'quill-image-resize-module-react';
// if (typeof window !== "undefined") {
//     Quill.register("modules/imageResize", ImageResize);
// }
import ImageResize from 'quill-image-resize-module-react'
import { Quill } from 'react-quill'
import axios from "axios";
export const validationUtilizedObjectSchema = yup.object({
    subject: yup.string().required("Vui lòng nhập tiêu đề"),
    provinceID: yup
        .number()
        .positive("Vui lòng chọn tỉnh") // Validates against negative values
        .required("Vui lòng chọn tỉnh") // Sets it as a compulsory field
        .min(0, "Vui lòng chọn tỉnh"),
    bodyContent: yup.string().required("Vui lòng nhập nội dung"),
});
export default function SendMailContractorDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [formData, setFormData] = useState<Units>();
    const { addUnits, updateUnits, dataUnits } = useUnits();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<{ fileUrl: string, fileType: string, fileName: string, fileID?: number | null }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePreviews, setFilePreviews] = useState<{ fileUrl: string, fileName: string, fileType: string, fileID?: number | null }[]>([]);
    const { dataProvince } = useProvince();
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const Quill = require('react-quill').Quill;
            const ImageResize = require('quill-image-resize-module-react').default;
            Quill.register('modules/imageResize', ImageResize);
            Quill.register(Quill.import("attributors/style/align"), true);
            Quill.register(Quill.import("attributors/style/direction"), true);
            const Size = Quill.import("attributors/style/size");
            Size.whitelist = ["0.75em", "1em", "1.5em", "2.5em"];
            Quill.register(Size, true);
        }
    }, []);
    const formik = useFormik({
        initialValues: {
            subject: defaulValue?.subject ?? "",
            bodyContent: defaulValue?.bodyContent ?? "",
            provinceID: defaulValue?.provinceID ?? "",
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            const data: SendMailContractor = {
                provinceID: values.provinceID,
                bodyContent: `<html><head></head><body>${values.bodyContent}</body></html>`,
                subject: values.subject,
                fileSendMailDtos: [
                    ...imagePreviews,
                    ...filePreviews
                ]
            };
            try {
                if (isInsert) {
                    const accessToken = window.localStorage.getItem('accessToken');
                    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                    const response = await axios.post(sendMailContractor, data, { headers });
                    if (response.status === 200) {
                        handleOpen(false);
                        formik.resetForm();
                        setLoading(false);
                        toast.success("Thêm dữ liệu thành công", {});
                    }
                    else {
                        toast.success("Đã xảy ra lỗi vui lòng kiểm tra lại", {});
                    }
                } else {
                    // data.dvtid = defaulValue.dvtid;
                    // await updateUnits(data);
                    // setLoading(false);
                    // toast.success("Cập nhật dữ liệu thành công", {});
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
                subject: defaulValue.subject || "",
                bodyContent: defaulValue.bodyContent || "",
                provinceID: defaulValue?.provinceId ?? "",
            });
        }
    }, [defaulValue]);
    const handleDownloadFile = (file: string) => {
        const downloadUrl = `${apiPort}${file}`;
        window.open(downloadUrl, "_blank");
    };
    //quill editor
    const [content, setContent] = useState("");
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            ["link", "image"],
            [{ align: [] }],
            [{ color: [] }, { 'background': [] }],
            [{ 'font': [] }],
            ["code-block"],
            ["clean"],
        ],
        imageResize: {
            modules: ["Resize", "DisplaySize"],
        },
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
        "background",
        "code-block",
    ];
    // const handleEditorChange = (newContent: any) => {
    //     setContent(newContent);
    //     formik.setFieldValue("bodyContent", newContent);
    // };
    const handleEditorChange = (content: any, delta: any, source: any, editor: any) => {
        try {
            setContent(content);
            formik.setFieldValue("bodyContent", content);
        } catch (error) {
            console.error('Error:', error);
            // Handle or log the error appropriately
        }
    };
    const handleDeleteFile = (index: number) => {
        setFilePreviews(prevState => {
            const updatedPreviews = [...prevState];
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };
    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    const handleButtonClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };
    const handleButtonClickFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setOpenImage(true);
    };
    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imagesArray = Array.from(e.target.files);

            const readerPromises = imagesArray.map((image) => {
                return new Promise<{ fileUrl: string, fileType: string, fileName: string, fileID: number | null }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve({
                            fileUrl: base64String,
                            fileType: image.type,
                            fileName: image.name,
                            fileID: 0
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(image); // Read image as base64
                });
            });

            Promise.all(readerPromises).then(imageFiles => {
                setImagePreviews(prevState => [...prevState, ...imageFiles]);
            });

            e.target.value = "";
        }
    };
    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            const readerPromises = filesArray.map((file) => {
                return new Promise<{ fileUrl: string, fileName: string, fileType: string, fileID: number | null }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve({
                            fileUrl: base64String,
                            fileName: file.name,
                            fileType: file.type,
                            fileID: 0 // Assuming fileID is initially null for new uploads
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file); // Read file as base64
                });
            });

            Promise.all(readerPromises).then(fileObjects => {
                setFilePreviews(prevState => [...prevState, ...fileObjects]);
            });

            e.target.value = "";
        }
    };
    const handleDeleteImage = (index: number) => {
        setImagePreviews(prevState => prevState.filter((_, i) => i !== index));
    };
    const handleClose = () => {
        setOpenImage(false);
        setSelectedImage(null);
    };
    return (
        <>
            <Dialog
                maxWidth="lg"
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
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Tỉnh</span>
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="provinceID"
                                                        name="provinceID"
                                                        type="provinceID"
                                                        value={formik.values.provinceID}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.provinceID &&
                                                            Boolean(formik.errors.provinceID)
                                                        }
                                                    >
                                                        <MenuItem
                                                            key={0}
                                                            defaultValue={formik.values.provinceID}
                                                            value={0}
                                                        >
                                                            Tất cả
                                                        </MenuItem>
                                                        {dataProvince.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                defaultValue={formik.values.provinceID}
                                                                value={item.tinhID}
                                                            >
                                                                {item.tenTinh}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.provinceID &&
                                                    Boolean(formik.errors.provinceID) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.provinceID
                                                                ? formik.errors.provinceID.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tiêu đề <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="subject"
                                                    name="subject"
                                                    value={formik.values.subject}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.subject &&
                                                        Boolean(formik.errors.subject)
                                                    }
                                                />
                                                {formik.touched.subject &&
                                                    Boolean(formik.errors.subject) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.subject
                                                                ? formik.errors.subject.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>

                                        <Grid item md={12}>
                                            <Box style={{ width: "100%", height: "auto" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Nội dung <span className="required_text">(*)</span>
                                                </Typography>
                                                {formik.touched.bodyContent && Boolean(formik.errors.bodyContent) && (
                                                    <FormHelperText className="required_text">
                                                        {formik.errors.bodyContent ? formik.errors.bodyContent.toString() : ""}
                                                    </FormHelperText>
                                                )}
                                                <QuillEditor
                                                    value={content}
                                                    onChange={handleEditorChange}
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    // style={{ height: "10em", width: "100%" }}
                                                    className="w-full  mt-10 bg-white"
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                {isInsert ? (
                                                    <>
                                                        <Typography sx={{ mb: 1.5, mt: 2, fontWeight: "bold" }}>
                                                            Hình ảnh
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                                            {imagePreviews.map((image, index) => (
                                                                <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <img src={image.fileUrl} alt={`Uploaded Image ${index}`} style={{ maxWidth: '100px', marginRight: '10px' }} onClick={() => handleImageClick(image.fileUrl)} />
                                                                    <ClearIcon
                                                                        sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: red[500] }}
                                                                        onClick={() => handleDeleteImage(index)} />
                                                                </Box>
                                                            ))}
                                                        </Box>
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
                                                            Hình ảnh liên quan
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                                            {imagePreviews.map((image, index) => (
                                                                <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <img src={apiPort + image.fileUrl} alt={`Uploaded Image ${index}`} style={{ maxWidth: '100px', marginRight: '10px' }} onClick={() => handleImageClick(apiPort + image.fileUrl)} />
                                                                    <ClearIcon
                                                                        sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: red[500] }}
                                                                        onClick={() => handleDeleteImage(index)} />
                                                                </Box>
                                                            ))}
                                                        </Box>
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
                                                            multiple
                                                            style={{ display: "none" }}
                                                            ref={imageInputRef}
                                                            onChange={handleChangeImage}
                                                        />
                                                    </Box>
                                                </div>
                                            </Box>
                                            <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                                {isInsert ? (
                                                    <>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Tệp đính kèm
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                                            {filePreviews.map((file, index) => (
                                                                <Box key={index} sx={{ position: 'relative', mb: 1 }}>
                                                                    <Typography variant="body1" component="span" sx={{ cursor: 'pointer' }}>
                                                                        {file.fileName}
                                                                    </Typography>
                                                                    <IconButton
                                                                        color="secondary"
                                                                        onClick={() => handleDeleteFile(index)}
                                                                    >
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                        <Button
                                                            variant="contained"
                                                            type="button"
                                                            onClick={handleButtonClickFile}
                                                        >
                                                            Chọn tệp
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Cập nhật tệp đính kèm
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                                            {filePreviews.map((file, index) => (
                                                                <Box key={index} sx={{ position: 'relative', mb: 1 }}>
                                                                    <Typography variant="body1" component="span" sx={{ cursor: 'pointer' }}>
                                                                        {file.fileName}
                                                                    </Typography>
                                                                    <IconButton>
                                                                        <FileDownloadIcon
                                                                            sx={{ ml: 1, cursor: 'pointer' }}
                                                                            onClick={() => handleDownloadFile(file.fileUrl!)}
                                                                        />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        color="secondary"
                                                                        onClick={() => handleDeleteFile(index)}
                                                                    >
                                                                        <ClearIcon />
                                                                    </IconButton>

                                                                </Box>
                                                            ))}
                                                        </Box>
                                                        <Button
                                                            variant="contained"
                                                            type="button"
                                                            onClick={handleButtonClickFile}
                                                        >
                                                            Chọn tệp
                                                        </Button>
                                                    </>
                                                )}
                                                <div>
                                                    <Box>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                            multiple
                                                            style={{ display: "none" }}
                                                            ref={fileInputRef}
                                                            onChange={handleChangeFile}
                                                        />
                                                    </Box>
                                                </div>

                                                {/* Modal or enlarged view logic can be added similar to the image handling */}
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
