import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useMemo, useState } from 'react';
import { Avatar, Checkbox, Chip, IconButton, TableRow, Tooltip } from '@mui/material';
import { IconBrowserCheck, IconChevronRight, IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Order } from '@/components/table/table-custom/type';
import EnhancedTableToolbar from '@/components/table/table-custom/TableTool';
import EnhancedTableHead from '@/components/table/table-custom/TableHeader';
import { StyledTableCell } from '@/components/table/table-custom/TableCell';
import TableCustomizePagination from '@/components/table/TablePagination';
import { step } from '@/constant';
import { ProjectEstimate } from '@/interfaces/projectEstimate';
import { formatCurrency } from '@/utils/formatCurrency';

interface PropsTable {
    title: string;
    handleOpenCard?: (e: any) => void,
    handleOpenEditCard?: (e: any) => void,
    handleOpenViewCard?: (e: any) => void,
    handleViewId?: (e: any) => void,
    handleEditId?: (e: any) => void,
    handleSelected: (e: any) => void,
    handleDelete: (e: any) => void,
    selected: number[],
    contentSearch: string,
    rows: any[],
    head: any[];
    href?: string;
    orderByKey: string | number | symbol;
    roleName?: string[]
    isButtonEdit?: boolean,
    isButtonView?: boolean,
    isRoleDelete?: boolean,
}
export default function TableReportValue(props: PropsTable) {
    const { contentSearch,
        title,
        handleOpenCard,
        handleOpenEditCard,
        handleOpenViewCard,
        handleViewId,
        handleEditId,
        rows,
        orderByKey,
        head,
        handleSelected,
        selected,
        handleDelete,
        isButtonEdit,
        isButtonView,
        isRoleDelete,
    } = props
    const theme = useTheme()
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof any>(orderByKey);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    // const [actionDelete, setActionDelete] = useState<boolean>(false);

    const visibleRows = useMemo(() => {
        if (contentSearch === '')
            return rows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
        return rows
    }, [page, rows, rowsPerPage, contentSearch]);

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows?.map((row) => row?.duToanID);
            handleSelected(newSelected);
            return;
        }
        handleSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        handleSelected(newSelected);
        handleOpenViewCard!(false);
        if (isButtonEdit) handleOpenEditCard!(false);
    };
    const handleViewItem = (id: any) => {
        handleViewId!(id)
        handleOpenViewCard!(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }

    const handleEditItem = (id: any) => {
        handleEditId!(id)
        if (isButtonEdit) handleOpenEditCard!(true)
    }

    const normalizeString = (str: string) => {
        return str?.trim().replace(/\s+/g, ' ').toLowerCase();
    };

    const handleSearch = (row: any) => {
        const normalizedSearch = normalizeString(contentSearch);
        if (normalizedSearch === '') return true;

        return row.slice(1, rows.length + 1).some((cell: any) => normalizeString(cell.toString()).includes(normalizedSearch));
    };


    return (
        <Box
            display='flex'
            width='100%'
            bgcolor={theme.palette.background.paper}
        >
            <Box sx={{ overflow: "auto", width: '100%' }}>
                <Box sx={{ borderRadius: '6px', width: '100%', display: "table", tableLayout: "fixed", backgroundColor: theme.palette.background.paper }}>
                    {selected.length > 0 &&
                        <EnhancedTableToolbar
                            title={title}
                            numSelected={selected.length}
                            handleSelected={handleSelected}
                            handleDelete={() => handleDelete(selected)}
                            selected={selected}
                            
                        />
                    }
                    <TableContainer>
                        <Table
                            aria-labelledby="tableTitle"
                            sx={{ minWidth: 750, border: 0 }}
                            size='medium'
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                handleOrder={setOrder}
                                handleOrderBy={setOrderBy}
                                rowCount={rows.length}
                                headCells={head}
                                isRoleDelete={isRoleDelete}
                            />
                            <TableBody>
                                {visibleRows.map((row: ProjectEstimate, index) => {
                                    const isItemSelected = isSelected(row?.duToanID);
                                    const labelId = `enhanced-table-checkbox-${row?.duToanID}`;
                                    return (
                                        handleSearch(row) &&
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row?.duToanID}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {isRoleDelete &&
                                                <StyledTableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, row?.duToanID)}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                            }
                                            <StyledTableCell align="left">{row?.doanhThuDuKien ? row?.tenDuToan : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.thoiGian ? row?.thoiGian?.slice(0,10) : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.thoiGianKetThucDuKien ? row?.thoiGianKetThucDuKien?.slice(0,10) : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.buocThiTruongID ? step?.find(item => item.buocThiTruongID === row?.buocThiTruongID)?.buocThiTruongTen : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.doanhThuDuKien ? formatCurrency(row?.doanhThuDuKien) : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.doanhThuThucTe ? formatCurrency(row?.doanhThuThucTe) : 'Chưa có'}</StyledTableCell>
                                            <StyledTableCell align="left">{row?.ketQua!==null ?

                                                <Chip label={row?.ketQua===true ? "Thành công" : "Thất bại"} /> : <Chip label={"Chưa xác định"} />
                                            }
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Box display='flex' gap={1} alignItems='center' justifyContent='center'>
                                                    {isButtonView &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: theme.palette.grey[800] }}>
                                                            <IconEye onClick={() => handleViewItem(row?.duToanID)} stroke={1.5} />
                                                        </Avatar>
                                                    }
                                                    {isButtonEdit &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: "green" }}>
                                                            <IconPencil onClick={() => handleEditItem(row?.duToanID)} stroke={1.5} />
                                                        </Avatar>
                                                    }
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableCustomizePagination
                        handlePage={setPage}
                        handleRowsPerPage={setRowsPerPage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                    />
                </Box>
            </Box>
        </Box >
    );
}
