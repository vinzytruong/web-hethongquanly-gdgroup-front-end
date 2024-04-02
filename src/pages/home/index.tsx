import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CardContent, Container, Grid, Skeleton, useTheme } from '@mui/material';
import { AdminLayout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import useConfig from '@/hooks/useConfig';
import useStaff from '@/hooks/useStaff';
import TotalStaffCard from '@/components/card/TotalStaffCard';
import ProductChart from '@/components/chart/ProductChart';
import TotalTaskCard from '@/components/card/TotalTaskCard';
import TotalCustomerCard from '@/components/card/TotalCustomerCard';
import TotalProductCard from '@/components/card/TotalProductCard';
import MainCard from '@/components/card/MainCard';
import BajajAreaChartCard from '@/components/chart/CustomerChart';

export default function AdminHome() {
    const [uid, setUid] = useState<string>();
    const router = useRouter()
    const { t } = useTranslation();
    const { mode, onChangeMode } = useConfig();

    const theme = useTheme()

    const { getAllStaff, dataStaff } = useStaff()
    useEffect(() => {
        getAllStaff()
    }, [getAllStaff])

    return (
        <AdminLayout>
            <Box padding="24px" width='100%'>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <TotalStaffCard isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
                        <TotalTaskCard isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
                        <TotalProductCard isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
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