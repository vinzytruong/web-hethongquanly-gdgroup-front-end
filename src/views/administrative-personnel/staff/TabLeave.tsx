import { Box, Grid, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import TotalItemCard from '@/components/card/TotalItemCard';
import useLeaves from "@/hooks/useLeave";

export default function TabPosition({ rows }: any) {
    const theme = useTheme()
    const { dataNgayNghiPhep, getStatusDayLeaveOfStaff } = useLeaves()
    useEffect(() => {
        getStatusDayLeaveOfStaff(rows?.nhanVienID)
    }, [])

    return (
        <Box
            display='flex'
            flexDirection='row'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            padding={2} gap={2}>
            <Grid container spacing={2}>
                <Grid item md={6} lg={6}>
                    <TotalItemCard isLoading={false} title="Số ngày phép cả năm" data={dataNgayNghiPhep?.phepNam} />
                </Grid>
                <Grid item md={6} lg={6}>
                    <TotalItemCard isLoading={false} title="Số ngày phép được sử dụng" data={typeof dataNgayNghiPhep?.phepDuocSuDung !== undefined && Number(dataNgayNghiPhep?.phepDuocSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepDuocSuDung} />
                </Grid>
                <Grid item md={6} lg={6}>
                    <TotalItemCard isLoading={false} title="Số ngày phép đã sử dụng" data={dataNgayNghiPhep?.phepDaSuDung} />
                </Grid>
                <Grid item md={6} lg={6}>
                    <TotalItemCard isLoading={false} title="Số ngày phép có thể sử dụng" data={Number(dataNgayNghiPhep?.phepCoTheSuDung) < 0 ? 0 : dataNgayNghiPhep?.phepCoTheSuDung} />
                </Grid>
            </Grid>
        </Box>
    )
}