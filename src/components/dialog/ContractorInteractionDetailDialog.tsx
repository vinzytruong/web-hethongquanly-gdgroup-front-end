import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/material/styles";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { PropsDialog } from "@/interfaces/dialog";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
export const validationUtilizedObjectSchema = yup.object({
    canBoTiepXuc: yup.string().required("Vui lòng nhập tên cán bộ tiếp xúc"),
    soDienThoai: yup.string().required("Vui lòng nhập tên cán bộ tiếp xúc"),
    nhomHangQuanTam: yup.string().required("Vui lòng nhập nhóm hàng quan tâm"),
    nguonVonID: yup
        .number()
        .positive("Vui lòng chọn nguồn vốn") // Validates against negative values
        .required("Vui lòng chọn nguồn vốn") // Sets it as a compulsory field
        .min(1, "Vui lòng chọn nguồn vốn"),
    lyDoKhongHopTac: yup.string().required("Vui lòng nhập lý do không hợp tác"),
    ghiChu: yup.string().required("Vui lòng nhập ghi chú"),
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
    handleUploadFile?: (e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?: (e: any) => void,
    note?: string;
    fetchData?: () => void;
    dataSourceOfFunds: SourceOfFunds[]
    dataContractorTags: ContractorTags[]
}

export default function ContractorInteractionDetailDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id, dataSourceOfFunds, dataContractorTags } = props;
    const [formData, setFormData] = useState<ContractorInteractions>();
    const { addContractorInteractions, updateContractorInteractions, dataContractorInteractions } = useContractorInteractions();
    const [loading, setLoading] = useState<boolean>(false);

    const theme = useTheme();
    const [entityError, setEntityError] = useState(null);

    const formik = useFormik({
        initialValues: {
            canBoTiepXuc: defaulValue?.canBoTiepXuc ?? "",
            soDienThoai: defaulValue?.soDienThoai ?? "",
            thoiGianTiepXuc: defaulValue?.thoiGianTiepXuc ?? "",
            nhomHangQuanTam: defaulValue?.nhomHangQuanTam ?? "",
            nguonVonID: defaulValue?.nguonVonID ?? 0,
            isQuanTamHopTac: defaulValue?.isQuanTamHopTac ?? false,
            isKyHopDongNguyenTac: defaulValue?.isKyHopDongNguyenTac ?? false,
            lyDoKhongHopTac: defaulValue?.lyDoKhongHopTac ?? "",
            ghiChu: defaulValue?.ghiChu ?? "",
            theID: defaulValue?.theID ?? 0,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            values.thoiGianTiepXuc = selectedDate?.format('DD/MM/YYYY 00:00:00');
            const data: ContractorInteractions = {
                ...values,
                nhaThauID: id!
            };
            try {
                if (isInsert) {
                    const response = await addContractorInteractions(data);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.gtchid = defaulValue.gtchid;
                    await updateContractorInteractions(data);
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
                canBoTiepXuc: defaulValue?.canBoTiepXuc ?? "",
                soDienThoai: defaulValue?.soDienThoai ?? "",
                thoiGianTiepXuc: defaulValue?.thoiGianTiepXuc ?? "",
                nguonVonID: defaulValue?.nguonVonID ?? 0,
                isQuanTamHopTac: defaulValue?.isQuanTamHopTac ?? "",
                isKyHopDongNguyenTac: defaulValue?.isKyHopDongNguyenTac ?? "",
                lyDoKhongHopTac: defaulValue?.lyDoKhongHopTac ?? "",
                ghiChu: defaulValue?.ghiChu ?? "",
                theID: defaulValue?.theID ?? 0,
                nhomHangQuanTam: defaulValue?.nhomHangQuanTam ?? "",
            });
        }
    }, [defaulValue]);
    //namSanXuat
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs()); // Initialize with dayjs object

    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            formik.resetForm();
            setEntityError(null);
        }
    };
    console.log('<<<3', defaulValue);

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
                    <Card variant="outlined" sx={{ p: 4 }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item md={11}>
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Cán bộ tiếp xúc
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {
                                                defaulValue?.listCanBoTiepXuc?.map((item: any) => {
                                                    return (
                                                        <Box key={item.id}>
                                                            {/* Render your item details here */}
                                                            {item.chucVu + ' - ' + item.tenNguoiPhuTrach + ' - ' + item.soDienThoai} {/* Example: displaying the name property of each item */}
                                                        </Box>
                                                    );
                                                }) || <Box></Box> // Fallback content
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Nhóm hàng quan tâm
                                    </Grid>
                                    <Grid item md={6}>
                                        {defaulValue && defaulValue.loaiSanPham && defaulValue.loaiSanPham.length > 0
                                            ? defaulValue.loaiSanPham.map((mh: any, index: any) => (
                                                <Chip
                                                    key={index}
                                                    label={mh.tenLoaiSanPham}
                                                    style={{ margin: "2px" }}
                                                />
                                            ))
                                            : "Chưa có dữ liệu"}
                                    </Grid>
                                </Grid>
                                {
                                    defaulValue.isQuanTamHopTac === false ? <>

                                        <Divider sx={{ mb: 2, mt: 2 }} />
                                        <Grid container>
                                            <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                                Lý do không hợp tác
                                            </Grid>
                                            <Grid item md={6}>
                                                <Typography sx={{ ml: 1 }}>
                                                    {defaulValue.lyDoKhongHopTac}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ mb: 2, mt: 2 }} />
                                    </> : <>
                                        <Divider sx={{ mb: 2, mt: 2 }} />
                                        <Grid container>
                                            <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                                Quan tâm hợp tác
                                            </Grid>
                                            <Grid item md={6}>
                                                <Typography sx={{ ml: 1 }}>
                                                    {defaulValue.isQuanTamHopTac === true ? "Có" : "Không"}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ mb: 2, mt: 2 }} />
                                    </>
                                }
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Ký hợp đồng nguyên tắc
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.isKyHopDongNguyenTac === true ? "Có" : "Không"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Nguồn vốn
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.nguonVon?.tenNguonVon}

                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Thẻ
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.nT_The?.tenThe}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Thời gian tiếp xúc
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.thoiGianTiepXuc}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Nhân viên tạo
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.nhanVien.tenNhanVien}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Ghi chú
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.ghiChu}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
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