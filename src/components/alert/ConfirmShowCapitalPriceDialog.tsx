import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
export interface Props {
    title: string,
    openConfirm: boolean,
    message?: string,
    handleOpenConfirmDialog: (e: boolean) => void,
    onHandleShowCapitalPrice: (isShowGiaVon: string) => void,
}
export default function ConfirmShowCapitalPriceDialog({ title, openConfirm, onHandleShowCapitalPrice, handleOpenConfirmDialog, message }: Props) {
    const handleClickConfirmShow = () => {
        onHandleShowCapitalPrice("true")
        handleOpenConfirmDialog(false);

    };
    const handleClickConfirmNotShow = () => {
        onHandleShowCapitalPrice("false")
        handleOpenConfirmDialog(false);
    };
    const handleClose = () => {
        handleOpenConfirmDialog(false);
    };
    return (
        <React.Fragment>
            <Dialog
                open={openConfirm}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography sx={{ color: "black" }}>{message}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickConfirmShow}>Có</Button>
                    <Button onClick={handleClickConfirmNotShow} sx={{ color: 'black' }}>
                        Không
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}