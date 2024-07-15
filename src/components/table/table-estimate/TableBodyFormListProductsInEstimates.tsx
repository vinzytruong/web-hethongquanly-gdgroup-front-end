import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
    TextField,
    Tooltip,
    TooltipProps,
    tooltipClasses,
} from "@mui/material";
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
import ProductRow from "./ProductRow";
import { UtilizedObject, utilizedObjects } from "@/interfaces/utilizedObject";
import { Units } from "@/interfaces/units";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { DELETE_PRODUCTINESTIMATES, UPDATE_PRODUCTINESTIMATES, UPDATE_QUANTITY_PRODUCTINESTIMATES } from "@/store/productInEstimate/action";
import { DELETE_PRODUCTINSHAREDEQUIPMENTS, UPDATE_PRODUCTINSHAREDEQUIPMENTS, UPDATE_QUANTITY_PRODUCTINSHAREDEQUIPMENTS } from "@/store/productInSharedEquipment/action";
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
interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    data: Products[];
    unitList: Units[];
    filteredProductsBySharedEquipment: Products[];
    page: number;
    rowsPerPage: number;
    editLink?: string;
    viewLink: string;
    isAdmin: boolean;
    lengthHeader: number;
    isShowFullTCKT: string;
}
const TableBodyFormListProductsInEstimates = (props: BodyDataProps) => {
    // const { deleteProducts, updateProducts } = useProducts()
    const productInEstimateRedux = useAppSelector((state) => state.productInEstimates.slice())
    const productInSharedEquipmentRedux = useAppSelector((state) => state.productInSharedEquipments.slice())

    const [dataGrades, setDataGrades] = React.useState<Grades[]>();
    const [dataSubjects, setDataSubjects] = React.useState<Subjects[]>();
    const [productInEstimate, setProductInEstimate] =
        React.useState<ProductInEstimate[]>();
    const [alertContent, setAlertContent] = React.useState({
        type: "",
        message: "",
    });
    const [openAlert, setOpenAlert] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useAppDispatch();

    const {
        data,
        handleEdit,
        handleView,
        editLink,
        viewLink,
        isAdmin,
        lengthHeader,
        isShowFullTCKT,
        unitList,
        filteredProductsBySharedEquipment
    } = props;
    const [childFilteredProductsBySharedEquipment, setChildFilteredProductsBySharedEquipment] = React.useState<Products[]>();
    // React.useEffect(() => {
    //     setChildFilteredProductsBySharedEquipment(filteredProductsBySharedEquipment);
    // }, [filteredProductsBySharedEquipment]);
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setIsLoading(true);
    //             const accessToken = window.localStorage.getItem("accessToken");
    //             const headers = { Authorization: `Bearer ${accessToken}` };
    //             const responseGrades = await axios.get(getGrade, {
    //                 headers,
    //             });
    //             const responseSubjects = await axios.get(getSubject, {
    //                 headers,
    //             });
    //             setDataGrades(responseGrades.data);
    //             setDataSubjects(responseSubjects.data);
    //             // const combinedArray: ProductInEstimate[] = responseGrades.data.map((grade: Grades, index: number) => {
    //             //     return responseSubjects.data.map((subject: Subjects, indexSubject: number) => {
    //             //         const productList: Products[] = data.filter((x: any) =>
    //             //             x.monHoc.some((y: any) =>
    //             //                 y.monHocID === subject.monHocID &&
    //             //                 x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
    //             //             )
    //             //         );
    //             //         if (productList.length > 0) {
    //             //             return {
    //             //                 khoiLopID: grade.khoiLopID,
    //             //                 tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
    //             //                 monHocID: subject.monHocID,
    //             //                 tenMonHoc: subject.tenMonHoc,
    //             //                 sanPham: productList
    //             //             };
    //             //         }
    //             //     });
    //             // }).flat();
    //             const combinedArray: ProductInEstimate[] = [];

    //             responseGrades.data.forEach((grade: Grades, index: number) => {
    //                 responseSubjects.data.forEach(
    //                     (subject: Subjects, indexSubject: number) => {
    //                         const productList: Products[] = data.filter((x: any) =>
    //                             x.monHoc.some(
    //                                 (y: any) =>
    //                                     y.monHocID === subject.monHocID &&
    //                                     x.khoiLop.some((z: any) => z.khoiLopID === grade.khoiLopID)
    //                             )
    //                         );
    //                         combinedArray.push({
    //                             khoiLopID: grade.khoiLopID,
    //                             tenKhoiLop: indexSubject === 0 ? grade.tenKhoiLop : null,
    //                             monHocID: subject.monHocID,
    //                             tenMonHoc: subject.tenMonHoc,
    //                             sanPham: productList,
    //                         });
    //                     }
    //                 );
    //             });
    //             setProductInEstimate(combinedArray);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [data]);
    const [selectedID, setSelectedID] = React.useState<number>();


    const handleChangeItem = (changedItem: Products, khoiLopID: number, monHocID: number) => {
        dispatch(UPDATE_PRODUCTINESTIMATES({ product: changedItem }))
        dispatch(UPDATE_PRODUCTINSHAREDEQUIPMENTS({ product: changedItem }))
    };

    const handleChangeItemQuantity = (changedItem: Products, khoiLopID: number, monHocID: number) => {
        let updateEstimateItem = productInEstimateRedux?.find((x) => x.khoiLopID === khoiLopID && x.monHocID === monHocID);
        if (khoiLopID === 0 && monHocID === 0) {
            dispatch(UPDATE_QUANTITY_PRODUCTINSHAREDEQUIPMENTS({ product: changedItem }))
        }
        if (updateEstimateItem) {
            let newUpdateEstimateItem = { ...updateEstimateItem };
            newUpdateEstimateItem.sanPham = newUpdateEstimateItem.sanPham.map((item) => {
                if (item.sanPhamID === changedItem.sanPhamID) {
                    return changedItem; // Update the changed product
                }
                return item; // Return other products as they are
            });
            dispatch(UPDATE_QUANTITY_PRODUCTINESTIMATES({ productInEstimate: newUpdateEstimateItem }))
        }
    };
    const handleDeleteItem = (changedItem: Products, khoiLopID: number, monHocID: number) => {
        if (khoiLopID === 0 && monHocID === 0) {
            dispatch(DELETE_PRODUCTINSHAREDEQUIPMENTS({ product: changedItem }))

        } else {
            dispatch(DELETE_PRODUCTINESTIMATES({ product: changedItem, khoiLopID: khoiLopID, monHocID: monHocID }))
        }

    };

    return (
        <>
            {isLoading ? (
                <>
                    <TableBody>
                        <StyledTableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            sx={{ cursor: "pointer" }}
                        >
                            <StyledTableCell
                                colSpan={lengthHeader + 2}
                                padding="normal"
                                sx={{
                                    bgcolor: "#2e7d32",
                                    color: "white",
                                    borderRadius: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        p: 1,
                                        m: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    Loading....
                                </Box>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </>
            ) : (
                <>
                    <TableBody>
                        {productInEstimateRedux?.map(
                            (item: ProductInEstimate, indexGrade: any) => (
                                <React.Fragment key={indexGrade}>
                                    {item.tenKhoiLop ? (
                                        <>
                                            <StyledTableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                {item.tenKhoiLop && (
                                                    <StyledTableCell
                                                        colSpan={lengthHeader + 2}
                                                        padding="normal"
                                                        sx={{
                                                            bgcolor: "#2e7d32",
                                                            color: "white",
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                p: 1,
                                                                m: 1,
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            {item.tenKhoiLop}
                                                        </Box>
                                                    </StyledTableCell>
                                                )}
                                            </StyledTableRow>
                                        </>
                                    ) : (
                                        <></>
                                    )}

                                    <StyledTableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <StyledTableCell
                                            colSpan={lengthHeader + 2}
                                            padding="normal"
                                            sx={{
                                                bgcolor: "#4153af",
                                                color: "white",
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    p: 1,
                                                    m: 1,
                                                    borderRadius: 1,
                                                }}
                                            >
                                                {item.tenMonHoc}
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>

                                    {item.sanPham &&
                                        item.sanPham.length > 0 &&
                                        item.sanPham.map(
                                            (product: Products, indexProducts: any) => {
                                                let i = indexProducts + 1;
                                                return (
                                                    <ProductRow
                                                        unitList={unitList}
                                                        monHocID={item.monHocID}
                                                        khoiLopID={item.khoiLopID}
                                                        onHandleChangeItem={handleChangeItem}
                                                        onHandleChangeItemQuantity={handleChangeItemQuantity}
                                                        onHandleDeleteItem={handleDeleteItem}
                                                        key={indexProducts}
                                                        index={indexProducts}
                                                        product={product}
                                                        isShowFullTCKT={isShowFullTCKT}
                                                    />
                                                );
                                            }
                                        )}

                                </React.Fragment>
                            )
                        )}
                        <StyledTableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            sx={{ cursor: "pointer" }}
                        >

                            <StyledTableCell
                                colSpan={lengthHeader + 2}
                                padding="normal"
                                sx={{
                                    bgcolor: "#2e7d32",
                                    color: "white",
                                    borderRadius: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        p: 1,
                                        m: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    Thiết bị dùng chung
                                </Box>
                            </StyledTableCell>
                        </StyledTableRow>
                        {productInSharedEquipmentRedux &&
                            productInSharedEquipmentRedux.length > 0 &&
                            productInSharedEquipmentRedux.map(
                                (product: Products, indexProducts: any) => {
                                    let i = indexProducts + 1;
                                    return (
                                        <ProductRow
                                            onHandleChangeItem={handleChangeItem}
                                            onHandleChangeItemQuantity={handleChangeItemQuantity}
                                            onHandleDeleteItem={handleDeleteItem}
                                            key={indexProducts}
                                            khoiLopID={0}
                                            monHocID={0}
                                            index={indexProducts}
                                            product={product}
                                            unitList={unitList}
                                            isShowFullTCKT={isShowFullTCKT}
                                        />
                                    );
                                }
                            )}
                        {alertContent && (
                            <SnackbarAlert
                                message={alertContent.message}
                                type={alertContent.type}
                                setOpenAlert={setOpenAlert}
                                openAlert={openAlert}
                            />
                        )}
                        {productInSharedEquipmentRedux.length === 0 && (
                            <StyledTableRow style={{ height: 83 }}>
                                <StyledTableCell align="center" colSpan={lengthHeader + 1}>
                                    Chưa có dữ liệu
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                        {open === true && selectedID && (
                            <ProductInEstimateDetailDialog
                                title="Cập nhật sản phẩm trong dự toán"
                                defaulValue={data.find((item) => item.sanPhamID === selectedID)}
                                handleOpen={setOpen}
                                open={open}
                                isUpdate
                            />
                        )}
                    </TableBody>
                </>
            )}
        </>
    );
};
export default React.memo(TableBodyFormListProductsInEstimates);

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
