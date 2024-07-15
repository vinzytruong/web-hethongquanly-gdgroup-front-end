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
import MultipleSelectCheckBoxGrade from "../multiple-select/MultipleSelectCheckBoxGrade";
import MultipleSelectCheckBoxSubject from "../multiple-select/MultipleSelectCheckBoxSubject";
import useCirculars from "@/hooks/useCirculars";
import MultipleSelectCheckBoxCircular from "../multiple-select/MultipleSelectCheckBoxCircular";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import { Units } from "@/interfaces/units";
import useUnits from "@/hooks/useUnits";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UnitsDialog from "./UnitsDialog";
import ProductTypesDialog from "./ProductTypeDialog";
import CircularsDialog from "./CircularDialog";

interface Props {
    title: string,
    defaulValue?: any,
    open: boolean,
    id?: number,
    isShowFullTCKT: string,
    idParent?: number,
    file?: File | null,
    handleOpen: (e: boolean) => void,
    isAddProductInEstimate: boolean,
    onHandleAddProductInEstimate: (data: Products) => Promise<any>
}
export default function AddProductInEstimateDialog(props: Props) {

    const { title, defaulValue, handleOpen, open, isAddProductInEstimate, onHandleAddProductInEstimate, isShowFullTCKT } = props;
    const validationUtilizedObjectSchema = yup.object({
        maSanPham: yup.string().required("Vui lòng nhập mã sản phẩm"),
        tenSanPham: yup.string().required("Vui lòng nhập tên sản phẩm"),
        xuatXu: yup.string().required("Vui lòng nhập tên xuất xứ"),
        doiTuongSuDung: yup.string().required("Vui lòng chọn đối tượng sử dụng"),
        loaiSanPhamID: yup
            .number()
            .positive("Vui lòng nhập loại sản phẩm") // Validates against negative values
            .required("Vui lòng nhập loại sản phẩm") // Sets it as a compulsory field
            .min(1, "Vui lòng nhập loại sản phẩm"),
        dvtid: yup
            .number()
            .positive("Vui lòng chọn đơn vị tính") // Validates against negative values
            .required("Vui lòng chọn đơn vị tính") // Sets it as a compulsory field
            .min(1, "Vui lòng chọn đơn vị tính"),
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
        giaBan: yup
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
    });
    const [formData, setFormData] = useState<Products>();
    const { dataProductTypes } = useProductTypes();
    const { dataSubjects } = useSubjects();
    const { dataGrades } = useGrades();
    const { dataCirculars } = useCirculars();
    const { dataUnits } = useUnits();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedGrades, setSelectedGrades] = useState<Grades[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<Subjects[]>([]);
    const [selectedCirculars, setSelectedCirculars] = useState<Circulars[]>([]);
    const [entityError, setEntityError] = useState<string | null>(null);

    const [filePreview, setFilePreview] = useState<string | undefined>(undefined);
    const [file, setFile] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            maSanPham: defaulValue?.maSanPham ?? "",
            dvtid: defaulValue?.dvtid ?? 0,
            tenSanPham: defaulValue?.tenSanPham ?? "",
            hangSanXuat: isShowFullTCKT === "true" ? '' : "VN",
            thuongHieu: defaulValue?.hangSanXuat ?? null,
            model: defaulValue?.hangSanXuat ?? null,
            xuatXu: isShowFullTCKT === "true" ? '' : 'VN',
            nhaXuatBan: isShowFullTCKT === "true" ? '' : 'VN',
            doiTuongSuDung: defaulValue?.doiTuongSuDung ?? "",
            loaiSanPhamID: defaulValue?.loaiSanPhamID ?? 0,
            khoiLop: selectedGrades,
            monHoc: selectedSubjects,
            thongTu: selectedCirculars,
            tieuChuanKyThuat: defaulValue?.tieuChuanKyThuat ?? "",
            soLuong: defaulValue?.soLuong ?? 1,
            thue: defaulValue?.thue ?? "",
            baoHanh: isShowFullTCKT === "true" ? '' : 1,
            giaBan: defaulValue?.giaDaiLy ?? "",
            giaVon: defaulValue?.giaVon ?? "",
            hinhAnh: defaulValue?.hinhAnh ?? "",
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);

            const data: Products = {
                ...values,
                hangSanXuat: !values.hangSanXuat && values.hangSanXuat === '' ? null : values.hangSanXuat,
                nhaXuatBan: values.nhaXuatBan && values.nhaXuatBan === '' ? null : values.nhaXuatBan,
                thuongHieu: values.thuongHieu && values.thuongHieu === '' ? null : values.thuongHieu,
                model: values.thuongHieu && values.thuongHieu === '' ? null : values.thuongHieu,
                soLuong: parseInt(values.soLuong.toString()),
                thue: parseInt(values.thue.toString()),
                baoHanh: parseInt(values.baoHanh.toString()),
                giaBan: parseInt(values.giaBan.toString()),
                giaVon: parseInt(values.giaVon.toString()),
                giaCDT: parseInt(values.giaVon.toString()),
                giaTH_TT: parseInt(values.giaVon.toString()),
                giaTTR: parseInt(values.giaVon.toString()),
                giaDaiLy: parseInt(values.giaVon.toString()),
                namSanXuat: selectedDate?.year() ?? 0,
                thongTu: values.thongTu.map((item) => ({
                    thongTuID: item.thongTuID,
                    tenThongTu: item.tenThongTu,
                })),
                hinhAnh: file ?? values.hinhAnh,
            };
            if (isAddProductInEstimate && onHandleAddProductInEstimate) {
                data.khoiLop = data.khoiLop.map((x) => ({
                    khoiLopID: x.khoiLopID,
                    tenKhoiLop: x.tenKhoiLop,
                }));
                data.donViTinh = dataUnits.find((x) => x.dvtid === data.dvtid)
                data.monHoc = data.monHoc.map((x) => ({
                    monHocID: x.monHocID,
                    tenMonHoc: x.tenMonHoc,
                }));
                data.thongTu = data.thongTu.map((x) => ({
                    thongTuID: x.thongTuID,
                    tenThongTu: x.tenThongTu,
                }));
                if (data) {
                    const check = await onHandleAddProductInEstimate(data);
                    if (check === true) {
                        handleOpen(false);
                        formik.resetForm();
                        setContent("");
                        setGiaCDT("");
                        setGiaDaiLy("");
                        setGiaTH_TT("");
                        setGiaVon("");
                        setGiaTTR("");
                        setEntityError(null);
                        setSelectedCirculars([]);
                        setSelectedGrades([]);
                        setSelectedSubjects([]);
                    } else {
                        setEntityError("Mã sản phẩm đã tồn tại")
                    }

                }
                return;
            }
        },
    });

    useEffect(() => {

        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik

        if (defaulValue) {

            formik.setValues({
                maSanPham: defaulValue.maSanPham || "",
                dvtid: defaulValue.donViTinh.dvtid || 0,
                tenSanPham: defaulValue.tenSanPham || "",
                hangSanXuat: defaulValue.hangSanXuat || "",
                thuongHieu: defaulValue.thuongHieu || "",
                xuatXu: defaulValue.xuatXu || "",
                nhaXuatBan: defaulValue.nhaXuatBan || "",
                doiTuongSuDung: defaulValue.doiTuongSuDung || "",
                loaiSanPhamID: defaulValue.loaiSanPham.loaiSanPhamID || 0,
                khoiLop: defaulValue.khoiLop,
                monHoc: defaulValue.monHoc,
                thongTu: defaulValue.thongTu,
                tieuChuanKyThuat: defaulValue.tieuChuanKyThuat || "",
                soLuong: defaulValue.soLuong || 1,
                thue: defaulValue.thue || "",
                baoHanh: defaulValue.baoHanh || "",
                giaBan: defaulValue.giaBan || "",
                giaVon: defaulValue.giaVon || "",
                model: defaulValue.model || "",
                hinhAnh: defaulValue.hinhAnh
            });
            setGiaDaiLy(formatPrice(defaulValue.giaDaiLy));
            setGiaVon(formatPrice(defaulValue.giaVon));
            setGiaCDT(formatPrice(defaulValue.giaCDT));
            setGiaTTR(formatPrice(defaulValue.giaTTR));
            setGiaTH_TT(formatPrice(defaulValue.giaTH_TT));
            setSelectedGrades(defaulValue.khoiLop);
            setSelectedCirculars(defaulValue.thongTu);
            setSelectedSubjects(defaulValue.monHoc);
            setContent(defaulValue.tieuChuanKyThuat);
        }
    }, [defaulValue]);
    const handleChange = (e: any) => {
        if (e.target) {
            setFormData((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
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

    //KhoiLop
    const handleSelectedGrades = (data: Grades[]) => {
        formik.setFieldValue("khoiLop", data);
        setSelectedGrades(data);
    };
    //Môn Học
    const handleSelectedSubjects = (data: Subjects[]) => {
        formik.setFieldValue("monHoc", data);
        setSelectedSubjects(data);
    };
    //Thông Tư
    const handleSelectedCirculars = (data: Circulars[]) => {
        formik.setFieldValue("thongTu", data);
        setSelectedCirculars(data);
    };
    // Hàm này sẽ định dạng số và thêm dấu phân cách vào mỗi 3 chữ số.
    const [giaDaiLy, setGiaDaiLy] = useState<string>("");
    const [giaVon, setGiaVon] = useState<string>("");
    const [giaBan, setGiaBan] = useState<string>("");
    const [giaTTR, setGiaTTR] = useState<string>("");
    const [giaTH_TT, setGiaTH_TT] = useState<string>("");
    const [giaCDT, setGiaCDT] = useState<string>("");
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
        formik.resetForm();
        setContent("");
        setGiaCDT("");
        setGiaDaiLy("");
        setGiaTH_TT("");
        setGiaVon("");
        setGiaTTR("");
        setEntityError(null);
        setSelectedCirculars([]);
        setSelectedGrades([]);
        setSelectedSubjects([]);
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
                console.log("base 64", base64String);
                setFile(base64String);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        e.target.value = "";
    }
    const [openUnit, setOpenUnit] = useState(false);
    const [openProductType, setOpenProductType] = useState(false);
    const [openCircular, setOpenCircular] = useState(false);

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
                                <Grid item xs={6}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Mã sản phẩm <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="maSanPham"
                                                    name="maSanPham"
                                                    value={formik.values.maSanPham}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.maSanPham &&
                                                        Boolean(formik.errors.maSanPham)
                                                    }
                                                />
                                                {formik.touched.maSanPham &&
                                                    Boolean(formik.errors.maSanPham) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.maSanPham
                                                                ? formik.errors.maSanPham.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Đơn vị tính</span>
                                                    <span className="required_text">(*)</span>
                                                    <AddCircleIcon onClick={() => setOpenUnit(true)} sx={{ ml: 1, cursor: 'pointer' }} color="success" />
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="dvtid"
                                                        name="dvtid"
                                                        type="dvtid"
                                                        value={formik.values.dvtid}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.dvtid &&
                                                            Boolean(formik.errors.dvtid)
                                                        }
                                                    >
                                                        {dataUnits.map((item) => (
                                                            <MenuItem
                                                                key={item.dvtid}
                                                                value={item.dvtid}
                                                            >
                                                                {item.tenDVT}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.dvtid &&
                                                    Boolean(formik.errors.dvtid) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.dvtid
                                                                ? formik.errors.dvtid.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                            {openUnit === true && <UnitsDialog title="Thêm đơn vị tính" defaulValue={null} isInsert handleOpen={setOpenUnit} open={openUnit} />}
                                        </Grid>
                                    </Grid>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Tên sản phẩm <span className="required_text">(*)</span>
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            id="tenSanPham"
                                            name="tenSanPham"
                                            value={formik.values.tenSanPham}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.tenSanPham &&
                                                Boolean(formik.errors.tenSanPham)
                                            }
                                        />
                                        {formik.touched.tenSanPham &&
                                            Boolean(formik.errors.tenSanPham) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.tenSanPham
                                                        ? formik.errors.tenSanPham.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Thương hiệu
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            id="thuongHieu"
                                            name="thuongHieu"
                                            value={formik.values.thuongHieu}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.thuongHieu &&
                                                Boolean(formik.errors.thuongHieu)
                                            }
                                        />
                                        {formik.touched.thuongHieu &&
                                            Boolean(formik.errors.thuongHieu) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.thuongHieu
                                                        ? formik.errors.thuongHieu.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Model
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            id="model"
                                            name="model"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.model &&
                                                Boolean(formik.errors.model)
                                            }
                                        />
                                        {formik.touched.model &&
                                            Boolean(formik.errors.model) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.model
                                                        ? formik.errors.model.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                    {
                                        isShowFullTCKT === "true" && <>   <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                            <Grid item md={6}>
                                                <Box style={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                        HSX/NSX
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="hangSanXuat"
                                                        name="hangSanXuat"
                                                        value={formik.values.hangSanXuat}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.hangSanXuat &&
                                                            Boolean(formik.errors.hangSanXuat)
                                                        }
                                                    />
                                                    {formik.touched.hangSanXuat &&
                                                        Boolean(formik.errors.hangSanXuat) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.hangSanXuat
                                                                    ? formik.errors.hangSanXuat.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                            </Grid>
                                            <Grid item md={6}>
                                                <Box style={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                        Xuất xứ <span className="required_text">(*)</span>
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="xuatXu"
                                                        name="xuatXu"
                                                        value={formik.values.xuatXu}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.xuatXu &&
                                                            Boolean(formik.errors.xuatXu)
                                                        }
                                                    />
                                                    {formik.touched.xuatXu &&
                                                        Boolean(formik.errors.xuatXu) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.xuatXu
                                                                    ? formik.errors.xuatXu.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                            <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                                <Grid item md={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Nhà xuất bản
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="nhaXuatBan"
                                                            name="nhaXuatBan"
                                                            value={formik.values.nhaXuatBan}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.nhaXuatBan &&
                                                                Boolean(formik.errors.nhaXuatBan)
                                                            }
                                                        />
                                                        {formik.touched.nhaXuatBan &&
                                                            Boolean(formik.errors.nhaXuatBan) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.nhaXuatBan
                                                                        ? formik.errors.nhaXuatBan.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>

                                            </Grid>
                                        </>
                                    }
                                    <Grid item md={isShowFullTCKT === "false" ? 12 : 12}>
                                        <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Đối tượng sử dụng{" "}
                                                <span className="required_text">(*)</span>
                                            </Typography>
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="doiTuongSuDung"
                                                    name="doiTuongSuDung"
                                                    type="doiTuongSuDung"
                                                    value={formik.values.doiTuongSuDung}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.doiTuongSuDung &&
                                                        Boolean(formik.errors.doiTuongSuDung)
                                                    }
                                                >
                                                    {utilizedObjects.map((item) => (
                                                        <MenuItem
                                                            key={item.utilizedObjectId}
                                                            value={item.utilizedObjectName}
                                                        >
                                                            {item.utilizedObjectName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {formik.touched.doiTuongSuDung &&
                                                Boolean(formik.errors.doiTuongSuDung) && (
                                                    <FormHelperText className="required_text">
                                                        {" "}
                                                        {formik.errors.doiTuongSuDung
                                                            ? formik.errors.doiTuongSuDung.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Box>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Năm sản xuất{" "}
                                                    <span className="required_text">(*)</span>
                                                </Typography>
                                                {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
                                                <div className="date_picker">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            value={selectedDate}
                                                            onChange={handleDateChange}
                                                            format="YYYY"
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Loại sản phẩm</span>
                                                    <span className="required_text">(*)</span>
                                                    <AddCircleIcon onClick={() => setOpenProductType(true)} sx={{ ml: 1, cursor: 'pointer' }} color="success" />
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="loaiSanPhamID"
                                                        name="loaiSanPhamID"
                                                        type="loaiSanPhamID"
                                                        value={formik.values.loaiSanPhamID}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.loaiSanPhamID &&
                                                            Boolean(formik.errors.loaiSanPhamID)
                                                        }
                                                    >
                                                        {dataProductTypes.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                defaultValue={formik.values.loaiSanPhamID}
                                                                value={item.loaiSanPhamID}
                                                            >
                                                                {item.tenLoaiSanPham}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {formik.touched.loaiSanPhamID &&
                                                    Boolean(formik.errors.loaiSanPhamID) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.loaiSanPhamID
                                                                ? formik.errors.loaiSanPhamID.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                                {openProductType === true && <ProductTypesDialog title="Thêm loại sản phẩm" defaulValue={null} isInsert handleOpen={setOpenProductType} open={openProductType} />}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Khối lớp</span>
                                                    <span className="required_text">(*)</span>
                                                    <AddCircleIcon sx={{ ml: 1, cursor: 'pointer' }} color="success" />
                                                </Typography>
                                                <MultipleSelectCheckBoxGrade
                                                    touched={Boolean(formik.touched.khoiLop)}
                                                    error={Boolean(formik.errors.khoiLop)}
                                                    onHandleSelectedGrades={handleSelectedGrades}
                                                    grades={dataGrades}
                                                    selectedGrades={selectedGrades}
                                                />
                                                {formik.touched.khoiLop &&
                                                    Boolean(formik.errors.khoiLop) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.khoiLop
                                                                ? formik.errors.khoiLop.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                                    <span style={{ marginRight: '8px' }}>Môn học</span>
                                                    <span className="required_text">(*)</span>
                                                    <AddCircleIcon sx={{ ml: 1, cursor: 'pointer' }} color="success" />
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
                                    </Grid>
                                    <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                        <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                            <span style={{ marginRight: '8px' }}>Danh mục</span>
                                            <span className="required_text">(*)</span>
                                            <AddCircleIcon onClick={() => setOpenCircular(true)} sx={{ ml: 1, cursor: 'pointer' }} color="success" />
                                        </Typography>
                                        <MultipleSelectCheckBoxCircular
                                            touched={Boolean(formik.touched.thongTu)}
                                            error={Boolean(formik.errors.thongTu)}
                                            onHandleSelectedCirculars={handleSelectedCirculars}
                                            circulars={dataCirculars}
                                            selectedCirculars={selectedCirculars}
                                        />
                                        {formik.touched.thongTu &&
                                            Boolean(formik.errors.thongTu) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.thongTu
                                                        ? formik.errors.thongTu.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                    </Box>
                                    {openCircular === true && <CircularsDialog title="Thêm danh mục" defaulValue={null} isInsert handleOpen={setOpenCircular} open={openCircular} />}
                                    <Box
                                        style={{ width: "100%", height: "150px" }}
                                        sx={{ mb: 1.5 }}
                                    >
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Tiêu chuẩn kĩ thuật{" "}
                                            <span className="required_text">(*)</span>
                                        </Typography>
                                        {formik.touched.tieuChuanKyThuat &&
                                            Boolean(formik.errors.tieuChuanKyThuat) && (
                                                <FormHelperText className="required_text">
                                                    {" "}
                                                    {formik.errors.tieuChuanKyThuat
                                                        ? formik.errors.tieuChuanKyThuat.toString()
                                                        : ""}
                                                </FormHelperText>
                                            )}
                                        <QuillEditor
                                            value={content}
                                            onChange={handleEditorChange}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            style={{ height: "150px", width: "100%" }}
                                            className="w-full h-full mt-10 bg-white"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={1}></Grid>
                                <Grid item xs={5}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Giá bán <span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    style={{ width: "100%" }}
                                                    name="giaBan"
                                                    value={giaBan}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                        handleChangePrice(e, setGiaBan)
                                                    }
                                                    error={
                                                        formik.touched.giaBan &&
                                                        Boolean(formik.errors.giaBan)
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
                                                {formik.touched.giaBan &&
                                                    Boolean(formik.errors.giaBan) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.giaBan
                                                                ? formik.errors.giaBan.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={isShowFullTCKT === 'true' ? 6 : 12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Giá vốn <span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    style={{ width: "100%" }}
                                                    name="giaVon"
                                                    value={giaVon}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                        handleChangePrice(e, setGiaVon)
                                                    }
                                                    error={
                                                        formik.touched.giaVon &&
                                                        Boolean(formik.errors.giaVon)
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
                                                {formik.touched.giaVon &&
                                                    Boolean(formik.errors.giaVon) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.giaVon
                                                                ? formik.errors.giaVon.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                        {
                                            isShowFullTCKT === 'true' && <Grid item md={6}>
                                                <Box style={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                        Bảo hành <span className="required_text">(*)</span>
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="baoHanh"
                                                        name="baoHanh"
                                                        value={formik.values.baoHanh}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.baoHanh &&
                                                            Boolean(formik.errors.baoHanh)
                                                        }
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <p style={{ fontWeight: 900, color: "black" }}>
                                                                        tháng
                                                                    </p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {formik.touched.baoHanh &&
                                                        Boolean(formik.errors.baoHanh) && (
                                                            <FormHelperText className="required_text">
                                                                {" "}
                                                                {formik.errors.baoHanh
                                                                    ? formik.errors.baoHanh.toString()
                                                                    : ""}
                                                            </FormHelperText>
                                                        )}
                                                </Box>
                                            </Grid>
                                        }

                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Thuế <span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="thue"
                                                    name="thue"
                                                    value={formik.values.thue}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.thue && Boolean(formik.errors.thue)
                                                    }
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <p style={{ fontWeight: 900, color: "black" }}>
                                                                    %
                                                                </p>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {formik.touched.thue && Boolean(formik.errors.thue) && (
                                                    <FormHelperText className="required_text">
                                                        {" "}
                                                        {formik.errors.thue
                                                            ? formik.errors.thue.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Số lượng <span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="soLuong"
                                                    name="soLuong"
                                                    value={formik.values.soLuong}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.soLuong &&
                                                        Boolean(formik.errors.soLuong)
                                                    }
                                                />
                                                {formik.touched.soLuong &&
                                                    Boolean(formik.errors.soLuong) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.soLuong
                                                                ? formik.errors.soLuong.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>

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
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
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
                </DialogActions>
            </Dialog>
        </>
    );
}
