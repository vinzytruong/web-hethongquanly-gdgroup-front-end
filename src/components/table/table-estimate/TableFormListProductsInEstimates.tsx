import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { useTheme } from "@mui/material";
import TableHeader from "../TableHeader";
import TableCustomizePagination from "../TablePagination";
import TableBodyFormListProductsInEstimates from "./TableBodyFormListProductsInEstimates";
import { Products } from "@/interfaces/products";
import { Units } from "@/interfaces/units";
import { useAppSelector } from "@/store/hook";
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: any[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}

interface Props {
    rows: Products[];
    unitList: Units[];
    filteredProductsBySharedEquipment: Products[];
    isAdmin: boolean;
    isListProductsInEstimates: boolean;
    price: string;
    isShowFullTCKT: string;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
let headCells: HeadCell[] = [
    {
        id: "products_code",
        numeric: false,
        disablePadding: false,
        label: "Mã sản phẩm",
    },
    {
        id: "products_name",
        numeric: false,
        disablePadding: false,
        label: "Tên sản phẩm",
    },
    {
        id: "products_tieuChuanKyThuat",
        numeric: false,
        disablePadding: false,
        label: "Tiêu chuẩn kỹ thuật",
    },
    {
        id: "products_donViTinh",
        numeric: false,
        disablePadding: false,
        label: "Đơn vị tính",
    },
    {
        id: "products_model",
        numeric: false,
        disablePadding: false,
        label: "Model",
    },
    {
        id: "products_HSX/NSX",
        numeric: false,
        disablePadding: false,
        label: "HSX/NSX",
    },
    {
        id: "products_publisher",
        numeric: false,
        disablePadding: false,
        label: "Nhà xuất bản",
    },
    {
        id: "products_ĐTSD",
        numeric: false,
        disablePadding: false,
        label: "ĐTSD",
    },
    {
        id: "products_baoHanh",
        numeric: false,
        disablePadding: false,
        label: "Bảo hành (tháng)",
    },
    {
        id: "products_thue",
        numeric: false,
        disablePadding: false,
        label: "Thuế(%)",
    },
    {
        id: "products_giaVon",
        numeric: false,
        disablePadding: false,
        label: "Giá Vốn",
    },
    {
        id: "giaDaiLy",
        numeric: false,
        disablePadding: false,
        label: "Đơn giá (Giá Đại Lý)",
    },
    {
        id: "giaTTR",
        numeric: false,
        disablePadding: false,
        label: "Đơn giá (Giá TTR)",
    },
    {
        id: "giaTH_TT",
        numeric: false,
        disablePadding: false,
        label: "Đơn giá (Giá TH_TT)",
    },
    {
        id: "giaCDT",
        numeric: false,
        disablePadding: false,
        label: "Đơn giá (Giá CDT)",
    },
    {
        id: "products_soLuong",
        numeric: false,
        disablePadding: false,
        label: "Số lượng",
    },
    {
        id: "products_subtotal",
        numeric: false,
        disablePadding: false,
        label: "Thành tiền",
    },
];
const TableFormListProductsInEstimates = ({
    rows,
    unitList,
    isAdmin,
    isListProductsInEstimates,
    price,
    isShowFullTCKT,
    filteredProductsBySharedEquipment,
}: Props) => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Products>("tenSanPham");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [viewId, setViewId] = React.useState(0);
    const [editId, setEditId] = React.useState(0);
    const theme = useTheme();

    const headCellsSubset = React.useMemo(() => {
        let filterHeadCells: HeadCell[] = headCells;
        if (isShowFullTCKT === "false") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "products_HSX/NSX" &&
                    cell.id !== "products_publisher" &&
                    cell.id !== "products_baoHanh"
            );
        }
        if (price === "giaDaiLy") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaTTR" && cell.id !== "giaTH_TT" && cell.id !== "giaCDT"
            );
        }
        if (price === "giaCDT") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" &&
                    cell.id !== "giaTH_TT" &&
                    cell.id !== "giaCDT"
            );
        }
        if (price === "giaTH_TT") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" && cell.id !== "giaTTR" && cell.id !== "giaCDT"
            );
        }
        if (price === "giaTTR") {
            filterHeadCells = filterHeadCells.filter(
                (cell) =>
                    cell.id !== "giaDaiLy" &&
                    cell.id !== "giaTH_TT" &&
                    cell.id !== "giaCDT"
            );
        }

        return filterHeadCells;
    }, [price, isShowFullTCKT]);
    const productInEstimateRedux = useAppSelector((state) => state.productInEstimates.slice())
    const productInSharedEquipmentRedux = useAppSelector((state) => state.productInSharedEquipments.slice())
    return (
        <Box
            display="flex"
            width="100%"
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <Box sx={{ overflow: "auto", width: "100%" }}>
                <Box
                    sx={{
                        borderRadius: "6px",
                        width: "100%",
                        display: "table",
                        tableLayout: "fixed",
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <TableContainer
                        sx={{ border: 0, borderRadius: "6px", minWidth: 650 }}
                    >
                        <Table
                            sx={{ minWidth: 500, border: 0 }}
                            aria-label="simple table"
                            size="medium"
                        >
                            {headCellsSubset && headCellsSubset.length > 0 && (
                                <>
                                    <TableHeader
                                        order={order}
                                        orderBy={""}
                                        handleOrder={setOrder}
                                        handleOrderBy={setOrderBy}
                                        rowCount={rows?.length}
                                        headerCells={headCellsSubset}
                                        action={true}
                                    />
                                    {productInEstimateRedux &&
                                        productInEstimateRedux.length > 0 &&
                                        headCellsSubset &&
                                        isShowFullTCKT && (
                                            <TableBodyFormListProductsInEstimates
                                                data={rows}
                                                filteredProductsBySharedEquipment={
                                                    filteredProductsBySharedEquipment
                                                }
                                                unitList={unitList}
                                                handleView={setViewId}
                                                handleEdit={setEditId}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                viewLink=""
                                                editLink=""
                                                isAdmin={isAdmin}
                                                lengthHeader={headCellsSubset?.length ?? 0}
                                                isShowFullTCKT={isShowFullTCKT}
                                            />
                                        )}
                                </>
                            )}
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
};
export default TableFormListProductsInEstimates;
