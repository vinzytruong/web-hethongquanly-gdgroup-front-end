import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
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
import { addUnit, getAllNguonVon, getAllThe } from "@/constant/api";
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
export const validationUtilizedObjectSchema = yup.object({
    nguonVonID: yup
        .number()
        .positive("Vui lòng chọn nguồn vốn") // Validates against negative values
        .required("Vui lòng chọn nguồn vốn") // Sets it as a compulsory field
        .min(1, "Vui lòng chọn nguồn vốn"),
    theID: yup
        .number()
        .positive("Vui lòng chọn thẻ") // Validates against negative values
        .required("Vui lòng chọn thẻ") // Sets it as a compulsory field
        .min(1, "Vui lòng chọn thẻ"),

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
    fetchContractorInteractionsList?: () => void;
    dataSourceOfFunds: SourceOfFunds[]
    dataContractorTags: ContractorTags[]
    contractor?: Contractors,
    finalContractorInteraction?: ContractorInteractions | null
}

export default function ContractorInteractionDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id, dataContractorTags, dataSourceOfFunds, fetchContractorInteractionsList, contractor, finalContractorInteraction } = props;

    const [formData, setFormData] = useState<ContractorInteractions>();
    const { addContractorInteractions, updateContractorInteractions } = useContractorInteractions();
    const { dataProductTypes } = useProductTypes();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const [selectedProductTypes, setSelectedProductTypes] = useState<ProductTypes[]>([]);
    const [selectedStaffInCharge, setStaffInCharges] = useState<StaffInCharge[]>([]);
    const [dataStaffInCharge, setDataStaffInCharge] = useState<StaffInCharge[]>([]);
    const handleSelectedProductTypes = (data: ProductTypes[]) => {
        formik.setFieldValue("productType", data);
        setSelectedProductTypes(data);
    };
    const handleSelectedStaffInCharges = (data: StaffInCharge[]) => {
        formik.setFieldValue("staffInCharge", data);
        setStaffInCharges(data);
    };
    useEffect(() => {
        let newNguoiDaiDien: StaffInCharge = {
            tenNguoiPhuTrach: contractor?.nguoiDaiDien || "", // Using default value if undefined
            soDienThoai: contractor?.nddSoDienThoai || "", // Using default value if undefined
            chucVu: contractor?.nddChucVu || "", // Using default value if undefined
            id: Date.now()
        };
        let list: StaffInCharge[] = []
        if (contractor?.listNhanVienPhuTrach) {
            list = [...contractor?.listNhanVienPhuTrach]
        }
        if (contractor?.nguoiDaiDien) {
            list.push(newNguoiDaiDien)
        }
        setDataStaffInCharge(list)
    }, [contractor]);
    const formik = useFormik({
        initialValues: {
            thoiGianTiepXuc: defaulValue?.thoiGianTiepXuc ?? "",
            nhomHangQuanTam: defaulValue?.nhomHangQuanTam ?? "",
            nguonVonID: defaulValue?.nguonVonID ?? 0,
            isQuanTamHopTac: defaulValue?.isQuanTamHopTac ?? false,
            isKyHopDongNguyenTac: defaulValue?.isKyHopDongNguyenTac ?? false,
            lyDoKhongHopTac: defaulValue?.lyDoKhongHopTac ?? "",
            ghiChu: defaulValue?.ghiChu ?? "",
            theID: defaulValue?.theID ?? 0,
            productType: selectedProductTypes,
            staffInCharge: selectedStaffInCharge,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            values.thoiGianTiepXuc = selectedDate?.format('DD/MM/YYYY 00:00:00');
            const data: ContractorInteractions = {
                ...values,
                nhaThauID: id!,
                loaiSanPhamDTO: selectedProductTypes,
                canBoTiepXuc: JSON.stringify(selectedStaffInCharge),
            };
            try {
                if (isInsert) {
                    data.loaiSanPhamDTO = selectedProductTypes
                    const response = await addContractorInteractions(data);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                    setStaffInCharges([])
                    setSelectedProductTypes([])
                } else {
                    data.gtchid = defaulValue.gtchid;
                    data.nhaThauID = defaulValue.nhaThauID;
                    data.loaiSanPhamDTO = selectedProductTypes
                    await updateContractorInteractions(data);
                    toast.success("Cập nhật dữ liệu thành công", {});
                    setLoading(false);
                }
                await fetchContractorInteractionsList!()
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });
    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (defaulValue) {
            formik.setValues({
                thoiGianTiepXuc: defaulValue?.thoiGianTiepXuc ?? "",
                nguonVonID: defaulValue?.nguonVonID ?? 0,
                isQuanTamHopTac: defaulValue?.isQuanTamHopTac ?? "",
                isKyHopDongNguyenTac: defaulValue?.isKyHopDongNguyenTac ?? "",
                lyDoKhongHopTac: defaulValue?.lyDoKhongHopTac ?? "",
                ghiChu: defaulValue?.ghiChu ?? "",
                theID: defaulValue?.theID ?? 0,
                nhomHangQuanTam: defaulValue?.nhomHangQuanTam ?? "",
                productType: defaulValue.loaiSanPham,
                staffInCharge: defaulValue.listNguoiPhuTrach,

            });
            setSelectedProductTypes(defaulValue.loaiSanPham);
            setStaffInCharges(JSON.parse(defaulValue.canBoTiepXuc));
        }
        if (finalContractorInteraction) {
            formik.setFieldValue('isQuanTamHopTac', finalContractorInteraction?.isQuanTamHopTac ?? "");
            formik.setFieldValue('isKyHopDongNguyenTac', finalContractorInteraction?.isKyHopDongNguyenTac ?? "");
            // setSelectedProductTypes(finalContractorInteraction.loaiSanPham!);
            // setStaffInCharges(JSON.parse(finalContractorInteraction.canBoTiepXuc));
        }
    }, [defaulValue, finalContractorInteraction]);
    //namSanXuat
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs()); // Initialize with dayjs object
    const handleDateChange = (date: dayjs.Dayjs | null) => {
        // Accept dayjs.Dayjs | null type
        setSelectedDate(date);
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
                                                    Nhóm hàng hóa <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <MultipleSelectCheckBoxProductType
                                                    touched={Boolean(formik.touched.productType)}
                                                    error={Boolean(formik.errors.productType)}
                                                    onHandleSelectedProductTypes={handleSelectedProductTypes}
                                                    ProductTypes={dataProductTypes}
                                                    selectedProductTypes={selectedProductTypes}
                                                />
                                                {formik.touched.productType &&
                                                    Boolean(formik.errors.productType) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.productType
                                                                ? formik.errors.productType.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                                {formik.touched.productType &&
                                                    Boolean(formik.errors.productType) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.productType
                                                                ? formik.errors.productType.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Các bộ tiếp xúc <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <MultipleSelectCheckBoxStaffInCharge
                                                    touched={Boolean(formik.touched.staffInCharge)}
                                                    error={Boolean(formik.errors.productType)}
                                                    onHandleSelectedStaffInCharge={handleSelectedStaffInCharges}
                                                    staffInCharges={dataStaffInCharge}
                                                    selectedStaffInCharge={selectedStaffInCharge}
                                                />
                                                {formik.touched.staffInCharge &&
                                                    Boolean(formik.errors.staffInCharge) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.staffInCharge
                                                                ? formik.errors.staffInCharge.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                                {formik.touched.staffInCharge &&
                                                    Boolean(formik.errors.staffInCharge) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.staffInCharge
                                                                ? formik.errors.staffInCharge.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Thời gian tiếp xúc
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
                                                <div className="date_picker">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            value={selectedDate}
                                                            onChange={handleDateChange}
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mt: 3 }}>
                                                <Box>
                                                    <FormControlLabel
                                                        label="Quan tâm hợp tác"
                                                        control={
                                                            <Checkbox
                                                                name="isQuanTamHopTac"
                                                                checked={formik.values.isQuanTamHopTac}
                                                                onChange={(event) => {
                                                                    formik.setFieldValue(
                                                                        "isQuanTamHopTac",
                                                                        event.target.checked
                                                                    );
                                                                }}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        }
                                                    />
                                                    {formik.touched.isQuanTamHopTac &&
                                                        Boolean(formik.errors.isQuanTamHopTac) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.isQuanTamHopTac
                                                                    ? formik.errors.isQuanTamHopTac.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                                <Box>
                                                    <FormControlLabel
                                                        label="Ký Hợp đồng nguyên tắc"
                                                        control={
                                                            <Checkbox
                                                                name="isKyHopDongNguyenTac"
                                                                checked={formik.values.isKyHopDongNguyenTac}
                                                                onChange={(event) => {
                                                                    formik.setFieldValue(
                                                                        "isKyHopDongNguyenTac",
                                                                        event.target.checked
                                                                    );
                                                                }}
                                                                onBlur={formik.handleBlur}

                                                            />
                                                        }
                                                    />
                                                    {formik.touched.isKyHopDongNguyenTac &&
                                                        Boolean(formik.errors.isKyHopDongNguyenTac) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.isKyHopDongNguyenTac
                                                                    ? formik.errors.isKyHopDongNguyenTac.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Nguồn vốn </span>
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="nguonVonID"
                                                        name="nguonVonID"
                                                        type="nguonVonID"
                                                        value={formik.values.nguonVonID}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.nguonVonID &&
                                                            Boolean(formik.errors.nguonVonID)
                                                        }
                                                    >
                                                        {dataSourceOfFunds && dataSourceOfFunds.length > 0 && dataSourceOfFunds.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                defaultValue={formik.values.nguonVonID}
                                                                value={item.nguonVonID}
                                                            >
                                                                {item.tenNguonVon}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.nguonVonID &&
                                                    Boolean(formik.errors.nguonVonID) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.nguonVonID
                                                                ? formik.errors.nguonVonID.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Thẻ</span>
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="theID"
                                                        name="theID"
                                                        type="theID"
                                                        value={formik.values.theID}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.theID &&
                                                            Boolean(formik.errors.theID)
                                                        }
                                                    >
                                                        {dataContractorTags && dataContractorTags.length > 0 && dataContractorTags.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                defaultValue={formik.values.theID}
                                                                value={item.id}
                                                            >
                                                                {item.tenThe}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.theID &&
                                                    Boolean(formik.errors.theID) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.theID
                                                                ? formik.errors.theID.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        {
                                            formik.values.isQuanTamHopTac === false &&
                                            <Grid item md={12} xs={12}>
                                                <Box style={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                        Lý do không hợp tác <span className="required_text">(*)</span>{" "}
                                                    </Typography>
                                                    <TextareaAutosize
                                                        id="lyDoKhongHopTac"
                                                        name="lyDoKhongHopTac"
                                                        value={formik.values.lyDoKhongHopTac}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        minRows={4}
                                                    />
                                                    {formik.touched.lyDoKhongHopTac &&
                                                        Boolean(formik.errors.lyDoKhongHopTac) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.lyDoKhongHopTac
                                                                    ? formik.errors.lyDoKhongHopTac.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                            </Grid>
                                        }

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