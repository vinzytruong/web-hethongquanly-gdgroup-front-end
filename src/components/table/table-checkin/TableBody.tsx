import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

interface BodyDataProps {
    handleView: (e: any) => void;
    handleEdit?: (e: any) => void;
    handleOpenCard: (e: any) => void;
    data: any[];
    page: number;
    rowsPerPage: number
    editLink?: string
    viewLink: string,
    isAdmin: boolean
}

const TableBodyCheckin = (props: BodyDataProps) => {
    const { data, handleEdit, handleView, page, rowsPerPage, editLink, viewLink, isAdmin, handleOpenCard } = props
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;


    const theme = useTheme()

    return (
        <TableBody>
            {data?.map((row: any, index: any) => (
                <TableRow
                    hover

                    // role="checkbox"
                    // tabIndex={-1}
                    key={row.personID}
                    sx={{ border: 1, borderColor: theme.palette.text.secondary }}
                >
                    <StyledTableCell padding="normal" sx={{ border: 1, borderColor: theme.palette.text.secondary }}>{page > 0 ? (page * (rowsPerPage) + index + 1) : index + 1}</StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: 1, borderColor: theme.palette.text.secondary }}><Box width={180}>{row.name ? row.name : 'Chưa có dữ liệu'}</Box></StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: 1, borderColor: theme.palette.text.secondary }}><Box width={140}>{'Chưa có dữ liệu'}</Box></StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: 1, borderColor: theme.palette.text.secondary }}><Box width={140}>{'Chưa có dữ liệu'}</Box></StyledTableCell>
                    {
                        row.dataCheckInTime.map((item: any, idx: any) => (
                            <StyledTableCell key={idx} align="center" sx={{ border: 1, borderColor: theme.palette.text.secondary }}><Box width={100}>{item.value[0] !== undefined ? `${dayjs(item.value[0]).format('hh:mm')} - ${dayjs(item.value[1]).format('hh:mm')}` : '-'}</Box></StyledTableCell>
                        ))
                    }
                </TableRow>
            ))}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>
    )
}
export default TableBodyCheckin;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 1,
        borderColor: theme.palette.text.secondary
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '24px',
        paddingBottom: '24px'
    },
}));