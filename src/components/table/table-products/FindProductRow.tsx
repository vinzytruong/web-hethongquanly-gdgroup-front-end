// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import { StyledButton } from "../../styled-button";
// import {
//     Autocomplete,
//     Button,
//     Chip,
//     Icon,
//     Rating,
//     TextField,
//     Tooltip,
//     TooltipProps,
//     tooltipClasses,
// } from "@mui/material";
// import { useRouter } from "next/router";
// import SnackbarAlert from "../../alert";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import StyledIconButton from "@/components/styled-button/StyledIconButton";
// import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
// import useProducts from "@/hooks/useProducts";
// import { FindProductInExcel, Products } from "@/interfaces/products";
// import ContractorsDialog from "@/components/dialog/ContractorsDialog";
// import useProvince from "@/hooks/useProvince";
// import ProductsDialog from "@/components/dialog/ProductsDialog";
// import { green } from "@mui/material/colors";
// import { loadCSS } from "fg-loadcss";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import ProductViewDetailDialog from "@/components/dialog/ProductViewDetailDialog";
// import AlertDialog from "@/components/alert/confirmAlertDialog";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { debounce } from 'lodash';
// import { getProductListByName } from "@/constant/api";
// import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

// const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
//     <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: {
//         backgroundColor: theme.palette.common.white,
//         color: "rgba(0, 0, 0, 0.87)",
//         boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.2)", // Thêm viền đen
//         fontSize: 13,
//         maxWidth: 500, // Thiết lập chiều rộng tối đa là 300px
//     },
// }));
// interface Props {
//     row: FindProductInExcel;
//     selectedProducts: Record<number, Products | null>;
//     index: number,
//     loading: boolean,
//     dropdownOptions: Products[],
//     priceCode: string,
//     isShowTCKT: string,
// }

// import dynamic from "next/dynamic";

// const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

// const FindProductRow = ({
//     row, selectedProducts, index, loading, dropdownOptions, priceCode
// }: Props) => {

