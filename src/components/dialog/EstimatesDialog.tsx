import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
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
import {
    ChangeEvent,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { ProductInEstimate, Products } from "@/interfaces/products";
import {
    addEstimate,
    addProduct,
    getGrade,
    getProduct,
    getProductByThongTuId,
    getSubject,
    getUnit,
    updateEtsmate,
} from "@/constant/api";
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
import SearchNoButtonSection from "../search/SearchNoButton";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { prices } from "@/interfaces/prices";
import TableProducts from "../table/table-products/TableProducts";
import TableFormListProductsInEstimates from "../table/table-estimate/TableFormListProductsInEstimates";
import { Units } from "@/interfaces/units";
import ProductsDialog from "./ProductsDialog";
import AddProductInEstimateDialog from "./AddProductInEstimateDialog";
import AddProductByCircularInEstimate from "./AddProductByCircularInEstimateDialog";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
    ADD_MULTIPLE_PRODUCTINESTIMATES,
    ADD_PRODUCTINESTIMATES,
    GET_ALL_PRODUCTSINESTIMATES,
} from "@/store/productInEstimate/action";
import {
    ADD_PRODUCTINSHAREDEQUIPMENTS,
    GET_ALL_PRODUCTINSHAREDEQUIPMENTS,
} from "@/store/productInSharedEquipment/action";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const validationEstimateSchema = yup.object({
    tenDuToan: yup.string().required("Vui lòng nhập tên dự toán"),
    sanPham: yup.array().min(1, "Vui lòng nhập sản phẩm"),
});
export default function EstimatesDialog(props: PropsDialog) {
    const {
        title,
        defaulValue,
        isInsert,
        handleOpen,
        open,
        isUpdate,
        fetchData,
    } = props;
    const dispatch = useAppDispatch();
    const [productList, setProductList] = useState<Products[]>([]);
    const [productByShareEquipment, setProductByShareEquipment] = useState<
        Products[]
    >([]);
    const { dataGrades } = useGrades();
    const [unitList, setUnitList] = useState<Units[]>([]);
    const [gradeList, setGradeList] = useState<Grades[]>([]);
    const [subjectList, setSubjectList] = useState<Subjects[]>([]);
    const [thongTu, setThongTu] = useState<number>(1);
    const [price, setPrice] = useState<string>();
    const [tenDuToan, setTenDuToan] = useState<string>();
    const [isShowFullTCKT, setShowFullTCKT] = useState<string>();
    const [isShowEstimateForm, setShowEstimateForm] = useState<boolean>(true);
    const { dataCirculars } = useCirculars();
    const { dataProducts } = useProducts();
    const [loading, setLoading] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openAddProductByCircular, setOpenAddProductByCircular] =
        useState(false);
    const [entityError, setEntityError] = useState(null);
    const [errorForm, setErrorForm] = useState<string>();
    const productInEstimateRedux = useAppSelector((state) =>
        state.productInEstimates.slice()
    );
    const [selectedCirculars, setSelectedCirculars] = useState<Circulars[]>([]);
    const [selectedGrades, setSelectedGrades] = useState<Grades[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<Subjects[]>([]);

    const [checked, setChecked] = useState<Grades[]>([]);
    const handleCheck = (data: Grades) => {
        const isChecked = checked.some(
            (product) => product.khoiLopID === data.khoiLopID
        ); // Kiểm tra xem sản phẩm có tồn tại trong mảng checked không
        if (isChecked) {
            setChecked((prev) =>
                prev.filter((product) => product.khoiLopID !== data.khoiLopID)
            ); // Loại bỏ sản phẩm khỏi mảng checked nếu đã được chọn
        } else {
            setChecked((prev) => [...prev, data]);
        }
    };
    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik

        if (defaulValue) {
            let data = JSON.parse(defaulValue.sanPhamDuToan);
            let sanPhamTrongDuToan: ProductInEstimate[] = [
                ...data.sanPhamTrongDuToan,
            ];
            let thietBiDungChung: Products[] = [...data.thietBiDungChung];
            dispatch(
                GET_ALL_PRODUCTSINESTIMATES({ productInEstimates: sanPhamTrongDuToan })
            );
            dispatch(
                GET_ALL_PRODUCTINSHAREDEQUIPMENTS({
                    productInSharedEquipments: thietBiDungChung,
                })
            );
            setShowFullTCKT(data.isShowFullTCKT as string);
            setPrice(defaulValue.loaiGia);
        }
    }, [defaulValue]);
    const productInSharedEquipmentRedux = useAppSelector((state) =>
        state.productInSharedEquipments.slice()
    );
    const total = useMemo(() => {
        let total = 0;
        if (productInSharedEquipmentRedux.length > 0) {
            productInSharedEquipmentRedux.forEach((product) => {
                total += (product.giaBan ?? 0) * product.soLuong;
            });
        }

        if (productInEstimateRedux.length > 0) {
            productInEstimateRedux.forEach((productInEstimate) => {
                productInEstimate.sanPham.forEach((product) => {
                    total += (product.giaBan ?? 0) * product.soLuong;
                });
            });
        }

        return total;
    }, [productInSharedEquipmentRedux, productInEstimateRedux]);
    const capitalPrice = useMemo(() => {
        let total = 0;
        if (productInSharedEquipmentRedux.length > 0) {
            productInSharedEquipmentRedux.forEach((product) => {
                total += (product.giaVon ?? 0) * product.soLuong;
            });
        }

        if (productInEstimateRedux.length > 0) {
            productInEstimateRedux.forEach((productInEstimate) => {
                productInEstimate.sanPham.forEach((product) => {
                    total += (product.giaVon ?? 0) * product.soLuong;
                });
            });
        }
        return total;
    }, [productInSharedEquipmentRedux, productInEstimateRedux]);
    const handleSetForms = (e: any, setter: Function) => {
        setter(e.target.value);
        setErrorForm("");
    };
    const handleReSetForms = () => {
        setShowEstimateForm(true);
        setProductList([]);
    };
    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            setEntityError(null);
        }
    };
    const onHandleCreateForm = async () => {
        if (!tenDuToan || !selectedCirculars || !selectedGrades || !price || !isShowFullTCKT) {
            setErrorForm("Các trường không được để trống");
            return;
        }
        const accessToken = window.localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };
        const newDataProducts = dataProducts.filter(item =>
            item.thongTu.some(circular =>
                selectedCirculars.some(selected => selected.thongTuID === circular.thongTuID)
            )
        );
        const responseUnits = await axios.get(getUnit, {
            headers,
        });
        // const responseGrades = await axios.get(getGrade, {
        //     headers,
        // });
        const responseSubjects = await axios.get(getSubject, {
            headers,
        });
        setUnitList(responseUnits.data);
        // setGradeList(responseGrades.data);
        setSubjectList(responseSubjects.data);
        let modifiedProductList: Products[] = newDataProducts;
        modifiedProductList = modifiedProductList.map((item: Products) => {
            let giaBan: number = item.giaDaiLy; // Default giaBan to giaDaiLy
            if (price === "giaTH_TT") {
                giaBan = item.giaTH_TT; // giaBan is an empty string for giaTH-TT
            } else if (price === "giaCDT") {
                giaBan = item.giaCDT; // giaBan is giaCDT
            } else if (price === "giaTTR") {
                giaBan = item.giaTTR; // giaBan is giaCDT
            }
            let string = "";
            if (isShowFullTCKT === "false") {
                if (item.xuatXu) {
                    string = string + "<p>Xuất xứ: " + item.xuatXu + '</p>';
                }
                if (item.baoHanh) {
                    string = string + "<p>Bảo hành: " + item.baoHanh + ' tháng</p>';
                }
                if (item.hangSanXuat) {
                    string = string + "<p>Hãng sản xuất: " + item.hangSanXuat + '</p>';
                } if (item.nhaXuatBan) {
                    string = string + "<p>Nhà xuất bản: " + item.nhaXuatBan + '</p>';
                }
            }
            return {
                ...item,
                giaBan: giaBan,
                hinhAnh: null,
                tieuChuanKyThuat:
                    item.tieuChuanKyThuat + string,
            };
        });
        let filteredProducts = modifiedProductList.filter(
            (product) => product.loaiSanPham?.loaiSanPhamID === 6
        );
        const combinedArray: ProductInEstimate[] = [];
        // let filterGrades: Grades[] = responseGrades.data;
        // if (thongTu === 1) {
        //     filterGrades = filterGrades.filter((grade) =>
        //         [1, 2, 3, 4, 5].includes(grade.khoiLopID)
        //     );
        // } else if (thongTu === 3) {
        //     filterGrades = filterGrades.filter((grade) =>
        //         [6, 7, 8, 9].includes(grade.khoiLopID)
        //     );
        // } else if (thongTu === 4) {
        //     filterGrades = filterGrades.filter((grade) =>
        //         [10, 11, 12].includes(grade.khoiLopID)
        //     );
        // }
        selectedGrades.forEach((grade: Grades, index: number) => {
            if (grade.khoiLopID === 1 || grade.khoiLopID === 2 || grade.khoiLopID === 3 || grade.khoiLopID === 4 || grade.khoiLopID === 5) {
                let findCircular = dataCirculars.find((item) => item.thongTuID === 1);
                findCircular?.lstMonHoc?.forEach(
                    (subject: Subjects, indexSubject: number) => {
                        const productList: Products[] = modifiedProductList.filter((x: any) =>
                            x.monHoc.some(
                                (y: any) =>
                                    y.monHocID === subject.monHocID &&
                                    x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
                            )
                        );
                        combinedArray.push({
                            khoiLopID: grade.khoiLopID,
                            tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
                            monHocID: subject.monHocID,
                            tenMonHoc: subject.tenMonHoc,
                            sanPham: productList,
                        });
                    }
                );
            } else if (grade.khoiLopID === 6 || grade.khoiLopID === 7 || grade.khoiLopID === 8 || grade.khoiLopID === 9) {
                let findCircular = dataCirculars.find((item) => item.thongTuID === 3);
                findCircular?.lstMonHoc?.forEach(
                    (subject: Subjects, indexSubject: number) => {
                        const productList: Products[] = modifiedProductList.filter((x: any) =>
                            x.monHoc.some(
                                (y: any) =>
                                    y.monHocID === subject.monHocID &&
                                    x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
                            )
                        );
                        combinedArray.push({
                            khoiLopID: grade.khoiLopID,
                            tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
                            monHocID: subject.monHocID,
                            tenMonHoc: subject.tenMonHoc,
                            sanPham: productList,
                        });
                    }
                );
            } else if (grade.khoiLopID === 10 || grade.khoiLopID === 11 || grade.khoiLopID === 12) {
                let findCircular = dataCirculars.find((item) => item.thongTuID === 4);
                findCircular?.lstMonHoc?.forEach(
                    (subject: Subjects, indexSubject: number) => {
                        const productList: Products[] = modifiedProductList.filter((x: any) =>
                            x.monHoc.some(
                                (y: any) =>
                                    y.monHocID === subject.monHocID &&
                                    x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
                            )
                        );
                        combinedArray.push({
                            khoiLopID: grade.khoiLopID,
                            tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
                            monHocID: subject.monHocID,
                            tenMonHoc: subject.tenMonHoc,
                            sanPham: productList,
                        });
                    }
                );
            }
        });
        dispatch(
            GET_ALL_PRODUCTSINESTIMATES({ productInEstimates: combinedArray })
        );
        dispatch(
            GET_ALL_PRODUCTINSHAREDEQUIPMENTS({
                productInSharedEquipments: filteredProducts,
            })
        );
        setProductByShareEquipment(filteredProducts);
        setProductList(modifiedProductList);
        setShowEstimateForm(false);
    };
    const handleAddProductInEstimate = async (item: Products): Promise<any> => {
        let string = "";
        if (isShowFullTCKT === "false") {
            if (item.xuatXu) {
                string = string + "<p>Xuất xứ: " + item.xuatXu + '</p>';
            }
            if (item.baoHanh) {
                string = string + "<p>Bảo hành: " + item.baoHanh + ' tháng</p>';
            }
            if (item.hangSanXuat) {
                string = string + "<p>Hãng sản xuất: " + item.hangSanXuat + '</p>';
            } if (item.nhaXuatBan) {
                string = string + "<p>Nhà xuất bản: " + item.nhaXuatBan + '</p>';
            }
        }
        let newItem = {
            ...item,
            hinhAnh: null,
            tieuChuanKyThuat:
                item.tieuChuanKyThuat + string,
        };
        let checkExsistsProducts = false;
        productInEstimateRedux.forEach((element) => {
            element.sanPham.forEach((product) => {
                if (newItem.maSanPham === product.maSanPham) {
                    checkExsistsProducts = true;
                }
            });
        });
        if (checkExsistsProducts) {
            return false;
        } else {
            dispatch(ADD_PRODUCTINESTIMATES({ product: newItem }));

            if (item.loaiSanPham?.loaiSanPhamID === 6 || item.loaiSanPhamID === 6) {
                dispatch(ADD_PRODUCTINSHAREDEQUIPMENTS({ product: newItem }));
            }
            setShowEstimateForm(false);
            return true;
        }
    };

    const handleAddProductByCircularInEstimate = async (
        items: Products[]
    ): Promise<any> => {
        items = items.map((item: Products) => {
            let findProduct: Products | null = null; // Khởi tạo biến findProduct với giá trị null
            productInEstimateRedux.forEach((productInEstimate) => {
                productInEstimate.sanPham.forEach((product) => {
                    if (item.maSanPham === product.maSanPham) {
                        findProduct = {
                            ...product,
                            soLuong: 1,
                        };
                    }
                });
            });
            if (findProduct) {
                return findProduct;
            } else {
                let giaBan: number = item.giaDaiLy; // Default giaBan to giaDaiLy
                if (price === "giaTH_TT") {
                    giaBan = item.giaTH_TT; // giaBan is an empty string for giaTH-TT
                } else if (price === "giaCDT") {
                    giaBan = item.giaCDT; // giaBan is giaCDT
                } else if (price === "giaTTR") {
                    giaBan = item.giaTTR; // giaBan is giaCDT
                }
                let string = "";
                if (isShowFullTCKT === "false") {
                    if (item.xuatXu) {
                        string = string + "<p>Xuất xứ: " + item.xuatXu + '</p>';
                    }
                    if (item.baoHanh) {
                        string = string + "<p>Bảo hành: " + item.baoHanh + ' tháng</p>';
                    }
                    if (item.hangSanXuat) {
                        string = string + "<p>Hãng sản xuất: " + item.hangSanXuat + '</p>';
                    } if (item.nhaXuatBan) {
                        string = string + "<p>Nhà xuất bản: " + item.nhaXuatBan + '</p>';
                    }
                }
                return {
                    ...item,
                    hinhAnh: null,
                    giaBan: giaBan,
                    tieuChuanKyThuat:
                        item.tieuChuanKyThuat + string,
                };
            }
        });
        dispatch(ADD_MULTIPLE_PRODUCTINESTIMATES({ products: items }));
        items.forEach((item) => {
            if (item.loaiSanPham?.loaiSanPhamID === 6 || item.loaiSanPhamID === 6) {
                dispatch(ADD_PRODUCTINSHAREDEQUIPMENTS({ product: item }));
            }
        });
        setShowEstimateForm(false);
        return true;
    };
    const handleSaveChangeProductInEstimate = async () => {
        let data = {
            tenDuToan: tenDuToan,
            sanPhamTrongDuToan: productInEstimateRedux,
            thietBiDungChung: productInSharedEquipmentRedux,
            total: total,
            isShowFullTCKT: isShowFullTCKT,
        };
        let requestData = {};
        if (isInsert) {
            requestData = requestData = {
                tenDuToan: tenDuToan,
                ghiChu: "",
                tongGiaBan: total,
                tongGiaVon: capitalPrice,
                loaiGia: price,
                sanPhamDuToan: JSON.stringify(data),
            };
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.post(addEstimate, requestData, { headers });
            if (response.status === 200) {
                toast.success("Thêm dự toán thành công");
                dispatch(GET_ALL_PRODUCTSINESTIMATES({ productInEstimates: [] }));
                dispatch(
                    GET_ALL_PRODUCTINSHAREDEQUIPMENTS({ productInSharedEquipments: [] })
                );
                handleOpen(false);
                if (fetchData) {
                    fetchData();
                }
            }
            setShowEstimateForm(true);
            setPrice(undefined);
            setTenDuToan(undefined);
            setShowFullTCKT(undefined);
            setThongTu(1);
        } else {
            requestData = requestData = {
                tenDuToan: defaulValue?.tenDuToan,
                duToanID: defaulValue.duToanID,
                ghiChu: "",
                tongGiaBan: total,
                tongGiaVon: capitalPrice,
                loaiGia: price,
                sanPhamDuToan: JSON.stringify(data),
            };
            const accessToken = window.localStorage.getItem("accessToken");
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            };
            const response = await axios.put(updateEtsmate, requestData, { headers });
            if (response.status === 200) {
                toast.success("Cập nhật dự toán thành công");
                dispatch(GET_ALL_PRODUCTSINESTIMATES({ productInEstimates: [] }));
                dispatch(
                    GET_ALL_PRODUCTINSHAREDEQUIPMENTS({ productInSharedEquipments: [] })
                );
                if (fetchData) {
                    fetchData();
                }
            }
        }

        // let dataString = JSON.stringify(data);
        // let parsedData = JSON.parse(dataString);
    };
    const handleSelectedGrades = (data: Grades[]) => {
        setSelectedGrades(data);
    };
    const handleSelectedCirculars = (data: Circulars[]) => {
        setSelectedCirculars(data);
    };
    return (
        <>
            <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={open}

            // onClose={() => handleOpen(false)}
            >
                <DialogTitle
                    sx={{ m: 0, p: 3, bgcolor: "primary.main" }}
                    id="customized-dialog-title"
                    color="white"
                >
                    <Typography variant="h3">
                        {title} {defaulValue ? <>{": " + defaulValue.tenDuToan}</> : <></>}
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
                    <CloseIcon sx={{ color: "white.main" }} />
                </IconButton>
                <DialogContent sx={{ p: 3 }}>
                    <Grid container justifyContent="center">
                        {isShowEstimateForm === true && isInsert ? (
                            <>
                                <Grid item md={11} xs={11}>
                                    <form>
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
                                                            {" "}
                                                            {JSON.stringify(entityError)}{" "}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            )}

                                            <Grid
                                                container
                                                flexGrow={1}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item md={6} xs={12} sm={12}>
                                                    {errorForm && (
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <Typography
                                                                    sx={{ mb: 1.5, fontWeight: "bold" }}
                                                                    className="required_text"
                                                                >
                                                                    {" "}
                                                                    {JSON.stringify(errorForm)}{" "}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                        Thiết lập tạo dự toán:
                                                    </Typography>
                                                    <Grid item md={6} xs={12} sm={12}>
                                                        <Box style={{ width: "100%" }}>
                                                            <Typography
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    mb: 1.5,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <span style={{ marginRight: "8px" }}>
                                                                    Thông tư
                                                                </span>
                                                                <span className="required_text">(*)</span>
                                                            </Typography>
                                                            <MultipleSelectCheckBoxCircular
                                                                onHandleSelectedCirculars={
                                                                    handleSelectedCirculars
                                                                }
                                                                circulars={dataCirculars}
                                                                selectedCirculars={selectedCirculars}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item md={6} xs={12} sm={12}>
                                                        <Box style={{ width: "100%" }}>
                                                            <Typography
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    mb: 1.5,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <span style={{ marginRight: "8px" }}>
                                                                    Lớp
                                                                </span>
                                                                <span className="required_text">(*)</span>
                                                            </Typography>
                                                            <MultipleSelectCheckBoxGrade
                                                                onHandleSelectedGrades={
                                                                    handleSelectedGrades
                                                                }
                                                                grades={dataGrades}
                                                                selectedGrades={selectedGrades}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    {/* <Grid item md={6} xs={12} sm={12}>
                                                        <Box style={{ width: "100%" }}>
                                                            <Typography
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    mb: 1.5,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <span style={{ marginRight: "8px" }}>
                                                                    Môn học
                                                                </span>
                                                                <span className="required_text">(*)</span>
                                                            </Typography>
                                                            <MultipleSelectCheckBoxSubject
                                                                onHandleSelectedSubjects={
                                                                    handleSelectedGrades
                                                                }
                                                                grades={dataSub}
                                                                selectedGrades={selectedGrades}
                                                            />
                                                        </Box>
                                                    </Grid> */}
                                                    {/* <Grid item md={6} xs={12} sm={12}>
                                                        <Grid container>
                                                            <Grid item md={4}>
                                                                <FormGroup>
                                                                    {dataGrades.slice(0, 6).map((item, index) => (
                                                                        <>
                                                                            <FormControlLabel control={<Checkbox onChange={() => handleCheck(item)}
                                                                                key={index}
                                                                                checked={checked.some(
                                                                                    (product) =>
                                                                                        product.khoiLopID === item.khoiLopID
                                                                                )} />} label={item.tenKhoiLop} />
                                                                        </>
                                                                    ))}
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <FormGroup>
                                                                    {dataGrades.slice(6, 12).map((item, index) => (
                                                                        <>
                                                                            <FormControlLabel control={<Checkbox onChange={() => handleCheck(item)}
                                                                                key={index}
                                                                                checked={checked.some(
                                                                                    (product) =>
                                                                                        product.khoiLopID === item.khoiLopID
                                                                                )} />} label={item.tenKhoiLop} />

                                                                        </>
                                                                    ))}
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <FormGroup>
                                                                    <FormControlLabel control={<Checkbox onChange={() => handleCheck(item)}
                                                                        key={index}
                                                                        checked={checked.some(
                                                                            (product) =>
                                                                                product.khoiLopID === item.khoiLopID
                                                                        )} />} label={item.tenKhoiLop} />

                                                                </FormGroup>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> */}
                                                    <Grid
                                                        item
                                                        md={6}
                                                        xs={12}
                                                        sm={12}
                                                        sx={{ mt: 1.5, fontWeight: "bold" }}
                                                    >
                                                        {" "}
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Chọn loại giá nhập{" "}
                                                            <span className="required_text">(*)</span>
                                                        </Typography>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="price"
                                                                name="price"
                                                                type="price"
                                                                value={price}
                                                                onChange={(e) => handleSetForms(e, setPrice)}
                                                            >
                                                                {prices.map((item, index) => (
                                                                    <MenuItem key={index} value={item.priceCode}>
                                                                        {item.priceName}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={6}
                                                        xs={12}
                                                        sm={12}
                                                        sx={{ mt: 1.5, fontWeight: "bold" }}
                                                    >
                                                        {" "}
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Kiểu tiêu chuẩn kỹ thuật{" "}
                                                            <span className="required_text">(*)</span>
                                                        </Typography>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="isShowFullTCKT"
                                                                name="isShowFullTCKT"
                                                                type="isShowFullTCKT"
                                                                value={isShowFullTCKT}
                                                                onChange={(e) =>
                                                                    handleSetForms(e, setShowFullTCKT)
                                                                }
                                                            >
                                                                <MenuItem value="true">
                                                                    Hiển thị toàn bộ
                                                                </MenuItem>
                                                                <MenuItem value="false">Hiển thị gộp</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={6} xs={12} sm={12}>
                                                        {" "}
                                                        <Typography
                                                            sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}
                                                        >
                                                            Tên dự toán{" "}
                                                            <span className="required_text">(*)</span>
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="tenDuToan"
                                                            name="tenDuToan"
                                                            value={tenDuToan}
                                                            onChange={(e) => handleSetForms(e, setTenDuToan)}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={6}
                                                        xs={12}
                                                        sm={12}
                                                        sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={(e) => onHandleCreateForm()}
                                                        >
                                                            Tạo
                                                        </Button>
                                                        <Button
                                                            sx={{ ml: 2, fontWeight: "bold" }}
                                                            variant="contained"
                                                            color="success"
                                                            onClick={(e) => setShowEstimateForm(false)}
                                                        >
                                                            Ẩn
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </form>
                                </Grid>
                            </>
                        ) : (
                            isInsert && (
                                <>
                                    <Grid item md={11} xs={11} sx={{ mb: 2, mt: 2 }}>
                                        {" "}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleReSetForms()}
                                        >
                                            Tạo lại
                                        </Button>
                                    </Grid>
                                </>
                            )
                        )}
                        <Grid item md={11} xs={11}>
                            {productInEstimateRedux && productInEstimateRedux.length > 0 && (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            p: 1,
                                            m: 1,
                                            bgcolor: "background.paper",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: "bold", mb: 2 }} variant="h4">
                                            Danh sách sản phẩm
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                                            onClick={() => setOpenAdd(true)}
                                        >
                                            Thêm mới sản phẩm
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                                            onClick={() => setOpenAddProductByCircular(true)}
                                        >
                                            Thêm mới từ danh mục
                                        </Button>
                                        <Typography
                                            sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                                            variant="h4"
                                        >
                                            Giá vốn:{" "}
                                            <span className="required_text">
                                                {capitalPrice.toLocaleString()} đ
                                            </span>
                                        </Typography>
                                        <Typography
                                            sx={{ fontWeight: "bold", mb: 2, ml: 5 }}
                                            variant="h4"
                                        >
                                            Tổng tiền:{" "}
                                            <span className="required_text">
                                                {total.toLocaleString()} đ
                                            </span>
                                        </Typography>
                                    </Box>
                                    <Card variant="outlined">
                                        <TableFormListProductsInEstimates
                                            isShowFullTCKT={isShowFullTCKT ?? "true"}
                                            price={price ?? ""}
                                            isListProductsInEstimates={false}
                                            rows={productList}
                                            isAdmin={true}
                                            filteredProductsBySharedEquipment={
                                                productByShareEquipment
                                            }
                                            unitList={unitList}
                                        />
                                    </Card>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    {openAdd && openAdd === true && (
                        <AddProductInEstimateDialog
                            title="Thêm sản phẩm vào dự toán"
                            defaulValue={null}
                            isShowFullTCKT={isShowFullTCKT ?? "false"}
                            isAddProductInEstimate
                            handleOpen={setOpenAdd}
                            onHandleAddProductInEstimate={handleAddProductInEstimate}
                            open={openAdd}
                        />
                    )}
                    {openAddProductByCircular === true && (
                        <AddProductByCircularInEstimate
                            title="Thêm sản phẩm từ danh mục"
                            defaulValue={null}
                            isAddProductInEstimate
                            handleOpen={setOpenAddProductByCircular}
                            onHandleAddProductByCircularInEstimate={
                                handleAddProductByCircularInEstimate
                            }
                            open={openAddProductByCircular}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        type="submit"
                        loading={loading}
                        variant="contained"
                        size="large"
                        onClick={() => handleSaveChangeProductInEstimate()}
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog >
        </>
    );
}
