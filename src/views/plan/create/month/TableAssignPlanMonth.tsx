import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, Checkbox, Chip, IconButton, TableRow } from '@mui/material';
import { IconChevronRight, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Order } from '@/components/table/table-custom/type';
import EnhancedTableToolbar from '@/components/table/table-custom/TableTool';
import EnhancedTableHead from '@/components/table/table-custom/TableHeader';
import { StyledTableCell } from '@/components/table/table-custom/TableCell';
import TableCustomizePagination from '@/components/table/TablePagination';
import { PlanMonth } from '@/interfaces/plan';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';

export interface PropsTable {
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
    rows: PlanMonth[],
    head: any[];
    href?: string;
    orderByKey: string | number | symbol;
    roleName?: string[]
    isButtonEdit?: boolean,
    isButtonView?: boolean
}
export default function TableAssignPlanMonth(props: PropsTable) {
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
        isButtonView
    } = props
    const theme = useTheme()
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof any>(orderByKey);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
    const { userID, userName } = useRoleLocalStorage()
    const [data, setData] = useState<PlanMonth[]>([]);

    useEffect(() => {
        const newRow = rows.filter(item => item.nguoiTaoID === userID);
        setData(newRow);
    }, [rows, userID]);

    const visibleRows = useMemo(() => {
        if (contentSearch === '')
            return data.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
        return data
    }, [contentSearch, data, page, rowsPerPage]);

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = visibleRows?.map((row) => row?.thangID);
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
        handleOpenEditCard!(false);
    };
    const handleViewItem = (id: any) => {
        handleViewId!(id)
        handleOpenViewCard!(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }

    const handleEditItem = (id: any) => {
        handleEditId!(id)
        handleOpenEditCard!(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }

    const normalizeString = (str: string) => {
        return str?.trim().replace(/\s+/g, ' ');
    };

    const handleSearch = (row: any) => {
        const normalizedSearch = normalizeString(contentSearch);
        if (normalizedSearch === '') return true;
        return row.slice(1, 6).some((cell: any) => normalizeString(cell.toString()).includes(normalizedSearch));
    };
    const handleViewRole = (row: PlanMonth) => {
        if (row?.nguoiTaoID === userID) {
            return true;
        }
        return false
    }

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
                                rowCount={visibleRows.length}
                                headCells={head}
                                isRoleDelete={false}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.thangID);
                                    const labelId = `enhanced-table-checkbox-${row.thangID}`;

                                    return (
                                        handleSearch(row) && handleViewRole(row) &&
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.thangID}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            {/* {!row?.isApprove &&
                                                <StyledTableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, row.thangID)}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                            } */}


                                            <StyledTableCell key={index} align="left">{row?.thang ? row?.thang : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell key={index} align="left">{row?.nam ? row?.nam : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell key={index} align="left">{row?.tieuDe ? row?.tieuDe : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell key={index} align="left">{row?.createDate ? row?.createDate : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell key={index} align="left">{row?.createBy ? row?.createBy : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell key={index} align="left">
                                                <Chip
                                                    label={row?.isApprove ? "Đã duyệt" : "Chờ duyệt"}
                                                    sx={{
                                                        backgroundColor: row?.isApprove ? "green" : theme.palette.primary.main,
                                                        color: theme.palette.primary.contrastText
                                                    }}

                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Box width={"100%"} display='flex' gap={1} alignItems='center' justifyContent='flex-start'>
                                                    {isButtonView &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: theme.palette.primary.main }}>
                                                            <IconEye onClick={() => handleViewItem(row.thangID)} stroke={1.5} />
                                                        </Avatar>
                                                    }
                                                    {isButtonEdit &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: "green" }}>
                                                            <IconPencil onClick={() => handleEditItem(row.thangID)} stroke={1.5} />
                                                        </Avatar>
                                                    }
                                                     {!row?.isApprove &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: theme.palette.primary.main }}>
                                                            <IconTrash onClick={(event) => handleClick(event, row.thangID)} stroke={1.5} />
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
                        rows={data}
                    />
                </Box>
            </Box>
        </Box >
    );
}
