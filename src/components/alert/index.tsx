import { Alert, Snackbar } from "@mui/material";

interface MessageAlertProps {
    type: string,
    message: string,
    openAlert: boolean,
    setOpenAlert: (e:boolean) => void
}
const SnackbarAlert = ({ message, type, setOpenAlert, openAlert }: MessageAlertProps) => {
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpenAlert(false);
    };
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={handleCloseAlert}
        >
            <Alert
                onClose={handleCloseAlert}
                severity={type === 'success' ? 'success' : 'error'}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
export default SnackbarAlert