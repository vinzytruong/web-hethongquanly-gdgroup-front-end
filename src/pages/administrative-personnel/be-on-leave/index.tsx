import React, { useCallback, useState } from 'react';
import HtmlEditor, {
    Toolbar,
    MediaResizing,
    ImageUpload,
    Item,
} from 'devextreme-react/html-editor';
import { saveAs } from 'file-saver';
import { markup, tabs, tabLabel } from './data';
import { AdminLayout } from '@/components/layout';
import { Box, Typography, Button, useTheme, CircularProgress, Grid } from '@mui/material';
import { StyledButton } from '@/components/styled-button';
import { IconPrinter } from '@tabler/icons-react';
import CustomizeTab from '@/components/tabs';
import TabHtmlEditor from './TabHtmlEditor';
import SearchSection from '@/components/search/SearrchSection';
import SearchNoButtonSection from '@/components/search/SearchNoButton';
import { IconEdit } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TableBodyOnLeave from '@/components/table/table-on-leave/TableBody';
import TableOnLeave from '@/components/table/table-on-leave/TableOnLeave';

export default function BeOnLeave() {
    const theme = useTheme()
    const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-17'));
    const [openEditor, setOpenEditor] = useState(false)
    return (
        <AdminLayout>
            <Box padding="24px" >
                <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' width='100%'>

                    <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                        Nghỉ phép
                    </Typography>




                    {openEditor ?
                        <Box sx={{ px: 3, py: 3 }} width='100%'>

                            <TabHtmlEditor />
                        </Box>
                        :
                        <Box sx={{ background: theme.palette.background.paper, px: 3, py: 3 }} width='100%'>
                            <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                                <Box display='flex' justifyContent='flex-start' alignItems='center' width='100%' gap={2}>
                                    {/* <SearchNoButtonSection /> */}

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker value={value} label="Từ ngày"
                                            onChange={(newValue) => setValue(newValue)} />
                                        <DatePicker value={value} label="Đến ngày"
                                            onChange={(newValue) => setValue(newValue)} />
                                    </LocalizationProvider>
                                </Box>

                                <StyledButton
                                    startIcon={<IconEdit stroke={2} />}
                                    variant="contained"
                                    size='large'
                                    onClick={() => setOpenEditor(true)}
                                >
                                    Viết đơn
                                </StyledButton>

                            </Box>
                            <TableOnLeave rows={[
                                {}, {}, {}
                            ]} isAdmin={true} />
                        </Box>
                    }









                </Box>
            </Box>
        </AdminLayout>
    );
}
