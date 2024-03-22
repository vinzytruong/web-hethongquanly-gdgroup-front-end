import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/router';
import { Box, Container, Skeleton } from '@mui/material';
import useProduct from '@/hooks/useProduct';
import useSites from '@/hooks/useSites';
import { AdminLayout } from '@/components/layout';

export default function AdminHome() {
    const [uid, setUid] = useState<string>();
    const router = useRouter()


    return (
        <AdminLayout>

            <Box padding="12px">
                Giao diện trang chủ
            </Box>

        </AdminLayout>

    );
}