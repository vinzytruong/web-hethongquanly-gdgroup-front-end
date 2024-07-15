import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Autocomplete,
    Button,
    Checkbox,
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
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { PropsDialog } from "@/interfaces/dialog";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { addContractorEstimate, addUnit, apiPort, getAllNguonVon, getAllNhaThauDuToanStatus, getAllThe, updateContractorEstimate } from "@/constant/api";
import useContractorInteractions from "@/hooks/useContractorInteractions";
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
import { ContractorInteractions } from "@/interfaces/contractorInteraction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { ContractorTags } from "@/interfaces/contractorTag";
import { SourceOfFunds } from "@/interfaces/sourceOfFunds";
import useProductTypes from "@/hooks/useProductTypes";
import { ProductTypes } from "@/interfaces/productTypes";
import MultipleSelectCheckBoxProductType from "../multiple-select/MultipleSelectCheckBoxProductType";
import { StaffInCharge } from "@/interfaces/staffInCharge";
import MultipleSelectCheckBoxStaffInCharge from "../multiple-select/MultipleSelectCheckBoxStaffInCharge";
import { ContractorEstimate } from "@/interfaces/contractorEstimate";
import { ContractorEstimateStatus } from "@/interfaces/contractorEstimateStatus";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const validationUtilizedObjectSchema = yup.object({
    tenDuToan: yup.string().required("Vui lòng nhập tên dự toán"),
    tinhID: yup
        .number()
        .positive("Vui lòng chọn tỉnh")
        .required("Vui lòng chọn tỉnh")
        .min(1, "Vui lòng chọn tỉnh"),
    trangThaiID: yup
        .number()
        .positive("Vui lòng chọn trạng thái")
        .required("Vui lòng chọn trạng thái")
        .min(1, "Vui lòng chọn tỉnh"),
    doanhThuDuKien: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
});
export interface Props {
    title: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean,
    open: boolean,
    id?: number,
    idParent?: number,
    file?: File | null,
    content?: ReactNode,
    handleUploadFile?: (e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?: (e: any) => void,
    note?: string;
    fetchContractorEstimatesList?: () => void;
    dataSourceOfFunds: SourceOfFunds[]
    dataContractorTags: ContractorTags[]
    contractor?: Contractors
}

export default function ContractorEstimateDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id, dataContractorTags, dataSourceOfFunds, fetchContractorEstimatesList, contractor } = props;

    const [formData, setFormData] = useState<ContractorEstimate>();
    const { addContractorInteractions, updateContractorInteractions } = useContractorInteractions();
    const { getAllProvince, dataProvince } = useProvince()
    const { dataProductTypes } = useProductTypes();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const [selectedProductTypes, setSelectedProductTypes] = useState<ProductTypes[]>([]);
    const [selectedStaffInCharge, setStaffInCharges] = useState<StaffInCharge[]>([]);
    const [dataStaffInCharge, setDataStaffInCharge] = useState<StaffInCharge[]>([]);
    const [dataContractorEstimateStatus, setDataContractorEstimateStatus] = useState<ContractorEstimateStatus[]>([]);
    const [doanhThuDuKien, setdoanhThuDuKien] = useState<string>("");
    const [contractorFile, setContractorFile] = useState<File | null>(null);
    const [companyFile, setCompanyFile] = useState<File | null>(null);
    const contractorFileInputRef = useRef<HTMLInputElement | null>(null);
    const companyFileInputRef = useRef<HTMLInputElement | null>(null);
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
    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const formik = useFormik({
        initialValues: {
            tenDuToan: defaulValue?.tenDuToan ?? "",
            tinhID: defaulValue?.tinhID ?? "",
            trangThaiID: defaulValue?.trangThaiID ?? "",
            doanhThuDuKien: defaulValue?.doanhThuDuKien ?? 0,
            fileNhaThau: defaulValue?.fileNhaThau,
            fileCongTy: defaulValue?.fileCongTy,
            ghiChu: defaulValue?.ghiChu ?? "",
            ketQua: defaulValue?.ketQua ?? null,
            lyDoThatBai: defaulValue?.lyDoThatBai ?? null,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            let fileCongTy: string = '';
            let fileNhaThau: string = '';

            if (companyFile) {
                fileCongTy = await readFileAsBase64(companyFile);
            }
            if (contractorFile) {
                fileNhaThau = await readFileAsBase64(contractorFile);
            }
            const data: ContractorEstimate = {
                ...values,
                tenFileCongTy: companyFile?.name ?? defaulValue?.tenFileCongTy ?? null,
                tenFileNhaThau: contractorFile?.name ?? defaulValue?.tenFileNhaThau ?? null,
                fileCongTy: companyFile ? fileCongTy : defaulValue?.fileCongTy ?? null,
                fileNhaThau: contractorFile ? fileNhaThau : defaulValue?.fileNhaThau ?? null,
                ketQua: JSON.parse(values.ketQua)
            };
            try {
                if (isInsert) {
                    data.nhaThauID = Number(id)
                    const accessToken = window.localStorage.getItem('accessToken');
                    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                    const response = await axios.post(addContractorEstimate, data, { headers });
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    setCompanyFile(null)
                    setContractorFile(null)
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.duToanID = defaulValue.duToanID;
                    data.nhaThauID = defaulValue.nhaThauID;
                    const accessToken = window.localStorage.getItem('accessToken');
                    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
                    const response = await axios.put(updateContractorEstimate, data, { headers });
                    toast.success("Cập nhật dữ liệu thành công", {});
                    setLoading(false);
                }
                await fetchContractorEstimatesList!()
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });
    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (defaulValue) {
            formik.setValues({
                tenDuToan: defaulValue?.tenDuToan ?? "",
                tinhID: defaulValue?.tinhID ?? "",
                trangThaiID: defaulValue?.trangThaiID ?? "",
                doanhThuDuKien: defaulValue?.doanhThuDuKien ?? 0,
                fileNhaThau: defaulValue?.fileNhaThau,
                fileCongTy: defaulValue?.fileCongTy,
                ghiChu: defaulValue?.ghiChu,
                lyDoThatBai: defaulValue?.lyDoThatBai,
                ketQua: defaulValue?.ketQua === false ? 'false' : defaulValue?.ketQua ? 'true' : 'null',

            });
            setdoanhThuDuKien(formatPrice(defaulValue.doanhThuDuKien));
            formik.setFieldValue('tinhID', defaulValue?.tinhID || '')
        }
    }, [defaulValue]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllNhaThauDuToanStatus, { headers });
                // Xử lý dữ liệu từ response
                setDataContractorEstimateStatus(response.data);
            } catch (error) {
                // Xử lý lỗi
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };


    const handleContractorFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0] || null;
        if (uploadedFile) {
            setContractorFile(uploadedFile);
        }
    };

    const handleCompanyFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0] || null;
        if (uploadedFile) {
            setCompanyFile(uploadedFile);
        }
    };

    const handleContractorButtonClick = () => {
        contractorFileInputRef.current?.click();
    };

    const handleCompanyButtonClick = () => {
        companyFileInputRef.current?.click();
    };
    const handleDownloadFile = (file: string) => {
        const downloadUrl = `${apiPort}${file}`;
        window.open(downloadUrl, "_blank");
    };
    console.log(formik.values.ketQua);

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
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tên dự toán <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="tenDuToan"
                                                    name="tenDuToan"
                                                    value={formik.values.tenDuToan}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.tenDuToan &&
                                                        Boolean(formik.errors.tenDuToan)
                                                    }
                                                />
                                                {formik.touched.tenDuToan &&
                                                    Boolean(formik.errors.tenDuToan) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tenDuToan
                                                                ? formik.errors.tenDuToan.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: '100%' }}>
                                                <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: 'bold' }}>
                                                    Tỉnh <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        disablePortal
                                                        id="tinhID"
                                                        options={dataProvince}
                                                        getOptionLabel={(option) => option.tenTinh}
                                                        value={dataProvince.find(x => x.tinhID === defaulValue?.tinhID)}
                                                        onChange={(event, value) => formik.setFieldValue('tinhID', value?.tinhID || '')}
                                                        onBlur={formik.handleBlur}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                name="tinhID"
                                                                error={formik.touched.tinhID && Boolean(formik.errors.tinhID)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                                {formik.touched.tinhID &&
                                                    Boolean(formik.errors.tinhID) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.tinhID
                                                                ? formik.errors.tinhID.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: '100%' }}>
                                                <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                                    Loại báo giá <span className="required_text">(*)</span>{" "}
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
                                                        {dataContractorEstimateStatus && dataContractorEstimateStatus.length > 0 && dataContractorEstimateStatus.map((item, index) => (
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
                                        </Grid>

                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Doanh thu dự kiến<span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    style={{ width: "100%" }}
                                                    name="doanhThuDuKien"
                                                    value={doanhThuDuKien}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                        handleChangePrice(e, setdoanhThuDuKien)
                                                    }
                                                    autoComplete="off"
                                                    error={
                                                        formik.touched.doanhThuDuKien &&
                                                        Boolean(formik.errors.doanhThuDuKien)
                                                    }
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <p style={{ fontWeight: 900, color: "black" }}>
                                                                    VNĐ
                                                                </p>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {formik.touched.doanhThuDuKien &&
                                                    Boolean(formik.errors.doanhThuDuKien) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.doanhThuDuKien
                                                                ? formik.errors.doanhThuDuKien.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Ghi chú
                                                </Typography>
                                                <TextareaAutosize
                                                    id="ghiChu"
                                                    name="ghiChu"
                                                    value={formik.values.ghiChu}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    minRows={4}
                                                />
                                                {formik.touched.ghiChu &&
                                                    Boolean(formik.errors.ghiChu) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.ghiChu
                                                                ? formik.errors.ghiChu.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Kết quả{" "}
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="ketQua"
                                                        name="ketQua"
                                                        type="ketQua"
                                                        value={formik.values.ketQua}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.ketQua &&
                                                            Boolean(formik.errors.ketQua)
                                                        }
                                                    >
                                                        <MenuItem value="null">
                                                            Chưa xác định
                                                        </MenuItem>
                                                        <MenuItem value="true">
                                                            Thành công
                                                        </MenuItem>
                                                        <MenuItem value="false">Thất bại</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.ketQua &&
                                                    Boolean(formik.errors.ketQua) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.ketQua
                                                                ? formik.errors.ketQua.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        {
                                            formik.values.ketQua === "false" || formik.values.ketQua === false || formik.values.ketQua === null ? <>
                                                <Grid item md={12} xs={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Lý do thất bại
                                                        </Typography>
                                                        <TextareaAutosize
                                                            id="lyDoThatBai"
                                                            name="lyDoThatBai"
                                                            value={formik.values.lyDoThatBai}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            minRows={4}
                                                        />
                                                        {formik.touched.lyDoThatBai &&
                                                            Boolean(formik.errors.lyDoThatBai) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.lyDoThatBai
                                                                        ? formik.errors.lyDoThatBai.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>
                                            </> : <></>
                                        }

                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        p: 1,
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography sx={{ mr: 1.5, mb: 1.5, fontWeight: 'bold' }}>
                                                        File nhà thầu :
                                                    </Typography>
                                                    {isUpdate && defaulValue && defaulValue.tenFileNhaThau ? (
                                                        <>
                                                            <Typography>{defaulValue.tenFileNhaThau}</Typography>
                                                            {defaulValue.fileNhaThau ? (
                                                                <FileDownloadIcon
                                                                    sx={{ ml: 1, cursor: 'pointer' }}
                                                                    onClick={() => handleDownloadFile(defaulValue.fileNhaThau!)}
                                                                />
                                                            ) : (
                                                                <Typography>Chưa có dữ liệu</Typography>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Box>
                                                <input
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    ref={contractorFileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleContractorFileUpload}
                                                />
                                                <Button variant="contained"
                                                    type="button" onClick={handleContractorButtonClick}>Upload file nhà thầu</Button>
                                                {contractorFile && (
                                                    <div>
                                                        <p>Name: {contractorFile.name}</p>
                                                        <p>Size: {(contractorFile.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                )}

                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        p: 1,
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography sx={{ mr: 1.5, mb: 1.5, fontWeight: 'bold' }}>
                                                        File công ty :
                                                    </Typography>
                                                    {isUpdate && defaulValue && defaulValue.tenFileCongTy ? (
                                                        <>
                                                            <Typography>{defaulValue.tenFileCongTy}</Typography>
                                                            {defaulValue.fileCongTy ? (
                                                                <FileDownloadIcon
                                                                    sx={{ ml: 1, cursor: 'pointer' }}
                                                                    onClick={() => handleDownloadFile(defaulValue.fileCongTy!)}
                                                                />
                                                            ) : (
                                                                <Typography>Chưa có dữ liệu</Typography>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Box>
                                                <input
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    ref={companyFileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleCompanyFileUpload}
                                                />
                                                <Button variant="contained"
                                                    type="button" onClick={handleCompanyButtonClick}>Upload File Công ty</Button>
                                                {companyFile && (
                                                    <div>
                                                        <p>Name: {companyFile.name}</p>
                                                        <p>Size: {(companyFile.size / 1024).toFixed(2)} KB</p>
                                                    </div>
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