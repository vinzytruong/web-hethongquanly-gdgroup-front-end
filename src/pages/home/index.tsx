import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/router';
import { Container, Skeleton } from '@mui/material';
import useProduct from '@/hooks/useProduct';
import useSites from '@/hooks/useSites';
import { AdminLayout } from '@/components/layout';

export default function AdminHome() {
    const [uid, setUid] = useState<string>();
    const router = useRouter()


    return (
        <AdminLayout>
            
                Home
            
        </AdminLayout>

    );
}