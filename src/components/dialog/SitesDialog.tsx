import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialogSites } from '@/interfaces/dialog';
import { StyledButton } from '../styled-button';
import useSites from '@/hooks/useSites';
import { Sites } from '@/interfaces/site';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import useStorage from '@/hooks/useStorage';
import { CKEditor } from 'ckeditor4-react';
import { getDownloadURL } from 'firebase/storage';
import { useRef, useState } from 'react';
import SnackbarAlert from '../alert';
import { getPathStorageFromUrl } from '../utils/convertUrlToPath';
import moment from 'moment';

export default function SitesDialog(props: PropsDialogSites) {
    
    const theme = useTheme()
    const editorRef = useRef<any>(null);
    const { buttonText, field, title, action, defaulValue, isEdit, isInsert, handleAlertContent, handleOpenAlert } = props
    const { uploadFile, deleteFile } = useStorage()
    const { addSite, dataSites, editSite } = useSites();
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertContent, setAlertContent] = useState({ type: '', message: '' })
    const [formData, setFormData] = useState<Sites | undefined>(defaulValue ? defaulValue : undefined);
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

    const handleAdd = (e: any) => {
        e.preventDefault();
        setOpenAlert(true)
        setLoaing(true)
        const uploadTask = uploadFile(image, "dulichcauke/sites");
        uploadTask.on('state_changed',
            (snapshot) => {
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused')
                        break;
                    case 'running':
                        const percentLoad = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(percentLoad)
                        break;
                }
            },
            (error) => {
                alert("Tải hình ảnh thất bại: " + error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const result = await addSite({
                        id: defaulValue ? defaulValue.id : dataSites.sites.length,
                        idDoc: defaulValue ? defaulValue.idDoc : (dataSites.sites.length).toString(),
                        photo: downloadURL,
                        name: formData!.name,
                        category: formData!.category,
                        address: formData!.address,
                        description: formData!.description,
                        isPopular: Boolean(formData!.isPopular),
                        detail: formData!.detail,
                        createdTime: moment().format('LLL').toString()
                    })
                    setLoaing(false)
                    setFormData(undefined)
                    setImage(null)
                    handleClose()
                    handleOpenAlert(true);
                    handleAlertContent(result)
                });
            }
        )
    }

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        setOpenAlert(true)
        setLoaing(true);
        const dataUpdate: any = {}
        if (formData!.name !== defaulValue?.name) dataUpdate.name = formData?.name
        if (formData!.category !== defaulValue?.category) dataUpdate.category = formData?.category
        if (formData!.address !== defaulValue?.address) dataUpdate.address = formData?.address
        if (formData!.description !== defaulValue?.description) dataUpdate.description = formData?.description
        if (formData!.isPopular !== defaulValue?.isPopular) dataUpdate.isPopular = formData?.isPopular
        if (formData!.detail !== defaulValue?.detail) dataUpdate.detail = formData?.detail
        dataUpdate.createdTime = moment().format('LLL').toString()
        if (image) {
            await deleteFile(getPathStorageFromUrl(defaulValue?.photo!))
            const uploadTask = uploadFile(image, "dulichcauke/sites");
            uploadTask.on('state_changed',
                (snapshot) => {
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused')
                            break;
                        case 'running':
                            const percentLoad = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(percentLoad)
                            break;
                    }
                },
                (error) => {
                    alert("Tải hình ảnh thất bại: " + error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await editSite(defaulValue?.id, { photo: downloadURL })
                        const result = await editSite(defaulValue?.id, dataUpdate)
                        setLoaing(false)
                        setFormData(undefined)
                        setImage(null)
                        handleClose()
                        handleOpenAlert(true);
                        handleAlertContent(result)
                    });
                }
            )
        }
        const result = await editSite(defaulValue?.id, dataUpdate)
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

    const renderImage = () => {
        console.log('render', defaulValue?.photo);
        if (image) {
            const uploadImage = URL.createObjectURL(new Blob([image!], { type: image?.type }))
            console.log("upload", uploadImage);
            return uploadImage;
        }
        else if (defaulValue?.photo) return defaulValue?.photo
        return '/images/no-data-1.png'
    }


    const steps = ['Tải ảnh lên', 'Nhập thông tin địa điểm', 'Nhập nội dung bài viết'];
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
                                        <>
                                            <Box sx={{ width: '100%', }}>
                                                <Box sx={{
                                                    pb: { xs: 8, md: 10 },
                                                    mb: 3,
                                                    height: { xs: '100px', md: '440px' },
                                                    width: '100%',
                                                    backgroundSize: 'cover',
                                                    objectFit: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    backgroundImage: `url('${renderImage()}')`,
                                                    borderRadius: 2,
                                                    border: `1px dashed ${theme.palette.primary.main}`
                                                }} />
                                                <form className='form'>

                                                    <input
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        id="raised-button-file"
                                                        multiple
                                                        onChange={(event: any) => setImage(event.target.files[0])}
                                                        type="file"
                                                    />
                                                </form>
                                            </Box>
                                            <Box sx={{ width: '100%' }} >
                                                <label htmlFor="raised-button-file">
                                                    <Button variant="outlined" size='large' fullWidth component="span" >
                                                        Tải ảnh lên
                                                    </Button>
                                                </label>
                                            </Box>
                                        </>
                                    }
                                    {activeStep === 1 &&
                                        <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap='12px'>
                                            <Box style={{ width: '100%' }}>
                                                <Typography>Tên địa điểm</Typography>
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
                                            <Grid container spacing={3}>
                                                <Grid item md={6}>
                                                    <Box style={{ width: '100%' }}>
                                                        <Typography>Loại</Typography>
                                                        <Select
                                                            defaultValue={defaulValue?.category}
                                                            name='category'
                                                            value={formData?.category}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        >
                                                            <MenuItem value={'di-tich-lich-su-cap-tinh'}>Di tích lịch sử cấp tỉnh</MenuItem>
                                                            <MenuItem value={'di-tich-lich-su'}>Di tích lịch sử</MenuItem>
                                                            <MenuItem value={'di-tich-kien-truc-cap-tinh'}>Di tích kiến trúc cấp tỉnh</MenuItem>
                                                            <MenuItem value={'di-tich-kien-truc-cap-quoc-gia'}>Di tích kiến trúc cấp quốc gia</MenuItem>
                                                            <MenuItem value={'dia-diem-du-lich'}>Địa điểm du lịch</MenuItem>

                                                        </Select>
                                                    </Box>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <Box style={{ width: '100%' }}>
                                                        <Typography>Phổ biến</Typography>
                                                        <RadioGroup
                                                            name='isPopular'
                                                            defaultValue={defaulValue?.isPopular}
                                                            value={formData?.isPopular}
                                                            onChange={handleChange}
                                                            row
                                                        >
                                                            <FormControlLabel value={true} control={<Radio />} label="Phổ biến" />
                                                            <FormControlLabel value={false} control={<Radio />} label="Bình thường" />
                                                        </RadioGroup>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Box style={{ width: '100%' }}>
                                                <Typography>Mô tả</Typography>
                                                <OutlinedInput
                                                    name='description'
                                                    defaultValue={defaulValue?.description}
                                                    style={{ width: '100%' }}
                                                    value={formData?.description}
                                                    multiline
                                                    minRows={5}
                                                    onChange={handleChange}
                                                />
                                            </Box>
                                        </Box>
                                    }
                                    {activeStep === 2 &&
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
                                                        removePlugins: 'bottomarea',

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
                                // color="inherit"
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