//     return (
//         // <StyledTableRow
//         //     hover
//         //     role="checkbox"
//         //     tabIndex={-1}
//         //     key={index}
//         //     sx={{ cursor: "pointer" }}
//         // >
//         //     <StyledTableCell padding="normal">
//         //         {/* {page > 0 ? page * rowsPerPage + index + 1 : index + 1} */}
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">{row.productName}</StyledTableCell>
//         //     <StyledTableCell align="left">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.maSanPham
//         //                     ? selectedProducts[index]?.maSanPham
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.maSanPham
//         //                     ? `${selectedProducts[index]?.maSanPham}`
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <Autocomplete
//         //             fullWidth
//         //             disablePortal
//         //             loading={loading}
//         //             id={`combo-box-demo-${index}`} // Ensure unique id for each Autocomplete
//         //             options={dropdownOptions}
//         //             value={selectedProducts[index] || null} // Use selectedMovie for this row
//         //             getOptionLabel={(option) => option.tenSanPham}
//         //             onChange={(event, value) =>
//         //                 handleMovieChange(event, value, index)
//         //             } // Pass index
//         //             onFocus={() => handleFocus(row.productName)}
//         //             sx={{
//         //                 minWidth: 400,
//         //                 "& .MuiAutocomplete-loading": {
//         //                     color: "black", // Đặt màu chữ là đen
//         //                 },
//         //                 "& .MuiAutocomplete-option": {
//         //                     backgroundColor: "black", // Đặt màu nền là đen cho các tùy chọn
//         //                     color: "black", // Đặt màu chữ là trắng cho các tùy chọn
//         //                 },
//         //             }}
//         //             renderInput={(params) => <TextField onChange={(event) =>
//         //                 handleChangeText(event)
//         //             }  {...params} />}
//         //         />
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             placement="right"
//         //             title={
//         //                 <span
//         //                     dangerouslySetInnerHTML={{
//         //                         __html: selectedProducts[index]?.tieuChuanKyThuat
//         //                             ? String(selectedProducts[index]?.tieuChuanKyThuat)
//         //                             : "",
//         //                     }}
//         //                 />
//         //             }
//         //         >
//         //             <Box component="div">
//         //                 {selectedProducts[index]?.tieuChuanKyThuat !== undefined ? (
//         //                     <span
//         //                         dangerouslySetInnerHTML={{
//         //                             __html:
//         //                                 selectedProducts[index]?.tieuChuanKyThuat?.substring(
//         //                                     0,
//         //                                     50
//         //                                 ) + "...",
//         //                         }}
//         //                     />
//         //                 ) : (
//         //                     ""
//         //                 )}
//         //             </Box>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.donViTinh?.tenDVT
//         //                     ? selectedProducts[index]?.donViTinh?.tenDVT
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.donViTinh?.tenDVT
//         //                     ? selectedProducts[index]?.donViTinh?.tenDVT
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.model ? selectedProducts[index]?.model : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.model
//         //                     ? selectedProducts[index]?.model
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     {isShowFullTCKT === "true" && (
//         //         <StyledTableCell padding="normal">
//         //             <LightTooltip
//         //                 title={
//         //                     selectedProducts[index]?.xuatXu
//         //                         ? selectedProducts[index]?.xuatXu
//         //                         : ""
//         //                 }
//         //             >
//         //                 <span>
//         //                     {selectedProducts[index]?.xuatXu
//         //                         ? selectedProducts[index]?.xuatXu
//         //                         : ""}
//         //                 </span>
//         //             </LightTooltip>
//         //         </StyledTableCell>
//         //     )}
//         //     {isShowFullTCKT === "true" && (
//         //         <StyledTableCell padding="normal">
//         //             <LightTooltip
//         //                 title={
//         //                     selectedProducts[index]?.hangSanXuat
//         //                         ? selectedProducts[index]?.hangSanXuat
//         //                         : ""
//         //                 }
//         //             >
//         //                 <span>
//         //                     {selectedProducts[index]?.hangSanXuat
//         //                         ? selectedProducts[index]?.hangSanXuat
//         //                         : ""}
//         //                 </span>
//         //             </LightTooltip>
//         //         </StyledTableCell>
//         //     )}
//         //     {isShowFullTCKT === "true" && (
//         //         <StyledTableCell padding="normal">
//         //             <LightTooltip
//         //                 title={
//         //                     selectedProducts[index]?.nhaXuatBan
//         //                         ? selectedProducts[index]?.nhaXuatBan
//         //                         : ""
//         //                 }
//         //             >
//         //                 <span>
//         //                     {selectedProducts[index]?.nhaXuatBan
//         //                         ? selectedProducts[index]?.nhaXuatBan
//         //                         : ""}
//         //                 </span>
//         //             </LightTooltip>
//         //         </StyledTableCell>
//         //     )}

//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.doiTuongSuDung
//         //                     ? selectedProducts[index]?.doiTuongSuDung
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.doiTuongSuDung
//         //                     ? selectedProducts[index]?.doiTuongSuDung
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     {isShowFullTCKT === "true" && (
//         //         <StyledTableCell padding="normal">
//         //             <LightTooltip
//         //                 title={
//         //                     selectedProducts[index]?.baoHanh
//         //                         ? selectedProducts[index]?.baoHanh
//         //                         : ""
//         //                 }
//         //             >
//         //                 <span>
//         //                     {selectedProducts[index]?.baoHanh
//         //                         ? selectedProducts[index]?.baoHanh.toLocaleString()
//         //                         : ""}
//         //                 </span>
//         //             </LightTooltip>
//         //         </StyledTableCell>
//         //     )}

//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.thue ? selectedProducts[index]?.thue : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.thue
//         //                     ? selectedProducts[index]?.thue.toLocaleString()
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.soLuong
//         //                     ? selectedProducts[index]?.soLuong
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.soLuong
//         //                     ? selectedProducts[index]?.soLuong.toLocaleString()
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.[priceCode]
//         //                     ? selectedProducts[index]?.[priceCode].toLocaleString()
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.[priceCode] !== undefined &&
//         //                     selectedProducts[index]?.[priceCode] !== null // Check if giaBan is not undefined or null
//         //                     ? selectedProducts[index]?.[priceCode].toLocaleString()
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         {selectedProducts[index]?.giaCDT !== undefined &&
//         //             selectedProducts[index]?.giaCDT !== null // Check if giaBan is not undefined or null
//         //             ? (selectedProducts[index]![priceCode] * selectedProducts[index]!.soLuong).toLocaleString()
//         //             : ""}
//         //     </StyledTableCell>
//         //     <StyledTableCell padding="normal">
//         //         <LightTooltip
//         //             title={
//         //                 selectedProducts[index]?.giaVon
//         //                     ? selectedProducts[index]?.giaVon.toLocaleString()
//         //                     : ""
//         //             }
//         //         >
//         //             <span>
//         //                 {selectedProducts[index]?.giaVon !== undefined &&
//         //                     selectedProducts[index]?.giaVon !== null // Check if giaBan is not undefined or null
//         //                     ? selectedProducts[index]?.giaVon.toLocaleString()
//         //                     : ""}
//         //             </span>
//         //         </LightTooltip>
//         //     </StyledTableCell>
//         // </StyledTableRow>
//     );
// };
// export default FindProductRow;

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     "&:last-child td, &:last-child th": {
//         border: 0,
//     },
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: theme.palette.primary.main,
//         color: theme.palette.common.white,
//         border: 0,
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//         paddingTop: "24px",
//         paddingBottom: "24px",
//     },
// }));
// const blue = {
//     100: '#DAECFF',
//     200: '#b6daff',
//     400: '#3399FF',
//     500: '#007FFF',
//     600: '#0072E5',
//     900: '#003A75',
// };

// const grey = {
//     50: '#F3F6F9',
//     100: '#E5EAF2',
//     200: '#DAE2ED',
//     300: '#C7D0DD',
//     400: '#B0B8C4',
//     500: '#9DA8B7',
//     600: '#6B7A90',
//     700: '#434D5B',
//     800: '#303740',
//     900: '#1C2025',
// };

// const TextareaAutosize = styled(BaseTextareaAutosize)(
//     ({ theme }) => `
//   box-sizing: border-box;
//   width: 320px;
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-size: 0.875rem;
//   font-weight: 400;
//   line-height: 1.5;
//   padding: 8px 12px;
//   border-radius: 8px;
//   color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
//   background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//   border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//   box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

//   &:hover {
//     border-color: ${blue[400]};
//   }

//   &:focus {
//     border-color: ${blue[400]};
//     box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
//   }

//   // firefox
//   &:focus-visible {
//     outline: 0;
//   }
// `,
// );