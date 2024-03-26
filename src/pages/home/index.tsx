import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/router';
import { Box, Container, Grid, Skeleton, useTheme } from '@mui/material';
import { AdminLayout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import useConfig from '@/hooks/useConfig';
import useStaff from '@/hooks/useStaff';
import CardStaff from '../../components/card/TotalStaffCard';
import CardTask from '../../components/card/TotalTaskCard';
import CardCustomer from '../../components/card/TotalCustomerCard';
import CardProduct from '../../components/card/TotalProductCard';
import TotalGrowthBarChart from '@/components/chart/TotalGrowthBarChart';
import PopularCard from '@/components/card/PopularCard';
// import PopularCard from '@/components/card/PopularCard';
// import TotalGrowthBarChart from '@/components/chart/TotalGrowthBarChart';

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
                        <CardStaff isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
                        <CardTask isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
                        <CardCustomer isLoading={false} data={dataStaff} />
                    </Grid>
                    <Grid item md={3}>
                        <CardProduct isLoading={false} data={dataStaff} />
                    </Grid>
                </Grid>

                <Grid container spacing={3} pt={3}>
                    <Grid item md={9}>
                        <TotalGrowthBarChart />
                    </Grid>
                    <Grid item md={3}>
                        <PopularCard />
                    </Grid>
                </Grid>
            </Box>
        </AdminLayout>

    );
}