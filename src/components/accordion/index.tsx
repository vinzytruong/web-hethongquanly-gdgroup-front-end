import { useState, SyntheticEvent, CSSProperties, useMemo, useEffect, use } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Typography, Box, Button, Stack } from '@mui/material';
import TableCustomizePaginationMobile from '@/components/table/TablePaginationMobile';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { AnyObject } from 'yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import React, { ReactNode, FC } from 'react';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:nth-last-of-type(2)': {
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
    },
    '&:first-of-type': {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
    },
    '&:not(:nth-last-child(2))': {
        borderBottom: 'none',
    },
    '&::before': {
        display: 'none',
    },
}));


const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, 0)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(2),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface AProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

interface CustomizedAccordionsProps extends AProps {
    contentSearch: string;
    pathDisplayField: string;
    fieldContainsId: string;
    showMoreOption: boolean;
    autoShow: boolean;
    initRow: { path: string; isBoolean: boolean; label: string }[];
    rows: AnyObject[];
    open: boolean;
    handleViewId: (id: any) => void;
    handleOpenCard: (open: boolean) => void;
}

const CustomizedAccordions: React.FC<CustomizedAccordionsProps> = ({
    children,
    className,
    style,
    contentSearch,
    fieldContainsId,
    pathDisplayField,
    showMoreOption,
    autoShow,
    open,
    initRow,
    rows,
    handleViewId,
    handleOpenCard
}) => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expanded, setExpanded] = useState<string | false>('panel');

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

    const visibleRows = useMemo(() => {
        const filteredRows = rows.filter(handleSearch);
        return filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [page, rows, rowsPerPage, contentSearch]);

    const handleChange = (panel: string, id: number) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
        handleViewItem(id)
    };

    const handleViewItem = (id: any) => {
        handleViewId(id);
        handleOpenCard(true);
        return null
    };

    useEffect(() => {
        open === false && setExpanded(false)
    }, [open])

    function getNestedValue(obj: any, path: string): any {
        if (typeof path !== 'string') {
            throw new TypeError('path phải là chuỗi');
        }

        const pathParts = path.split('.');
        return pathParts.reduce((currentObject, key, index, parts) => {
            if (currentObject === null || currentObject === undefined) return null;

            const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
            if (arrayMatch) {
                const arrayKey = arrayMatch[1];
                const arrayIndex = parseInt(arrayMatch[2], 10);
                return currentObject[arrayKey] && Array.isArray(currentObject[arrayKey]) ? currentObject[arrayKey][arrayIndex] : null;
            }

            const allArrayMatch = key.match(/^(\w+)\[\]$/);         // Còn lỗi đối với hiển thị tất cả danh sách
            if (allArrayMatch) {
                const arrayKey = allArrayMatch[1];
                if (currentObject[arrayKey] && Array.isArray(currentObject[arrayKey])) {
                    const subPath = parts.slice(index + 1).join('.');
                    return currentObject[arrayKey].map((item: any) => subPath ? getNestedValue(item, subPath) : item);
                }
            }
            return currentObject[key];
        }, obj);
    }

    return (
        <div className={className} style={style}>
            {visibleRows.map((row: any, index: number) => (
                <Accordion sx={{ width: '100%' }} key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`, getNestedValue(row, fieldContainsId))}>
                    <AccordionSummary aria-controls={`panel${index}d-context`} id={`panel${index}d-header`} expandIcon={<ExpandMoreIcon />}>
                        <Typography>{getNestedValue(row, pathDisplayField)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {initRow.map((item) => {
                                const value = getNestedValue(row, item.path);
                                return (
                                    <>
                                        <ListItem key={item.path} disablePadding>
                                            <Stack direction="row" spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
                                                <Box sx={{ width: '30%' }}>
                                                    <Typography>{item.label}:</Typography>
                                                </Box>
                                                <Box sx={{ width: '70%' }}>
                                                    {item.isBoolean ?
                                                        <Typography>{value ? 'Có' : 'Không'}</Typography> :
                                                        (Array.isArray(value) ?
                                                            value.map((val, idx) => <Typography key={idx}>{val}</Typography>) :
                                                            <Box
                                                                style={{
                                                                    width: '250px',
                                                                    whiteSpace: 'wrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}
                                                            >
                                                                <Typography>
                                                                    {value || 'Chưa có dữ liệu'}
                                                                </Typography>
                                                            </Box>)
                                                    }
                                                </Box>
                                            </Stack>
                                        </ListItem>
                                        <Divider />
                                    </>
                                );
                            })}
                        </List>
                        {children}
                    </AccordionDetails>
                </Accordion>
            ))}


            <TableCustomizePaginationMobile
                handlePage={setPage}
                handleRowsPerPage={setRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                rows={rows}
            />
        </div >
    );
};

export default CustomizedAccordions;