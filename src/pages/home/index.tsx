import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/router';
import { Box, Container, Skeleton, useTheme } from '@mui/material';
import useProduct from '@/hooks/useProduct';
import useSites from '@/hooks/useSites';
import { AdminLayout } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import useConfig from '@/hooks/useConfig';

export default function AdminHome() {
    const [uid, setUid] = useState<string>();
    const router = useRouter()
    const { t } = useTranslation();
    const { mode, onChangeMode} = useConfig();
    console.log("HELLO",mode);
const theme=useTheme()
    return (
        <AdminLayout>

            <Box padding="12px">
            {theme.palette.mode}
                Giao diện {t('Home')}
            </Box>

        </AdminLayout>

    );
}