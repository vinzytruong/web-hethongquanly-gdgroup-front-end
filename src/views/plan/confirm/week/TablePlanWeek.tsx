import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useMemo, useState } from 'react';
import { Button, Checkbox, Chip, ClickAwayListener, Fade, Grid, IconButton, Paper, Popper, PopperPlacementType, Switch, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { IconChevronRight, IconDotsVertical, IconInfoSquare } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import EnhancedTableToolbar from '@/components/table/table-custom/TableTool';
import { StyledTableCell } from '@/components/table/table-custom/TableCell';
import TableCustomizePagination from '@/components/table/TablePagination';
import { Order, PropsTable } from '@/components/table/table-custom/type';
import { PlanWeek } from '@/interfaces/plan';
import { StyledButton } from '@/components/styled-button';
import CustomDialog from '@/components/dialog/CustomDialog';
import usePlanWeek from '@/hooks/usePlanWeek';
import { toast } from 'react-toastify';
import usePlanMonth from '@/hooks/usePlanMonth';
import { IconEye } from '@tabler/icons-react';
import useRoleLocalStorage from '@/hooks/useRoleLocalStorage';

export interface EnhancedTableProps {
    headCells: any;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    return (
        <TableHead>
            <TableRow>
                {props?.headCells.map((headCell: any, idx: any) => (
                    <StyledTableCell
                        key={idx}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function TablePlanWeek(props: PropsTable) {
    const { title, handleOpenCard, handleViewId, rows, orderByKey, head, handleSelected, selected, handleDelete } = props
    const theme = useTheme()
    const router = useRouter()

    const { confirmPlanWeek } = usePlanWeek()
    const { dataPlanMonth, getAllPlanMonth } = usePlanMonth()
    const { userID, roleName } = useRoleLocalStorage()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [placement, setPlacement] = useState<PopperPlacementType>();
    const [viewID, setViewID] = useState(0)

    const handleConfirm = async (event: React.ChangeEvent<HTMLInputElement>, tuanID: number, isApprove:boolean) => {
        const rs = await confirmPlanWeek(tuanID, isApprove)
        if (rs) toast.success("Thành công")
        else toast.error("Thất bại")
    };

    const visibleRows = useMemo(() => {
        return rows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        )
    }, [page, rows, rowsPerPage]);

    const handleViewItem = (e: any, id: any) => {
        setViewID(id)
        setOpenDialog(true)
        setOpen(0)
    }

    const handleClickShow = (e: any, newPlacement: PopperPlacementType, id: number) => {
        setOpen(id);
        setAnchorEl(e.currentTarget);
        setPlacement(newPlacement);
    };

    const infoByID: PlanWeek = visibleRows.find(item => item.tuanID === viewID)
    const isDisabled = infoByID?.nguoiDuyetID !== userID || infoByID?.isApprove

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
                            <EnhancedTableHead headCells={head} />
                            <TableBody>
                                {visibleRows.map((row: PlanWeek, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={Number(row.thangID)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <StyledTableCell align="left">Tuần {row.tuan_Thang ? row.tuan_Thang : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">Tháng {dataPlanMonth.find(item => item.thangID == row.thangID)?.thang}</StyledTableCell>
                                            <StyledTableCell align="left">{row.nam ? row.nam : 'Chưa có dữ liệu'}</StyledTableCell>
                                            <StyledTableCell align="left">{row.tieuDe ? row.tieuDe : "Chưa có dữ liệu"}</StyledTableCell>
                                            <StyledTableCell align="left">{row.createDate ? row.createDate : "Chưa có dữ liệu"}</StyledTableCell>
                                            <StyledTableCell align="left">{row.createBy ? row.createBy : "Chưa có dữ liệu"}</StyledTableCell>
                                            <StyledTableCell align="left">{row.isApprove}
                                                <Chip
                                                    label={row.isApprove === null ? "Chờ duyệt" : (row?.isApprove ? "Đã duyệt" : "Không duyệt")}
                                                    sx={{
                                                        backgroundColor: row.isApprove === null ? "#616161" : (row?.isApprove ? "#4CAF50" : "#F44336"),
                                                        color: theme.palette.primary.contrastText
                                                    }}

                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{row.nguoiDuyet ? row.nguoiDuyet : "Chưa có dữ liệu"}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                                                    <Button
                                                        variant='contained'
                                                        startIcon={<IconEye stroke={2} />}
                                                        size='large'
                                                        sx={{ textTransform: "none", borderRadius: "8px", boxShadow: 'none !important' }}
                                                        onClick={(e) => handleViewItem(e, row.tuanID)} >
                                                        Chi tiết
                                                    </Button>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <CustomDialog
                                size='md'
                                title={'Chi tiết'}
                                open={openDialog}
                                handleOpen={setOpenDialog}
                                content={
                                    <Grid container spacing={2}>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Tiêu đề:</span> {infoByID?.tieuDe}</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Tháng:</span> {dataPlanMonth.find(item => item.thangID == infoByID?.thangID)?.thang}</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Năm:</span> {infoByID?.nam}</Typography>
                                        </Grid>

                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Từ ngày:</span> {infoByID?.tuNgay?.slice(0, 10)}</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Đến ngày:</span> {infoByID?.denNgay?.slice(0, 10)}</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Tạo bởi:</span> {infoByID?.createBy}</Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Ngày tạo:</span> {infoByID?.createDate?.slice(0, 10)}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Trạng thái duyệt:</span> {infoByID?.isApprove ? "Đã duyệt" : "Chờ duyệt"}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Người duyệt:</span> {infoByID?.nguoiDuyet}</Typography>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Typography><span style={{ fontWeight: "bolder" }}>Nội dung:</span></Typography>
                                            <Box bgcolor={theme.palette.grey[100]} mt={1} borderRadius={"8px"} width={"100%"} p={2} border={1} borderColor={theme.palette.grey[400]}><div dangerouslySetInnerHTML={{ __html: infoByID?.noiDung! }}></div></Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: "flex-end"
                                            }}>
                                                {isDisabled === null &&
                                                    <Box sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        justifyContent: "flex-end"
                                                    }}>

                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: theme.palette.primary.main,
                                                                    boxShadow: "none",
                                                                }}
                                                                onClick={(e: any) => handleConfirm(e, infoByID.tuanID, true)}
                                                            >
                                                                Duyệt
                                                            </Button>
                                                        </Box><Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: "red",
                                                                    boxShadow: "none",
                                                                    '&:hover': {
                                                                        backgroundColor: "red"
                                                                    },
                                                                }}
                                                                onClick={(e: any) => handleConfirm(e, infoByID.tuanID, false)}>
                                                                Từ chối
                                                            </Button>
                                                        </Box>


                                                    </Box>
                                                }

                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            />
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
