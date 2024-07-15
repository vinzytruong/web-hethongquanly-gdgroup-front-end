import React, { useEffect, useState } from 'react';
import { Box, CardContent, Container, Grid, Skeleton, useTheme } from '@mui/material';
import { AdminLayout } from '@/components/layout';
import useStaff from '@/hooks/useStaff';
import TotalStaffCard from '@/components/card/TotalStaffCard';
import ProductChart from '@/components/chart/ProductChart';
import TotalTaskCard from '@/components/card/TotalTaskCard';
import TotalCustomerCard from '@/components/card/TotalCustomerCard';
import TotalProductCard from '@/components/card/TotalProductCard';
import MainCard from '@/components/card/MainCard';
import BajajAreaChartCard from '@/components/chart/CustomerChart';
import useWork from '@/hooks/useWork';

export default function AdminHome() {
    const theme = useTheme()
    const { dataStaff } = useStaff()
    const { dataWork, deleteMulWork, getAllWork, getAssignedWork } = useWork()
    const [id, setId] = React.useState(0);

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!);
        setId(account?.userID);
        getAssignedWork()
    }, []);

    console.log('dataWork', dataWork);
    return (
        <AdminLayout>
            <Box padding="24px" width='100%'>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={4}>
                        <TotalStaffCard isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TotalTaskCard
                            isLoading={false}
                            data={dataWork
                                .filter((item: any) => item.nguoiThucHienID === id)
                                .filter(item => {
                                    if (item.lichSuCongViec.length === 0) {
                                        return true;
                                    }
                                    return item?.lichSuCongViec[item.lichSuCongViec?.length - 1].trangThaiID !== 2;
                                })}
                        />

                    </Grid>
                    {/* <Grid item xs={6} md={3}>
                        <TotalProductCard isLoading={false} data={dataStaff} />
                    </Grid> */}
                    <Grid item xs={6} md={4}>
                        <TotalCustomerCard isLoading={false} data={dataStaff} />
                    </Grid>
                </Grid>
                <Grid container spacing={3} pt={3}>
                    <Grid item md={9}>
                        <MainCard content={false}>
                            <CardContent>
                                <BajajAreaChartCard />
                            </CardContent>
                        </MainCard>
                    </Grid>
                    <Grid item md={3}>
                        <MainCard content={false}>
                            <CardContent>
                                <ProductChart />
                            </CardContent>
                        </MainCard>
                    </Grid>
                </Grid>
            </Box>
        </AdminLayout>
    );
}