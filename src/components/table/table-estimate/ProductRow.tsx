import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    TooltipProps,
    tooltipClasses,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import SnackbarAlert from "../../alert";
import StyledIconButton from "@/components/styled-button/StyledIconButton";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ProductInEstimate, Products } from "@/interfaces/products";
import { Grades } from "@/interfaces/grades";
import { Subjects } from "@/interfaces/subjects";
import axios from "axios";
import { getGrade, getSubject } from "@/constant/api";
import ProductInEstimateDetailDialog from "@/components/dialog/ProductInEstimateDetailDialog";
import { utilizedObjects } from "@/interfaces/utilizedObject";
import { Units } from "@/interfaces/units";
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.2)", // Thêm viền đen
        fontSize: 13,
        maxWidth: 500, // Thiết lập chiều rộng tối đa là 300px
    },
}));
interface Props {
    product: Products;
    unitList: Units[];
    index: number;
    khoiLopID: number;
    monHocID: number;
    isShowFullTCKT: string;
    onHandleChangeItem: (
        item: Products,
        khoiLopID: number,
        monHocID: number
    ) => void;
    onHandleDeleteItem: (
        item: Products,
        khoiLopID: number,
        monHocID: number
    ) => void;
    onHandleChangeItemQuantity: (
        item: Products,
        khoiLopID: number,
        monHocID: number
    ) => void;
}
interface ShowInputProduct {
    tenSanPham: boolean;
    model: boolean;
    hangSanXuat: boolean;
    nhaXuatBan: boolean;
    doiTuongSuDung: boolean;
    giaBan: boolean;
    thue: boolean;
    baoHanh: boolean;
    soLuong: boolean;
    tieuChuanKyThuat: boolean;
}
interface ProductModifiedEstimate {
    tenSanPham: string;
    model: string;
    hangSanXuat: string | null;
    nhaXuatBan: string | null;
    doiTuongSuDung: string | null;
    giaBan?: number;
    thue: number;
    baoHanh: number;
    soLuong: number;
    tieuChuanKyThuat: string;
}
import dynamic from "next/dynamic";
import AlertConfirmDialog from "@/components/alert/confirmAlertDialog";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const ProductRow = ({
    product,
    index,
    isShowFullTCKT,
    onHandleChangeItem,
    onHandleChangeItemQuantity,
    onHandleDeleteItem,
    unitList,
    khoiLopID,
    monHocID,
}: Props) => {
    const [modifiedProduct, setModifiedProduct] =
        React.useState<ProductModifiedEstimate>({
            tenSanPham: "",
            model: "",
            hangSanXuat: "",
            nhaXuatBan: "",
            doiTuongSuDung: "",
            giaBan: 0,
            thue: 0,
            baoHanh: 0,
            soLuong: 0,
            tieuChuanKyThuat: "",
        });
    const [dvtid, setdvtid] = React.useState<string>();
    const [giaBan, setGiaBan] = React.useState<string>("");
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

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

    const formatPrice = (value: string | null | undefined): string => {
        return (value ?? "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    React.useEffect(() => {
        setModifiedProduct(product);
        setdvtid(product.donViTinh?.dvtid?.toString());
        setTieuChuanKyThuatContent(product.tieuChuanKyThuat);
        setGiaBan(formatPrice(product.giaBan?.toString()));
    }, [product]);
    const [isEditingUnit, setIsEditingUnit] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<ShowInputProduct>({
        tenSanPham: false,
        model: false,
        hangSanXuat: false,
        nhaXuatBan: false,
        doiTuongSuDung: false,
        giaBan: false,
        soLuong: false,
        thue: false,
        baoHanh: false,
        tieuChuanKyThuat: false,
    });

    const handleDoubleClick = (name: string) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [name]: true,
        }));
    };
    const handleDoubleClickUnit = () => {
        setIsEditingUnit(true);
    };
    const handleBlurUnit = () => {
        setIsEditingUnit(false);
        let data: Products = {
            ...product,
            donViTinh: unitList.find((x) => x.dvtid == dvtid),
        };
        onHandleChangeItem(data, khoiLopID, monHocID);
    };
    const handleBlur = (name: string) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [name]: false,
        }));
        let data: Products = {
            ...product,
            tenSanPham: modifiedProduct.tenSanPham ?? product.tenSanPham,
            model: modifiedProduct.model ?? product.model,
            hangSanXuat: modifiedProduct.hangSanXuat ?? product.hangSanXuat,
            nhaXuatBan: modifiedProduct.nhaXuatBan ?? product.nhaXuatBan,
            doiTuongSuDung: modifiedProduct.doiTuongSuDung ?? product.doiTuongSuDung,
            giaBan: modifiedProduct.giaBan ?? product.giaBan,
            baoHanh: modifiedProduct.baoHanh ?? product.giaBan,
            thue: modifiedProduct.thue ?? product.giaBan,
            soLuong: product.soLuong,
            tieuChuanKyThuat: tieuChuanKyThuatContent ?? product.tieuChuanKyThuat,
        };
        onHandleChangeItem(data, khoiLopID, monHocID);
    };
    const handleBlurQuantity = (name: string) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [name]: false,
        }));
        let data: Products = {
            ...product,
            tenSanPham: modifiedProduct.tenSanPham ?? product.tenSanPham,
            model: modifiedProduct.model ?? product.model,
            hangSanXuat: modifiedProduct.hangSanXuat ?? product.hangSanXuat,
            nhaXuatBan: modifiedProduct.nhaXuatBan ?? product.nhaXuatBan,
            doiTuongSuDung: modifiedProduct.doiTuongSuDung ?? product.doiTuongSuDung,
            giaBan: modifiedProduct.giaBan ?? product.giaBan,
            baoHanh: modifiedProduct.baoHanh ?? product.giaBan,
            thue: modifiedProduct.thue ?? product.giaBan,
            soLuong: modifiedProduct.soLuong ?? product.soLuong,
            tieuChuanKyThuat: tieuChuanKyThuatContent ?? product.tieuChuanKyThuat,
        };
        onHandleChangeItemQuantity(data, khoiLopID, monHocID);
    };
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        let checkChange = true;
        if (
            name === "baoHanh" ||
            name === "soLuong" ||
            name === "thue" ||
            name === "giaBan"
        ) {
            let inputValue: string = event.target.value;
            inputValue = inputValue.replace(/,/g, "");
            if (isNaN(Number(inputValue))) {
                checkChange = false;
            } else {
                if (name === "giaBan") {
                    const formattedValue: string = formatPrice(inputValue);
                    const numericValue = parseFloat(formattedValue.replace(/,/g, ""));
                    setGiaBan(formattedValue);
                    setModifiedProduct((prevState) => ({
                        ...prevState,
                        [name]: numericValue, // Set giaBan to numeric value
                    }));
                }
            }
        }
        if (checkChange === false) return;
        if (name !== "giaBan") {
            setModifiedProduct((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    const handleChangeDTSD = (event: SelectChangeEvent<string | null>) => {
        const value = event.target.value || ""; // Ensure value is always treated as string, even if it's null
        setModifiedProduct((prevState) => ({
            ...prevState,
            doiTuongSuDung: value,
        }));
    };
    const handleChangeUnit = (event: SelectChangeEvent<string | null>) => {
        const value = event.target.value || ""; // Ensure value is always treated as string, even if it's null
        setModifiedProduct((prevState) => ({
            ...prevState,
            donViTinh: unitList.find((x) => x.dvtid === parseInt(value)),
        }));
        setdvtid(value);
    };
    const handleDeleteItem = () => {
        setOpenConfirmDialog(true);
    };
    const handleConfirmDeleteItem = () => {
        setOpenConfirmDialog(true);
        let data: Products = {
            ...product,
            tenSanPham: modifiedProduct.tenSanPham ?? product.tenSanPham,
            model: modifiedProduct.model ?? product.model,
            hangSanXuat: modifiedProduct.hangSanXuat ?? product.hangSanXuat,
            nhaXuatBan: modifiedProduct.nhaXuatBan ?? product.nhaXuatBan,
            doiTuongSuDung: modifiedProduct.doiTuongSuDung ?? product.doiTuongSuDung,
            giaBan: modifiedProduct.giaBan ?? product.giaBan,
            baoHanh: modifiedProduct.baoHanh ?? product.giaBan,
            thue: modifiedProduct.thue ?? product.giaBan,
            soLuong: modifiedProduct.soLuong ?? product.soLuong,
            tieuChuanKyThuat: tieuChuanKyThuatContent ?? product.tieuChuanKyThuat,
        };
        onHandleDeleteItem(data, khoiLopID, monHocID);
    };
    const [tieuChuanKyThuatContent, setTieuChuanKyThuatContent] =
        React.useState<string>(product.tieuChuanKyThuat);
    const handleEditorChange = (newContent: string) => {
        setTieuChuanKyThuatContent(newContent);
    };
    return (
        <StyledTableRow
            hover
            role="checkbox"
            tabIndex={-1}
            sx={{ cursor: "pointer" }}
        >
            <StyledTableCell padding="normal">{index + 1}</StyledTableCell>
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("maSanPham")}
            >
                <LightTooltip
                    title={product.maSanPham ? product.maSanPham : "Chưa có dữ liệu"}
                >
                    {product.isChange === true ? (
                        <>
                            <span className="is_change_product">
                                {product.maSanPham ? `${product.maSanPham}` : "Chưa có dữ liệu"}
                            </span>
                        </>
                    ) : (
                        <>
                            {" "}
                            <span>
                                {product.maSanPham ? `${product.maSanPham}` : "Chưa có dữ liệu"}
                            </span>
                        </>
                    )}
                </LightTooltip>
            </StyledTableCell>
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("tenSanPham")}
            >
                {isEditing.tenSanPham === true ? (
                    <TextareaAutosize
                        name="tenSanPham"
                        value={modifiedProduct?.tenSanPham}
                        onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>} // Specify the correct type
                        onBlur={() => handleBlur("tenSanPham")}
                        autoFocus // Focus on input field when in edit mode
                    />
                ) : (
                    <LightTooltip
                        title={product.tenSanPham ? product.tenSanPham : "Chưa có dữ liệu"}
                    >
                        <span>
                            {" "}
                            {product.tenSanPham
                                ? product.tenSanPham.length > 15
                                    ? `${product.tenSanPham.substring(0, 15)}...`
                                    : product.tenSanPham
                                : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
            </StyledTableCell>
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("tieuChuanKyThuat")}
            >
                {isEditing.tieuChuanKyThuat === true ? (
                    <QuillEditor
                        value={tieuChuanKyThuatContent}
                        onChange={handleEditorChange}
                        onBlur={() => handleBlur("tieuChuanKyThuat")}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: "100%", width: "100%" }}
                        className="w-full h-full mt-10 bg-white"
                    />
                ) : (
                    <LightTooltip
                        placement="right"
                        title={
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: product.tieuChuanKyThuat
                                        ? product.tieuChuanKyThuat
                                        : "Chưa có dữ liệu",
                                }}
                            />
                        }
                    >
                        <Box component="div">
                            {product.tieuChuanKyThuat ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: product.tieuChuanKyThuat.substring(0, 50) + "...",
                                    }}
                                />
                            ) : (
                                "Chưa có dữ liệu"
                            )}
                        </Box>
                    </LightTooltip>
                )}
            </StyledTableCell>
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClickUnit()}
            >
                {isEditingUnit === true ? (
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="dvtid"
                            name="dvtid"
                            type="dvtid"
                            value={dvtid}
                            onChange={handleChangeUnit}
                            onBlur={() => handleBlurUnit()}
                        >
                            {unitList.map((item) => (
                                <MenuItem key={item.dvtid} value={item.dvtid}>
                                    {item.tenDVT}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <LightTooltip
                        title={
                            product.donViTinh?.tenDVT
                                ? product.donViTinh?.tenDVT
                                : "Chưa có dữ liệu"
                        }
                    >
                        <span>
                            {product.donViTinh?.tenDVT
                                ? product.donViTinh?.tenDVT
                                : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
            </StyledTableCell>
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("model")}
            >
                {isEditing.model === true ? (
                    <TextareaAutosize
                        name="model"
                        value={modifiedProduct?.model}
                        onChange={handleChange}
                        onBlur={() => handleBlur("model")}
                        autoFocus // Focus on input field when in edit mode
                    />
                ) : (
                    <LightTooltip
                        title={product.model ? product.model : "Chưa có dữ liệu"}
                    >
                        <span>{product.model ? product.model : "Chưa có dữ liệu"}</span>
                    </LightTooltip>
                )}
            </StyledTableCell>
            {isShowFullTCKT && isShowFullTCKT === "true" && (
                <>
                    <StyledTableCell
                        align="left"
                        onDoubleClick={() => handleDoubleClick("hangSanXuat")}
                    >
                        {isEditing.hangSanXuat === true ? (
                            <TextareaAutosize
                                name="hangSanXuat"
                                value={modifiedProduct?.hangSanXuat ?? ''}
                                onChange={handleChange}
                                onBlur={() => handleBlur("hangSanXuat")}
                                autoFocus // Focus on input field when in edit mode
                            />
                        ) : (
                            <LightTooltip
                                title={
                                    product.hangSanXuat ? product.hangSanXuat : "Chưa có dữ liệu"
                                }
                            >
                                <span>
                                    {product.hangSanXuat
                                        ? product.hangSanXuat
                                        : "Chưa có dữ liệu"}
                                </span>
                            </LightTooltip>
                        )}
                    </StyledTableCell>
                    <StyledTableCell
                        align="left"
                        onDoubleClick={() => handleDoubleClick("nhaXuatBan")}
                    >
                        {isEditing.nhaXuatBan === true ? (
                            <TextareaAutosize
                                name="nhaXuatBan"
                                value={modifiedProduct?.nhaXuatBan ?? ''}
                                onChange={handleChange}
                                onBlur={() => handleBlur("nhaXuatBan")}
                                autoFocus // Focus on input field when in edit mode
                            />
                        ) : (
                            <LightTooltip
                                title={
                                    product.nhaXuatBan ? product.nhaXuatBan : "Chưa có dữ liệu"
                                }
                            >
                                <span>
                                    {product.nhaXuatBan ? product.nhaXuatBan : "Chưa có dữ liệu"}
                                </span>
                            </LightTooltip>
                        )}
                    </StyledTableCell>
                </>
            )}
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("doiTuongSuDung")}
            >
                {isEditing.doiTuongSuDung === true ? (
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="doiTuongSuDung"
                            name="doiTuongSuDung"
                            type="doiTuongSuDung"
                            value={modifiedProduct?.doiTuongSuDung}
                            onChange={handleChangeDTSD}
                            onBlur={() => handleBlur("doiTuongSuDung")}
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
                ) : (
                    <LightTooltip
                        title={
                            product.doiTuongSuDung
                                ? product.doiTuongSuDung
                                : "Chưa có dữ liệu"
                        }
                    >
                        <span>
                            {product.doiTuongSuDung
                                ? product.doiTuongSuDung
                                : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
            </StyledTableCell>
            {isShowFullTCKT && isShowFullTCKT === "true" && (
                <>
                    <StyledTableCell
                        align="left"
                        onDoubleClick={() => handleDoubleClick("baoHanh")}
                    >
                        {isEditing.baoHanh === true ? (
                            <TextareaAutosize
                                name="baoHanh"
                                value={modifiedProduct?.baoHanh}
                                onChange={handleChange}
                                onBlur={() => handleBlur("baoHanh")}
                                autoFocus // Focus on input field when in edit mode
                            />
                        ) : (
                            <LightTooltip
                                title={product.baoHanh ? product.baoHanh : "Chưa có dữ liệu"}
                            >
                                <span>
                                    {product.baoHanh
                                        ? product.baoHanh.toLocaleString()
                                        : "Chưa có dữ liệu"}
                                </span>
                            </LightTooltip>
                        )}
                    </StyledTableCell>
                </>
            )}
            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("thue")}
            >
                {isEditing.thue === true ? (
                    <TextareaAutosize
                        name="thue"
                        value={modifiedProduct?.thue}
                        onChange={handleChange}
                        onBlur={() => handleBlur("thue")}
                        autoFocus // Focus on input field when in edit mode
                    />
                ) : (
                    <LightTooltip title={product.thue ? product.thue : "Chưa có dữ liệu"}>
                        <span>
                            {product.thue ? product.thue.toLocaleString() : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
            </StyledTableCell>
            <StyledTableCell align="left">
                {product.giaVon ? product.giaVon.toLocaleString() : "Chưa có dữ liệu"}
            </StyledTableCell>

            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("giaBan")}
            >
                {isEditing.giaBan === true ? (
                    <TextareaAutosize
                        name="giaBan"
                        value={giaBan}
                        onChange={handleChange}
                        onBlur={() => handleBlur("giaBan")}
                        autoFocus // Focus on input field when in edit mode
                    />
                ) : (
                    <LightTooltip
                        title={
                            product.giaBan
                                ? product.giaBan.toLocaleString()
                                : "Chưa có dữ liệu"
                        }
                    >
                        <span>
                            {product.giaBan
                                ? product.giaBan.toLocaleString()
                                : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
            </StyledTableCell>

            <StyledTableCell
                align="left"
                onDoubleClick={() => handleDoubleClick("soLuong")}
            >
                {isEditing.soLuong === true ? (
                    <TextareaAutosize
                        name="soLuong"
                        value={modifiedProduct?.soLuong}
                        onChange={handleChange}
                        onBlur={() => handleBlurQuantity("soLuong")}
                        autoFocus // Focus on input field when in edit mode
                    />
                ) : (
                    <LightTooltip
                        title={product.soLuong ? product.soLuong : "Chưa có dữ liệu"}
                    >
                        <span>
                            {product.soLuong
                                ? product.soLuong.toLocaleString()
                                : "Chưa có dữ liệu"}
                        </span>
                    </LightTooltip>
                )}
                {openConfirmDialog && (
                    <AlertConfirmDialog
                        title="Xác nhận xóa dữ liệu?"
                        message="Dữ liệu đã xóa thì không khôi phục được"
                        onHandleConfirm={handleConfirmDeleteItem}
                        openConfirm={openConfirmDialog}
                        handleOpenConfirmDialog={setOpenConfirmDialog}
                    />
                )}
            </StyledTableCell>
            <StyledTableCell align="left">
                {product.soLuong && product.giaBan
                    ? (product.soLuong * product.giaBan).toLocaleString()
                    : "Chưa có dữ liệu"}
            </StyledTableCell>
            <StyledTableCell align="center">
                <Box display="flex" gap={2} alignItems="center" justifyContent="center">
                    <Box
                        display="flex"
                        gap={2}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StyledIconButton
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteItem()}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </StyledIconButton>
                    </Box>
                </Box>
            </StyledTableCell>
        </StyledTableRow>
    );
};
export default ProductRow;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: "24px",
        paddingBottom: "24px",
    },
}));
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
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
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