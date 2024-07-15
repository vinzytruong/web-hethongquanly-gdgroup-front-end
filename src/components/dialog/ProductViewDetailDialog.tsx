import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Card,
    Chip,
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import { Products } from "@/interfaces/products";
import { addProduct } from "@/constant/api";
import useProducts from "@/hooks/useProducts";
import useProductTypes from "@/hooks/useProductTypes";
import useSubjects from "@/hooks/useSubjects";
import useGrades from "@/hooks/useGrades";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import MultipleSelectCheckBoxUtilizedObject from "../multiple-select/MultipleSelectCheckBoxUtilizedObject";
import { UtilizedObject, utilizedObjects } from "@/interfaces/utilizedObject";
import { useFormik } from "formik";
import * as yup from "yup";
import Divider from "@mui/material/Divider";
export const validationUtilizedObjectSchema = yup.object({
    maSanPham: yup.string().required("Vui lòng nhập mã sản phẩm"),
    donViTinh: yup.string().required("Vui lòng nhập đơn vị tính"),
    tenSanPham: yup.string().required("Vui lòng nhập tên sản phẩm"),
    hangSanXuat: yup.string().required("Vui lòng nhập tên HSX/NSX"),
    xuatXu: yup.string().required("Vui lòng nhập tên xuất xứ"),
    doiTuongSuDung: yup.string().required("Vui lòng chọn đối tượng sử dụng"),
    loaiSanPhamID: yup
        .number()
        .positive("Vui lòng nhập loại sản phẩm") // Validates against negative values
        .required("Vui lòng nhập loại sản phẩm") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập loại sản phẩm"),
    khoiLop: yup.array().min(1, "Vui lòng nhập  lớp"),
    monHoc: yup
        .array()

        .min(1, "Vui lòng nhập  môn học"),
    thongTu: yup.array().min(1, "Vui lòng nhập  thông tư"),
    tieuChuanKyThuat: yup.string().required("Vui lòng nhập tiêu chuẩn kĩ thuật"),
    soLuong: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    thue: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    baoHanh: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    giaDaiLy: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    giaVon: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    giaTH_TT: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    giaTTR: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
    giaCDT: yup
        .number()
        .typeError("Vui lòng nhập định dạng số")
        .positive("Vui lòng nhập định dạng số") // Validates against negative values
        .required("Vui lòng nhập định dạng số") // Sets it as a compulsory field
        .min(1, "Vui lòng nhập định dạng số"),
});

export default function ProductViewDetailDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const onHandleClose = () => {
        handleOpen(false);
    };

    return (
        <>
            <Dialog
                maxWidth="xl"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant="h3">
                        {title} - {defaulValue.maSanPham}
                    </Typography>
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
                                        Mã sản phẩm
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.maSanPham}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Tên sản phẩm
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.tenSanPham}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Hình ảnh
                                    </Grid>
                                    <Grid item md={6}>
                                        <Box sx={{ ml: 1 }}>
                                            {defaulValue && defaulValue.hinhAnh ? (
                                                <img src={defaulValue.hinhAnh} alt="Uploaded File" />
                                            ) : (
                                                <>Chưa có hình ảnh</>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Tiêu chuẩn kỹ thuật
                                    </Grid>
                                    <Grid item md={6}>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: defaulValue.tieuChuanKyThuat
                                                    ? defaulValue.tieuChuanKyThuat
                                                    : "Chưa có dữ liệu",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Thương hiệu
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.thuongHieu}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Đơn vị tính
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.donViTinh.tenDVT}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Model
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}> {defaulValue.model}</Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        HSX/NSX
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.hangSanXuat}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Nhà xuất bản
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.nhaXuatBan}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Đối tượng sử dụng
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.doiTuongSuDung}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Bảo hành
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.baoHanh} tháng
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Thuế
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.thue} %
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Giá Vốn
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.giaVon
                                                ? defaulValue.giaVon.toLocaleString()
                                                : "Chưa có dữ liệu"}{" "}
                                            đ
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Giá đại lý
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {" "}
                                            {defaulValue.giaDaiLy
                                                ? defaulValue.giaDaiLy.toLocaleString()
                                                : "Chưa có dữ liệu"}{" "}
                                            đ
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Giá TTR
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.giaTTR
                                                ? defaulValue.giaTTR.toLocaleString()
                                                : "Chưa có dữ liệu"}{" "}
                                            đ
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Giá CĐT
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.giaCDT
                                                ? defaulValue.giaCDT.toLocaleString()
                                                : "Chưa có dữ liệu"}{" "}
                                            đ
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Giá TH-TT
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ ml: 1 }}>
                                            {defaulValue.giaTH_TT
                                                ? defaulValue.giaTH_TT.toLocaleString()
                                                : "Chưa có dữ liệu"}{" "}
                                            đ
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Lớp
                                    </Grid>
                                    <Grid item md={6}>
                                        <Box sx={{ ml: 1 }}>
                                            {defaulValue.khoiLop && defaulValue.khoiLop.length > 0
                                                ? defaulValue.khoiLop.map((mh: any, index: number) => (
                                                    <Chip
                                                        key={index}
                                                        label={mh.tenKhoiLop}
                                                        style={{ margin: "2px" }}
                                                    />
                                                ))
                                                : "Chưa có dữ liệu"}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Môn học
                                    </Grid>
                                    <Grid item md={6}>
                                        <Box sx={{ ml: 1 }}>
                                            {defaulValue.monHoc && defaulValue.monHoc.length > 0
                                                ? defaulValue.monHoc.map((mh: any, index: number) => (
                                                    <Chip
                                                        key={index}
                                                        label={mh.tenMonHoc}
                                                        style={{ margin: "2px" }}
                                                    />
                                                ))
                                                : "Chưa có dữ liệu"}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                                <Grid container>
                                    <Grid item md={6} sx={{ fontWeight: "bold" }}>
                                        Thông tư
                                    </Grid>
                                    <Grid item md={6}>
                                        <Box sx={{ ml: 1 }}>
                                            {defaulValue.thongTu && defaulValue.thongTu.length > 0
                                                ? defaulValue.thongTu.map((mh: any, index: number) => (
                                                    <Chip
                                                        key={index}
                                                        label={mh.tenThongTu}
                                                        style={{ margin: "2px" }}
                                                    />
                                                ))
                                                : "Chưa có dữ liệu"}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}></DialogActions>
            </Dialog>
        </>
    );
}
