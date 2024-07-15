import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCustomizePagination from '../TablePagination';
import EnhancedTableHead from '../table-custom/TableHeader';
import { useEffect, useMemo, useState } from 'react';
import EnhancedTableToolbar from '../table-custom/TableTool';
import { StyledTableCell } from '../table-custom/TableCell';
import { Avatar, Checkbox, Chip, IconButton, TableRow } from '@mui/material';
import { Order, PropsTable } from '../table-custom/type';
import { IconChevronRight, IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StyledIconButton from '@/components/styled-button/StyledIconButton';
export default function TableAssignment(props: PropsTable) {
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
    const [userName, setUserName] = useState<string>('');
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
        handleOpenViewCard!(true)
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

    const normalizeString = (str: string) => {
        return str?.trim().replace(/\s+/g, ' ').toLowerCase();
    };

    const handleSearch = (row: any) => {
        const normalizedSearch = normalizeString(contentSearch);
        if (normalizedSearch === '') return true;

        return row.slice(1, rows.length + 1).some((cell: any) => normalizeString(cell.toString()).includes(normalizedSearch));
    };

    console.log("sskjskdstyi", visibleRows);
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Chưa Thực hiện':
                return 'blue';
            case 'Đang thực hiện':
                return 'yellow';
            case 'Hoàn thành':
                return 'green';
            case 'Hủy':
                return 'red';
            default:
                return 'inherit';
        }
    };
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        setUserID(account.userID);
        setUserName(account.username);
    }, [])
    console.log("dsfeagd", visibleRows);

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
                                            <StyledTableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    onClick={(event) => handleClick(event, row?.[0])}
                                                    checked={isItemSelected}
                                                    disabled={userName !== row[3]}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </StyledTableCell>
                                            {Array.isArray(row) && row.map((item: any, idx: any) => (
                                                idx > 0 && idx !== 9 && (
                                                    <StyledTableCell key={idx} align="left">
                                                        {idx === 6 ? (
                                                            item === 'Chưa thực hiện' ? (
                                                                <Chip label={item} style={{ backgroundColor: '#2196F3', color: 'white' }} />
                                                            ) : item === 'Đang thực hiện' ? (
                                                                <Chip label={item} style={{ backgroundColor: '#e5cb24', color: 'black' }} />
                                                            ) : item === 'Hoàn thành' ? (
                                                                <Chip label={item} style={{ backgroundColor: 'green', color: 'white' }} />
                                                            ) : item === 'Hủy' ? (
                                                                <Chip label={item} style={{ backgroundColor: '#c50f0f', color: 'white' }} />
                                                            ) : (
                                                                item
                                                            )
                                                        ) : idx === 7 ? (
                                                            item === 'Thấp' ? (
                                                                <Chip label={item} style={{ backgroundColor: '#c50f0f', color: 'white' }} />
                                                            ) : item === 'Trung bình' ? (
                                                                <Chip label={item} style={{ backgroundColor: '#e5cb24', color: 'black' }} />
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
                                            <StyledTableCell align="center" width="10%">
                                                <Box display='flex' gap={1} alignItems='left' justifyContent='left'>
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
                                                    {isButtonEdit && userID === row?.[7] &&
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
