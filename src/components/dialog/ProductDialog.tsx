import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialogProducts, PropsDialogSites } from '@/interfaces/dialog';
import { StyledButton } from '../styled-button';
import { LoadingButton } from '@mui/lab';
import useStorage from '@/hooks/useStorage';
import { CKEditor } from 'ckeditor4-react';
import { useRef, useState } from 'react';
import useProduct from '@/hooks/useProduct';
import { Product } from '@/interfaces/product';
import moment from 'moment';

export default function ProductDialog(props: PropsDialogProducts) {
    const theme = useTheme()
    const editorRef = useRef<any>(null);
    const { buttonText, field, title, action, defaulValue, isEdit, isInsert, handleAlertContent, handleOpenAlert } = props
    const { uploadFile, deleteFile } = useStorage()
    const { addProduct, dataProduct, editProduct } = useProduct();
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState({ type: '', message: '' })
    const [formData, setFormData] = useState<Product | undefined>(defaulValue ? defaulValue : undefined);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoaing] = useState<boolean>(false)
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleChange = (e: any) => {
        if (e.target) {
            console.log(e.target.name);
            setFormData((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
        else {
            console.log(e.editor.name);
            setFormData((prevState: any) => ({
                ...prevState,
                [e.editor.name]: e.editor.getData()
            }));
        }
    };

    const handleAdd = async (e: any) => {
        e.preventDefault();
        setOpenAlert(true)
        setLoaing(true)
        
        const result = await addProduct({
            id: defaulValue ? defaulValue.id : dataProduct.products.length,
            idDoc: defaulValue ? defaulValue.idDoc : (dataProduct.products.length).toString(),
            name: formData!.name,
            address: formData!.address,
            detail: formData!.detail,
            author: formData!.author,
            star: Number(formData!.star),
            createdTime: moment().format('LLL')
        })

        setLoaing(false)
        setFormData(undefined)
        setImage(null)
        handleClose()
        handleOpenAlert(true);
        handleAlertContent(result)
    }

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        setOpenAlert(true)
        setLoaing(true);
        const dataUpdate: any = {}
        if (formData!.name !== defaulValue?.name) dataUpdate.name = formData?.name
        if (formData!.address !== defaulValue?.address) dataUpdate.address = formData?.address
        if (formData!.detail !== defaulValue?.detail) dataUpdate.detail = formData?.detail
        if (formData!.author !== defaulValue?.author) dataUpdate.author = formData?.author
        if (formData!.star !== defaulValue?.star) dataUpdate.star = formData?.star
        if (formData!.createdTime !== defaulValue?.createdTime) dataUpdate.createdTime = dataUpdate.createdTime
        const result = await editProduct(defaulValue?.id, dataUpdate)
        setLoaing(false)
        setFormData(undefined);
        setImage(null)
        handleClose()
        handleOpenAlert(true);
        handleAlertContent(result)
    }

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    const steps = ['Nhập thông tin địa điểm', 'Nhập nội dung bài viết'];
    const textHtml = defaulValue?.detail ? defaulValue.detail : '<p>Nhập nội dung</p>'

    return (
        <>
            <StyledButton
                onClick={handleOpen}
                variant='contained'
                size='large'
            >
                {buttonText}
            </StyledButton>
            <Dialog
                maxWidth='lg'
                fullWidth
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant='h3'>{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 3 }} >
                    <Grid container spacing={3}>
                        <Grid item sm={12} md={3}>
                            <Stepper activeStep={activeStep} orientation='vertical'>
                                {steps.map((label, index) => {
                                    const stepProps: { completed?: boolean } = {};
                                    const labelProps: {
                                        optional?: React.ReactNode;
                                    } = {};

                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                        </Grid>
                        <Grid item sm={12} md={9}>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        All steps completed - you&apos;re finished
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>Reset</Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>

                                    {activeStep === 0 &&
                                        <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap='12px'>
                                            <Box style={{ width: '100%' }}>
                                                <Typography>Tên sản phẩm</Typography>
                                                <OutlinedInput
                                                    name='name'
                                                    defaultValue={defaulValue?.name}
                                                    style={{ width: '100%' }}
                                                    value={formData?.name}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                            <Box style={{ width: '100%' }}>
                                                <Typography>Địa chỉ</Typography>
                                                <OutlinedInput
                                                    name='address'
                                                    defaultValue={defaulValue?.address}
                                                    style={{ width: '100%' }}
                                                    value={formData?.address}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                            <Box display='flex' justifyContent='space-between' alignItems='flex-start' width='100%' gap={3}>
                                                <Box style={{ width: '100%' }}>
                                                    <Typography>Chủ sở hữu</Typography>
                                                    <OutlinedInput
                                                        name='author'
                                                        defaultValue={defaulValue?.author}
                                                        style={{ width: '100%' }}
                                                        value={formData?.author}
                                                        onChange={handleChange}
                                                    />
                                                </Box>
                                                <Box style={{ width: '100%' }}>
                                                    <Typography>Đánh giá</Typography>
                                                    <Rating
                                                        name='star'
                                                        defaultValue={defaulValue?.star}
                                                        value={formData?.star}
                                                        onChange={handleChange}
                                                        size='large'
                                                        sx={{ pt: 1 }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                    {activeStep === 1 &&
                                        <Box display='flex' justifyContent='flex-end' alignItems='flex-end' flexDirection='column' gap={2}>
                                            <div style={{
                                                width: '100%',
                                                borderRadius: '24px'
                                            }}>
                                                <CKEditor
                                                    editorUrl="../ckeditor/ckeditor.js"
                                                    name='detail'
                                                    config={{
                                                        resize_enabled: false,
                                                        removePlugins: 'bottomarea'
                                                    }}
                                                    onChange={handleChange}
                                                    initData={textHtml}
                                                />
                                            </div>
                                        </Box>
                                    }
                                </React.Fragment>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {activeStep !== steps.length &&
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                variant='outlined'
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Quay lại
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {
                                activeStep === steps.length - 1 ?
                                    <>
                                        {isEdit &&
                                            <LoadingButton
                                                sx={{ p: '12px 24px' }}
                                                onClick={handleUpdate}
                                                loading={loading}
                                                variant='contained'
                                                size='large'
                                            >
                                                Cập nhật
                                            </LoadingButton>
                                        }
                                        {isInsert &&
                                            <LoadingButton
                                                sx={{ p: '12px 24px' }}
                                                onClick={handleAdd}
                                                loading={loading}
                                                variant="contained"
                                                size='large'
                                            >
                                                Lưu
                                            </LoadingButton>
                                        }
                                    </>
                                    :
                                    <StyledButton
                                        variant='contained'
                                        size='large'
                                        onClick={handleNext}
                                    >
                                        Tiếp tục
                                    </StyledButton>
                            }
                        </Box>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}