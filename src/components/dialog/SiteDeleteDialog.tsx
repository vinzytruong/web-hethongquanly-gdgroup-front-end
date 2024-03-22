import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PropsDialog } from '@/interfaces/dialog';
import { Typography } from '@mui/material';
import { StyledButton } from '../styled-button';
import useSites from '@/hooks/useSites';
import { useState } from 'react';
import SnackbarAlert from '../alert';

export default function SiteDeleteDialog(props: PropsDialog) {
    const { buttonText, field, handleAlertContent, title, id, handleOpenAlert } = props
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState({ type: '', message: '' })

    const { removeSite, dataSites } = useSites()
    console.log(dataSites);

    const handleClick = async (id: any) => {
        const result = await removeSite(id)
        console.log(result.message);
        handleOpenAlert(true)
        handleAlertContent(result)
        setOpen(false)
    };

    return (
        <>
            <StyledButton
                onClick={() => setOpen(true)}
                variant='outlined'
                size='large'>
                {buttonText}
            </StyledButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant='h5'>{title}</Typography>
                </DialogTitle>
                <DialogContent sx={{ padding: 3 }}>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant='body1'>Khi đã xoá sẽ không thể khôi phục. Bạn có chắc muốn xoá địa điểm này hay không? </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 3 }}>
                    <Button variant='contained' onClick={() => handleClick(id)} autoFocus>
                        Xoá
                    </Button>
                    <Button variant='outlined' onClick={() => setOpen(false)}>Huỷ</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}