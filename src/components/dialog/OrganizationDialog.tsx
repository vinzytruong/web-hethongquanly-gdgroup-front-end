import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FilledInput, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useRef, useState } from 'react';
import useDistrict from '@/hooks/useDistrict';
import useProvince from '@/hooks/useProvince';
import { Organization } from '@/interfaces/organization';
import useOrganization from '@/hooks/useOrganization';
import useCommune from '@/hooks/useCommune';
import { CustomInput } from '../input';

export default function OrganizationDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, id } = props
    const theme = useTheme()
    const [formData, setFormData] = useState<Organization>(defaulValue);
    const { getAllProvince, dataProvince } = useProvince()
    const { getDistrictByProvinceId, dataDistrict } = useDistrict(formData?.huyenID, formData?.tinhID)
    const { dataCommune } = useCommune(formData?.xaID, formData?.huyenID)
    const { addOrganization, updateOrganization } = useOrganization()
    const [loading, setLoaing] = useState<boolean>(false)
    const [loaiCoQuan, setLoaiCoQuan] = useState("")
    const [error, setError] = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (defaulValue) setFormData(defaulValue)
    }, [defaulValue])

    const handleChangeSelect = (e: any) => {
        if (e.target) {
            setLoaiCoQuan(e.target.value)
            if (e.target.value !== '') {
                setError(false);
            }
        }

    }
    const handleBlur = () => {
        setTouched(true);
        if (loaiCoQuan === '') {
            setError(true);
        } else {
            setError(false);
        }
    };
    const handleChange = (e: any) => {
        if (e.target) {
            if (e.target.value === "") {
                setError(true);
            } else {
                setError(false);
            }
            setFormData((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value,

            }));

        }
    };

    const handleAdd = (e: any) => {
        e.preventDefault();
        if (loaiCoQuan === '') {
            setError(true);
            setTouched(true);
        } else {
            setError(false);
            setLoaing(true);
            formData.tenCoQuan = loaiCoQuan + " " + formData?.tenCoQuan
            if (formData) addOrganization(formData)
            setLoaing(false);
            handleOpen(false)
        }

    }

    const handleUpdate = (e: any) => {
        e.preventDefault();
        if (loaiCoQuan === '') {
            setError(true);
            setTouched(true);
        } else {

            setError(false);
            setLoaing(true);
            if (formData) updateOrganization(formData)
            setLoaing(false);
            handleOpen(false)
        }

    }
    const selectOrganizationType = [
        "SGD",
        "PGD",
        "STC",
        "PTC",
        "BQLDA",
        "UBND",
        "Trường",
    ]
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
                <DialogContent sx={{ p: 3 }} >


                    <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap='12px'>
                        <Grid container spacing={2}>
                            <Grid item md={4}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Mã số thuế</Typography>
                                    <CustomInput
                                        name='maSoThue'
                                        value={formData?.maSoThue}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={8}>
                                <Box style={{ width: '100%' }}>
                                    <Typography>Tên cơ quan <span className="required_text">(*)</span>{" "}</Typography>
                                    <FormControl fullWidth error={error && touched} required>
                                        <Box display='flex'>

                                            <Select
                                                displayEmpty
                                                name='loaiCQ'
                                                required
                                                value={loaiCoQuan}
                                                onChange={handleChangeSelect}
                                                onBlur={handleBlur}
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) {
                                                        return <Typography>Loại <span className="required_text">(*)</span>{" "}</Typography>
                                                    }

                                                    return selected
                                                }}
                                                input={<OutlinedInput sx={{ borderRadius: "10px 0 0 10px" }} />}
                                            >

                                                {selectOrganizationType.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                            <CustomInput
                                                name='tenCoQuan'
                                                value={formData?.tenCoQuan}
                                                onChange={handleChange}
                                                style={{ borderRadius: "0 10px 10px 0" }}
                                            />
                                        </Box>
                                        {error && touched && <FormHelperText>Yêu cầu nhập loại cơ quan</FormHelperText>}
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ width: '100%' }}>
                            <Typography>Địa chỉ</Typography>
                            <CustomInput
                                name='diaChi'
                                style={{ width: '100%' }}
                                value={formData?.diaChi}
                                onChange={handleChange}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item md={4}>
                                <FormControl fullWidth error={error && touched} required>
                                    <Box style={{ width: '100%' }}>
                                        <Typography>Tỉnh <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            defaultValue={defaulValue?.tinhID}
                                            name='tinhID'
                                            value={formData?.tinhID}
                                            onChange={handleChange}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataProvince.map((item, index) => (
                                                <MenuItem key={index} defaultValue={formData?.tinhID} value={item.tinhID}>{item.tenTinh}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                    {error && touched && <FormHelperText>Yêu cầu nhập tỉnh</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl fullWidth error={error && touched} required>
                                    <Box style={{ width: '100%' }}>
                                        <Typography>Huyện <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            defaultValue={defaulValue?.huyenID}
                                            name='huyenID'
                                            value={formData?.huyenID}
                                            onChange={handleChange}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataDistrict.length > 0 ?
                                                dataDistrict.map((item, index) => (
                                                    <MenuItem key={index} value={item.huyenID}>{item.tenHuyen}</MenuItem>
                                                ))
                                                :
                                                <MenuItem value={undefined}>Vui lòng chọn tỉnh thành trước</MenuItem>
                                            }
                                        </Select>
                                        {error && touched && <FormHelperText>Yêu cầu nhập huyện</FormHelperText>}
                                    </Box>
                                </FormControl>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl fullWidth error={error && touched} required>
                                    <Box style={{ width: '100%' }}>
                                        <Typography>Xã <span className="required_text">(*)</span>{" "}</Typography>
                                        <Select
                                            defaultValue={defaulValue?.xaID}
                                            name='xaID'
                                            value={formData?.xaID}
                                            onChange={handleChange}
                                            fullWidth
                                            input={<CustomInput />}
                                        >
                                            {dataCommune.length > 0 ?
                                                dataCommune.map((item, index) => (
                                                    <MenuItem key={index} value={item.xaID}>{item.tenXa}</MenuItem>
                                                ))
                                                :
                                                <MenuItem value={undefined}>Vui lòng chọn tỉnh và huyện trước</MenuItem>
                                            }
                                        </Select>
                                        {error && touched && <FormHelperText>Yêu cầu nhập xã</FormHelperText>}
                                    </Box>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>

                    {isInsert &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={handleAdd}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Thêm cơ quan
                        </LoadingButton>
                    }
                    {isUpdate &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={handleUpdate}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Cập nhật cơ quan
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >


        </>
    );
}