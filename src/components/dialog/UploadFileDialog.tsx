import { Box, Button, useTheme } from "@mui/material";
import { useState } from "react";
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControlLabel,
    Grid,
    IconButton,
    Input,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField
} from '@mui/material';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';

export default function UploadFileDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id, handlSaveFile } = props
    const theme = useTheme()
    const [file, setFile] = useState<File | null>(null);
    return (
        <>

            <Dialog
                maxWidth='md'
                fullWidth
                open={open}
                onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant='h3'>{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 3 }} >


                    <Box sx={{ width: '100%', }}>
                        <Box sx={{
                            height: { xs: '80px', md: '220px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 2,
                            border: `1px dashed ${theme.palette.primary.main}`
                        }} >
                            {file?.name ?
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <rect width="16" height="9" x="28" y="15" fill="#21a366"></rect><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"></path><rect width="16" height="9" x="28" y="24" fill="#107c42"></rect><rect width="16" height="9" x="12" y="15" fill="#3fa071"></rect><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"></path><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"></path><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"></path><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"></path><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"></path><linearGradient id="flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="1" stop-color="#0b6731"></stop></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"></path><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"></path>
                                    </svg>
                                    <Typography>{file?.name}</Typography>
                                </>
                                :
                                <Typography>Chưa có tệp được chọn</Typography>
                            }

                        </Box>
                        <form className='form'>

                            <input
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                onChange={(event: any) => setFile(event.target.files[0])}
                                type="file"
                            />
                        </form>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 4 }}>
                    <Box sx={{ width: '100%' }} >

                        {file ?

                            <Button variant="contained" size='large' fullWidth component='span' onClick={() => handlSaveFile!(file)}>
                                Lưu
                            </Button>
                            :
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" size='large' fullWidth component='span'>
                                    Tải file từ máy tính
                                </Button>
                            </label>
                        }
                    </Box>
                </DialogActions>
            </Dialog >
        </>
    )
}
