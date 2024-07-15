import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCustomizePagination from '../TablePagination';
import EnhancedTableHead from './TableHeader';
import { useEffect, useMemo, useState } from 'react';
import EnhancedTableToolbar from './TableTool';
import { StyledTableCell } from './TableCell';
import { Avatar, Checkbox, Chip, IconButton, TableRow } from '@mui/material';
import { Order, PropsTable } from './type';
import { IconChevronRight, IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
export default function TableCustom(props: PropsTable) {
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
        handleOpenReportCard,
        handleReportId,
        selected,
        isRoleDelete,
        handleDelete,
        isButtonEdit,
        isButtonView,
        isButtonReport
    } = props
    const theme = useTheme()
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof any>(orderByKey);
    const [page, setPage] = useState(0);
    const [userID, setUserID] = useState<number>(0);
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
            const newSelected = rows?.map((row) => row[0]);
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
        if(handleOpenViewCard) handleOpenViewCard(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }

    const handleEditItem = (id: any) => {
        console.log("fdfdfdfdfdf", id);
        handleEditId!(id)
        if (isButtonEdit) handleOpenEditCard!(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }
    const handleReportItem = (id: any) => {
        handleReportId!(id)
        if (isButtonEdit) handleOpenReportCard!(true)
        if (props.href) router.push(`${props.href}?id=${id}`)
    }

    const normalizeString = (str: string | number) => {
        return str?.toString().trim().replace(/\s+/g, ' ').toLowerCase();
    };

    const handleSearch = (row: any) => {
        const normalizedSearch = normalizeString(contentSearch);
        if (normalizedSearch === '') return true;
        return Object.values(row).slice(1).some((cell: any) => {
            if (typeof cell === 'string' || typeof cell === 'number') {
                const normalizedCell = normalizeString(cell);
                return normalizedCell.includes(normalizedSearch);
            }
            return false;
        });
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
                                isRoleDelete={isRoleDelete}
                                headCells={head}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row[0]);
                                    const labelId = `enhanced-table-checkbox-${row[0]}`;
                                    return (
                                        handleSearch(row) &&
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row[0]}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                           {isRoleDelete &&
                                            <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                onClick={(event) => handleClick(event, row?.[0])}
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </StyledTableCell>
                                           }
                                            {Array.isArray(row) && row.map((item: any, idx: any) => (
                                                idx > 0 && (
                                                    <StyledTableCell key={idx} align="left">
                                                        {idx === 4 ? (
                                                            item === 'Chưa thực hiện' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'blue', color: 'white' }} />
                                                            ) : item === 'Đang thực hiện' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'yellow', color: 'black' }} />
                                                            ) : item === 'Hoàn thành' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'green', color: 'white' }} />
                                                            ) :
                                                                item === 'Hủy' ? <Chip label={item} style={{ backgroundColor: 'red', color: 'white' }} />
                                                                    :
                                                                    (
                                                                        item
                                                                    )
                                                        ) : idx === 5 ? (
                                                            item === 'Thấp' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'red', color: 'white' }} />
                                                            ) : item === 'Trung bình' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'yellow', color: 'black' }} />
                                                            ) : item === 'Cao' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'green', color: 'white' }} />
                                                            ) : (
                                                                item
                                                            )
                                                        ) : (
                                                            item ? item : 'Chưa có dữ liệu'
                                                        )}
                                                    </StyledTableCell>
                                                )
                                            ))}
                                            <StyledTableCell align="center">
                                                <Box display='flex' gap={1} alignItems='center' justifyContent='center'>
                                                    {isButtonReport &&
                                                        <StyledIconButton
                                                            variant="contained"
                                                            color="dark"
                                                            onClick={() => handleReportItem(row?.[0])}
                                                        >
                                                            <AssignmentIcon />
                                                        </StyledIconButton>

                                                    }
                                                    {isButtonView &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: theme.palette.primary.main }}>
                                                            <IconEye onClick={() => handleViewItem(row?.[0])} stroke={1.5} />
                                                        </Avatar>
                                                    }
                                                    {isButtonEdit &&
                                                        <Avatar variant="rounded" sx={{ bgcolor: "green" }}>
                                                            <IconPencil onClick={() => handleEditItem(row?.[0])} stroke={1.5} />
                                                        </Avatar>
                                                    }

                                                </Box>
                                            </StyledTableCell>

                                            {/* <StyledTableCell align="center">
                                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>

                                                    <IconButton onClick={() => handleViewItem(row[0])}>
                                                        <IconChevronRight stroke={1} />
                                                    </IconButton>
                                                </Box>
                                            </StyledTableCell> */}
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
