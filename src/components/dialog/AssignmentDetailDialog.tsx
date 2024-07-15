import Typography from '@mui/material/Typography';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControlLabel, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { ReactNode, useState } from 'react';
import { CreateWorkFileDto } from '@/interfaces/work';
import { apiPort } from '@/constant/api';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
export interface Props {
    title: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean,
    open: boolean,
    id?: number,
    idParent?: number,
    file?: File | null,
    content?: ReactNode,
    handleUploadFile?: (e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?: (e: any) => void,
    note?: string;
    fetchData?: () => void;
    size?: "xs" | "sm" | "md" | "lg" | "xl",
    fileCongViec?: CreateWorkFileDto[]
}


export default function AssignmentDetailDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, content, size, fileCongViec } = props
    const theme = useTheme()
    console.log("vvvvvvvv", fileCongViec);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setOpenImage(true);
    };
    const handleClose = () => {
        setOpenImage(false);
        setSelectedImage(null);
    };
    const handleDownloadFile = (file: string) => {
        const downloadUrl = `${apiPort}${file}`;
        window.open(downloadUrl, "_blank");
    };
    return (
        <>
            <Dialog
                maxWidth={size ? size : "md"}
                fullWidth
                open={open}
                onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, px: 3 }} id="customized-dialog-title">
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
                <DialogContent>
                    {content}
                    {fileCongViec && fileCongViec.length > 0 ? (
                        fileCongViec.map((item, index) => {
                            if (item.loai === 1) {
                                return (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Hình ảnh liên quan:
                                        </Typography>
                                        <img
                                            key={index}
                                            src={apiPort + item.fileUrl}
                                            alt={`Uploaded Image ${index}`}
                                            style={{ maxWidth: '100px', marginRight: '10px' }}
                                            onClick={() => handleImageClick(apiPort + item.fileUrl)}
                                        />
                                    </>

                                );
                            } else if (item.loai === 2) {
                                return (
                                    <>
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                            Tệp đính kèm:
                                        </Typography>
                                        <Box key={index} sx={{ position: 'relative', mb: 1 }}>
                                            <Typography variant="body1" component="span" sx={{ cursor: 'pointer' }}>
                                                {item.fileName}
                                            </Typography>
                                            <IconButton>
                                                <FileDownloadIcon
                                                    sx={{ ml: 1, cursor: 'pointer' }}
                                                    onClick={() => handleDownloadFile(item.fileUrl!)}
                                                />
                                            </IconButton>
                                        </Box>

                                    </>

                                );
                            } else {
                                return null; // or handle other types if necessary
                            }
                        })
                    ) : (
                        <div>No files available</div>
                    )}
                    <Dialog open={openImage} onClose={handleClose} maxWidth="lg">
                        <img src={selectedImage!} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
                    </Dialog>
                </DialogContent>
            </Dialog >
        </>
    );
}