import { Avatar, Box, Typography, styled } from "@mui/material";
import { LazyMotion, m } from "framer-motion";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";

// eslint-disable-next-line import/extensions
const loadFeatures = () => import('./Feature').then((res) => res.default);
interface Props {
    children: ReactNode
}
export const LoadingAnimation: FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hiển thị loading
        setLoading(true);

        // Ẩn đi loading sau 1 giây
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 500);

        // // Chuyển hướng sau khi ẩn đi loading
        // const redirectTimeout = setTimeout(() => {
        //     history.push('/login');
        // }, 2000); // Chuyển hướng sau 2 giây

        return () => {
            clearTimeout(timeout);
            // clearTimeout(redirectTimeout);
        };
    }, []);
    // router.asPath==='/auth/login'
    return (
        <LazyMotion features={loadFeatures}>
            {loading ? (
                <RootStyle>
                    <m.div
                        animate={{
                            scale: [1, 0.9, 0.9, 1, 1],
                            opacity: [1, 0.48, 0.48, 1, 1],
                        }}
                        transition={{
                            duration: 2,
                            ease: 'easeInOut',
                            repeatDelay: 1,
                            repeat: Infinity,
                            times: [0, 0.2, 0.5, 0.8, 1]
                        }}
                    >
                        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                            <Avatar variant="square" alt="GD Việt Nam" src="/favicon/logo-gd-group-300x300.png" sx={{ width: 240, height: 240 }} />
                            <Typography>Đang tải ...</Typography>
                        </Box>
                    </m.div>
                </RootStyle>
            ) : (
                children
            )}
        </LazyMotion>
    );
};
const RootStyle = styled('div')(({ theme }) => ({
    right: 0,
    bottom: 0,
    zIndex: 99999,
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));
