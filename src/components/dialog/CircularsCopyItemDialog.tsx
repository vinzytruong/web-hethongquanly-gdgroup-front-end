import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Checkbox,
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
import { addCircular, addList, getProductByThongTuId } from "@/constant/api";
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
import axios from "axios";
import { Products } from "@/interfaces/products";
import ListCopyItem from "@/views/product/category/ListCopyItem";
export const validationUtilizedObjectSchema = yup.object({
    tenThongTu: yup.string().required("Vui lòng nhập tên danh mục"),
});
export default function CircularsCopyItemDialog(props: PropsDialog) {
    const theme = useTheme()
    const [checked, setChecked] = useState<Products[]>([]);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const handleCheck = (data: Products) => {
        const isChecked = checked.some((product) => product.sanPhamID === data.sanPhamID); // Kiểm tra xem sản phẩm có tồn tại trong mảng checked không
        if (isChecked) {
            setChecked((prev) => prev.filter((product) => product.sanPhamID !== data.sanPhamID)); // Loại bỏ sản phẩm khỏi mảng checked nếu đã được chọn
        } else {
            setChecked((prev) => [...prev, data]); // Thêm sản phẩm vào mảng checked nếu chưa được chọn
        }
    };
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
    const [formData, setFormData] = useState<Circulars>();
    const { addCirculars, updateCirculars, dataCirculars } = useCirculars();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);
    const [dataProducts, setDataProducts] = useState<Products[]>([]);

    const [selectedCirCular, setSelectedCircular] = useState<number>(0);
    const onHandleClose = () => {
        handleOpen(false);
        setCheckedAll(false)
        setChecked([])
        setDataProducts([])
        setSelectedCircular(0)
    };
    const handleSelectedCircular = async (thongTuID: number) => {
        setSelectedCircular(thongTuID);
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(getProductByThongTuId + "/" + thongTuID, {
            headers,
        });
        setDataProducts(response.data)
    };
    const handleSetCheckedAll = async () => {
        if (checkedAll === false) {
            const uniqueProducts = Array.from(new Set([...checked, ...dataProducts]));
            setChecked(uniqueProducts);
        } else {
            setChecked([])
        }
        setCheckedAll(!checkedAll)
    };
    const handleCombackSelectedCircular = async () => {
        setCheckedAll(false)
        setChecked([])
        setDataProducts([])
        setSelectedCircular(0)
    };
    const handleSubmit = async () => {
        const sanPhamIDs = checked.map(product => product.sanPhamID);
        const accessToken = window.localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
        const data = {
            thongTuID: defaulValue.thongTuID,
            lstSanPham: sanPhamIDs
        }
        const response = await axios.post(addList, data, { headers });
        if (response.status === 200) {
            toast.success("Cập nhật danh mục thành công")
        }

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
                    <Grid container>
                        <Grid item lg={3}>
                            <Typography variant="h4" sx={{ mb: 2 }}>Các danh mục</Typography>
                            {dataCirculars
                                .filter(item => item.thongTuID !== defaulValue.thongTuID)
                                .map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        value={item.thongTuID}
                                        onClick={() => handleSelectedCircular(item.thongTuID ?? 0)}
                                        sx={{
                                            backgroundColor: selectedCirCular === item.thongTuID ? theme.palette.primary.main : 'transparent',
                                            display: selectedCirCular === 0 || selectedCirCular === item.thongTuID ? 'block' : 'none' // Hide if selectedCirCular is not 0 and not matching the current item
                                        }}
                                    >
                                        {item.tenThongTu}
                                    </MenuItem>
                                ))
                            }
                            <Button key={0} onClick={() => handleCombackSelectedCircular()}  >
                                Quay lại
                            </Button>
                        </Grid>
                        <Grid item lg={9}>
                            <Typography variant="h4" sx={{ ml: 3, mb: 2 }}>Danh sách sản phẩm </Typography>
                            {dataProducts && dataProducts.length ? (<><ListCopyItem checked={checked}
                                onHandleChecked={handleCheck} onHandleSetCheckedAll={handleSetCheckedAll} checkedAll={checkedAll} dataProducts={dataProducts} /></>) : (<></>)}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {isUpdate && (
                        <LoadingButton
                            sx={{ p: "12px 24px" }}
                            type="submit"
                            onClick={handleSubmit}
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
