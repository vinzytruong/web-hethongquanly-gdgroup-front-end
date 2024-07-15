import React, { useState, forwardRef } from 'react';
import { Box, Tabs, Tab, Typography, Button, IconButton, useTheme, Dialog, AppBar, Toolbar } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { apiPort } from '@/constant/api';

interface Props {
    setNewDiploma: React.Dispatch<React.SetStateAction<Image[]>>;
    newDiploma: Image[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Image {
    fileID: number | null;
    fileName: string;
    fileType: string;
    fileUrl: string;
    loaiID: number;
}

const initialColumnDiploma = [
    { loaiID: 2, tenLoaiFile: "CCCD" },
    { loaiID: 3, tenLoaiFile: "Bằng cấp" },
    { loaiID: 4, tenLoaiFile: "CV" },
    { loaiID: 5, tenLoaiFile: "Hợp đồng thử việc" },
    { loaiID: 6, tenLoaiFile: "Hợp đồng lao động" },
    { loaiID: 7, tenLoaiFile: "Khác" },
];

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Certificate: React.FC<Props> = ({ newDiploma, setNewDiploma }) => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedFileView, setSelectedFileView] = useState<Image>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, loaiID: number) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const diplomaImages: Image[] = [];

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        const fileUrl = e.target.result as string;
                        const image: Image = {
                            fileID: null,
                            fileName: file.name,
                            fileType: file.type,
                            fileUrl,
                            loaiID
                        };

                        diplomaImages.push(image);
                        if (diplomaImages.length === files.length) {
                            setNewDiploma((prevDiplomas) => [...prevDiplomas, ...diplomaImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleZoom = (item: Image) => {
        const isBase64 = item.fileUrl.startsWith('data:');

        if (!isBase64) {
            window.open(apiPort + item.fileUrl, '_blank');
        } else {
            // setOpen(true);
            // setSelectedFileView(item);
            alert('File chưa được tải lên, không thể xem trực tuyến')
        }
    };
    const handleDelete = (itemToRemove: Image) => {
        const updatedDiploma = newDiploma.filter(item => item.fileName !== itemToRemove.fileName);
        setNewDiploma(updatedDiploma);
    };

    return (
        <Box sx={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    {initialColumnDiploma.map((item, index) => (
                        <Tab
                            sx={{ fontWeight: 400 }}
                            key={item.loaiID}
                            label={item.tenLoaiFile}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {initialColumnDiploma.map((columnDiploma, index) => (
                <CustomTabPanel key={columnDiploma.loaiID} value={value} index={index}>
                    <Box flexWrap="wrap" maxHeight="50vh" display="flex" flexDirection="row" gap={1} overflow="auto">
                        {newDiploma.filter(item => item.loaiID === columnDiploma.loaiID).map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    margin: '15px',
                                    position: 'relative',
                                    backgroundImage: `url('${item.fileID !== null ? apiPort : ''}${item.fileUrl}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: '57px',
                                    height: '60px',
                                    border: '2px solid #E20001',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: '-15px',
                                        right: '-16px',
                                        zIndex: 10,
                                        borderRadius: '50%',
                                    }}
                                    onClick={() => handleDelete(item)}
                                >
                                    <RemoveCircleIcon sx={{ fontSize: '20px', }} />
                                </IconButton>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: '-5px',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        marginBottom: '-18px',
                                        bottom: '0px',
                                        fontSize: '12px',
                                        right: '4px',
                                        zIndex: 10,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100px',
                                    }}
                                >
                                    {item.fileName}
                                </Box>
                                <PictureAsPdfIcon onClick={() => handleZoom(item)} sx={{ cursor: 'pointer', fontSize: '55px', fontWeight: 400, color: '#E20001' }} />
                            </Box>
                        ))}
                        {(columnDiploma.tenLoaiFile !== 'CCCD' || newDiploma.filter(item => item.loaiID === 2).length <= 1) && (
                            <Box
                                sx={{
                                    margin: '15px',
                                    color: '#999999',
                                    width: '57px',
                                    height: '60px',
                                    border: '2px dashed #999999',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <input
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    id={`raised-button-file-${columnDiploma.loaiID}`}
                                    multiple={columnDiploma.tenLoaiFile !== 'CCCD'}
                                    onChange={(e) => handleFileChange(e, columnDiploma.loaiID)}
                                    type="file"
                                />
                                <label htmlFor={`raised-button-file-${columnDiploma.loaiID}`}>
                                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ cursor: 'pointer' }}>
                                        <UploadFileOutlinedIcon sx={{ fontSize: '25px', fontWeight: 400, color: '#999999' }} />
                                        <Typography variant="body2" textAlign="center">
                                            Tải file
                                        </Typography>
                                    </Box>
                                </label>
                            </Box>
                        )}
                    </Box>
                </CustomTabPanel>
            ))}
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }} onClick={handleClose}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <img
                    src={`${selectedFileView?.fileID !== null ? apiPort : ''}${selectedFileView?.fileUrl}`}
                    alt={selectedFileView?.fileName}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
                <Box sx={{ height: '100%', width: '100%', }}
                    onClick={handleClose}
                >
                </Box>
            </Dialog>
        </Box>
    );
};

export default Certificate;
