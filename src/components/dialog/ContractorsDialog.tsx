import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FilledInput, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, Input, InputBase, LinearProgress, MenuItem, Radio, RadioGroup, Rating, Select, Snackbar, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { PropsDialog } from '@/interfaces/dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useRef, useState } from 'react';
import useProvince from '@/hooks/useProvince';
import { Contractors } from '@/interfaces/contractors';
import useContractors from '@/hooks/useContractors';
import useContractorsType from '@/hooks/useContractorsType';
import { toast } from 'react-toastify';
import { CustomInput } from '../input';
import { getAllAreaOfOperation, getAllTypeOfCooperation } from '@/constant/api';
import axios from 'axios';
import { TypeOfCooperations } from '@/interfaces/TypeOfCooperation';
import { AreaOfOperations } from '@/interfaces/areaOfOperation';
import * as yup from "yup";
import { useFormik } from 'formik';
import { StaffInCharge } from '@/interfaces/staffInCharge';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface Props {
    title: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean,
    open: boolean,
    typeOfCooperations?: TypeOfCooperations[]
    areaOfOperations?: AreaOfOperations[]
    id?: number,
    idParent?: number,
    file?: File | null,
    handleUploadFile?: (e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?: (e: any) => void,
    note?: string;
    fetchData?: () => void;
}
export const validationUtilizedObjectSchema = yup.object({
    maSoThue: yup.string().required("Vui lòng nhập mã số thuế"),
    tenCongTy: yup.string().required("Vui lòng nhập tên công ty"),
    diaChi: yup.string().required("Vui lòng nhập địa chỉ"),
    loaiNTID: yup
        .number()
        .positive("Vui lòng chọn loại nhà thầu") // Validates against negative values
        .required("Vui lòng chọn loại nhà thầu") // Sets it as a compulsory field
        .min(1, "Vui lòng chọn loại nhà thầu"),
    loaiHopTacID: yup
        .number()
        .positive("Vui lòng loại hợp tác") // Validates against negative values
        .required("Vui lòng loại hợp tác") // Sets it as a compulsory field
        .min(1, "Vui lòng loại hợp tác"),
    diaBanID: yup
        .number()
        .positive("Vui lòng chọn địa bàn hoạt động") // Validates against negative values
        .required("Vui lòng chọn địa bàn hoạt động") // Sets it as a compulsory field
        .min(1, "Vui lòng chọn địa bàn hoạt động"),
    tinhID: yup
        .number()
        .positive("Vui lòng chọn tỉnh")
        .required("Vui lòng chọn tỉnh")
        .min(1, "Vui lòng chọn tỉnh"),
    email: yup
        .string()
        .email("Vui lòng nhập email hợp lệ")
        .required("Vui lòng nhập email")
});
export default function ContractorsDialog(props: Props) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, typeOfCooperations, areaOfOperations } = props
    const theme = useTheme()
    const [formData, setFormData] = useState<Contractors>();
    const { getAllProvince, dataProvince } = useProvince()
    const { addContractors, updateContractors } = useContractors()
    const { dataContractorsType } = useContractorsType()
    const [loading, setLoading] = useState<boolean>(false);
    const [staffInChargeList, setStaffInChargeList] = useState<StaffInCharge[]>([
        {
            tenNguoiPhuTrach: '',
            soDienThoai: '',
            chucVu: '',
            id: Date.now(),
        }
    ]);

    const [entityError, setEntityError] = useState(null);
    const formik = useFormik({
        initialValues: {
            maSoThue: defaulValue?.maSoThue ?? "",
            tenCongTy: defaulValue?.tenCongTy ?? "",
            diaChi: defaulValue?.diaChi ?? "",
            email: defaulValue?.email ?? "",
            loaiNTID: defaulValue?.loaiNTID ?? 0,
            loaiHopTacID: defaulValue?.loaiHopTacID ?? 0,
            diaBanID: defaulValue?.diaBanID ?? 0,
            tinhID: defaulValue?.tinhID ?? 0,
            nguoiDaiDien: defaulValue?.nguoiDaiDien ?? '',
            nddSoDienThoai: defaulValue?.nddSoDienThoai ?? '',
            nddChucVu: defaulValue?.nddChucVu ?? '',
            nhanVienPhuTrach: defaulValue?.nhanVienPhuTrach ?? '',
            soDienThoai: defaulValue?.soDienThoai ?? '',
            chucVu: defaulValue?.chucVu ?? '',
            ghiChu: defaulValue?.ghiChu ?? '',

        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            const data: Contractors = {
                ...values,
            };
            try {
                if (isInsert) {
                    const hasFiled = staffInChargeList.some((item) => 'filed' in item);

                    if (hasFiled) {
                        return; // Your return statement here
                    }
                    data.nhanVienPhuTrach = JSON.stringify(staffInChargeList)
                    const response = await addContractors(data);
                    handleOpen(false);
                    formik.resetForm();
                    setLoading(false);
                    toast.success("Thêm dữ liệu thành công", {});
                } else {
                    data.nhaThauID = defaulValue.nhaThauID;
                    data.nhanVienPhuTrach = JSON.stringify(staffInChargeList)
                    await updateContractors(data);
                    setLoading(false);
                    toast.success("Cập nhật dữ liệu thành công", {});
                }
            } catch (error: any) {
                setEntityError(error.response.data);
            }
        },
    });

    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (defaulValue) {
            let parsedNhanVienPhuTrach = [];
            try {
                parsedNhanVienPhuTrach = defaulValue?.nhanVienPhuTrach ? JSON.parse(defaulValue?.nhanVienPhuTrach) : [];
                if (!Array.isArray(parsedNhanVienPhuTrach)) {
                    parsedNhanVienPhuTrach = [{
                        tenNguoiPhuTrach: '',
                        soDienThoai: '',
                        chucVu: '',
                        id: Date.now(),
                    }];
                }
            } catch (e) {
                console.error('Error parsing nhanVienPhuTrach:', e);
            }
            formik.setValues({
                maSoThue: defaulValue?.maSoThue ?? "",
                tenCongTy: defaulValue?.tenCongTy ?? "",
                diaChi: defaulValue?.diaChi ?? "",
                email: defaulValue?.email ?? "",
                loaiNTID: defaulValue?.loaiNTID ?? 0,
                loaiHopTacID: defaulValue?.loaiHopTacID ?? 0,
                diaBanID: defaulValue?.diaBanID ?? 0,
                tinhID: defaulValue?.tinhID ?? 0,
                nguoiDaiDien: defaulValue?.nguoiDaiDien ?? '',
                nddSoDienThoai: defaulValue?.nddSoDienThoai ?? '',
                nddChucVu: defaulValue?.nddChucVu ?? '',
                nhanVienPhuTrach: parsedNhanVienPhuTrach,
                soDienThoai: defaulValue?.soDienThoai ?? '',
                chucVu: defaulValue?.chucVu ?? '',
                ghiChu: defaulValue?.ghiChu ?? '',
            });

            setStaffInChargeList(parsedNhanVienPhuTrach);
        }
    }, [defaulValue]);

    const handleChangeInput = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const list = [...staffInChargeList];
        list[index] = {
            ...list[index],
            [name]: value // TypeScript sẽ hiểu name là một key hợp lệ của StaffInCharge
        };
        setStaffInChargeList(list);
    };
    const handleAddStaffInCharge = () => {
        setStaffInChargeList([...staffInChargeList, {
            tenNguoiPhuTrach: '',
            soDienThoai: '',
            chucVu: '',
            id: Date.now()
        }]);
    };
    const handleRemoveStaffInCharge = (id: number) => {
        const updatedList = staffInChargeList.filter(item => item.id !== id);
        setStaffInChargeList(updatedList);
    };
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
                    <Grid container spacing={2}>
                        {entityError && (
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography
                                        sx={{ mb: 1.5, fontWeight: "bold" }}
                                        className="required_text"
                                    >
                                        {JSON.stringify(entityError)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                        <Grid item md={4} xs={12}>
                            <Box style={{ width: '100%' }}>
                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                    Mã số thuế <span className="required_text">(*)</span>{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="maSoThue"
                                    name="maSoThue"
                                    value={formik.values.maSoThue}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.maSoThue &&
                                        Boolean(formik.errors.maSoThue)
                                    }
                                />
                                {formik.touched.maSoThue &&
                                    Boolean(formik.errors.maSoThue) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.maSoThue
                                                ? formik.errors.maSoThue.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <Box style={{ width: '100%' }}>
                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                    Tên công ty <span className="required_text">(*)</span>{" "}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="tenCongTy"
                                    name="tenCongTy"
                                    value={formik.values.tenCongTy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.tenCongTy &&
                                        Boolean(formik.errors.tenCongTy)
                                    }
                                />
                                {formik.touched.tenCongTy &&
                                    Boolean(formik.errors.tenCongTy) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.tenCongTy
                                                ? formik.errors.tenCongTy.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Địa chỉ  <span className="required_text">(*)</span>{" "}
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="diaChi"
                            name="diaChi"
                            value={formik.values.diaChi}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.diaChi &&
                                Boolean(formik.errors.diaChi)
                            }
                        />
                        {formik.touched.diaChi &&
                            Boolean(formik.errors.diaChi) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.diaChi
                                        ? formik.errors.diaChi.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Email
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                            }
                        />
                        {formik.touched.email &&
                            Boolean(formik.errors.email) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.email
                                        ? formik.errors.email.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Loại <span className="required_text">(*)</span>{" "}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="loaiNTID"
                                name="loaiNTID"
                                type="loaiNTID"
                                value={formik.values.loaiNTID}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.loaiNTID &&
                                    Boolean(formik.errors.loaiNTID)
                                }
                            >
                                {dataContractorsType && dataContractorsType.length > 0 && dataContractorsType.map((item:any, index) => (
                                    <MenuItem
                                        key={index}
                                        defaultValue={formik.values.loaiNTID}
                                        value={item.loaiNTID}
                                    >
                                        {item.tenLoai}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {formik.touched.loaiNTID &&
                            Boolean(formik.errors.loaiNTID) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.loaiNTID
                                        ? formik.errors.loaiNTID.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Loại Hợp tác <span className="required_text">(*)</span>{" "}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="loaiHopTacID"
                                name="loaiHopTacID"
                                type="loaiHopTacID"
                                value={formik.values.loaiHopTacID}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.loaiHopTacID &&
                                    Boolean(formik.errors.loaiHopTacID)
                                }
                            >
                                {typeOfCooperations && typeOfCooperations.length > 0 && typeOfCooperations.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        defaultValue={formik.values.loaiHopTacID}
                                        value={item.id}
                                    >
                                        {item.tenLoaiHopTac}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {formik.touched.loaiHopTacID &&
                            Boolean(formik.errors.loaiHopTacID) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.loaiHopTacID
                                        ? formik.errors.loaiHopTacID.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Địa bàn hoạt động <span className="required_text">(*)</span>{" "}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="diaBanID"
                                name="diaBanID"
                                type="diaBanID"
                                value={formik.values.diaBanID}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.diaBanID &&
                                    Boolean(formik.errors.diaBanID)
                                }
                            >
                                {areaOfOperations && areaOfOperations.length > 0 && areaOfOperations.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        defaultValue={formik.values.diaBanID}
                                        value={item.id}
                                    >
                                        {item.diaBanHoatDong}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        {formik.touched.diaBanID &&
                            Boolean(formik.errors.diaBanID) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.diaBanID
                                        ? formik.errors.diaBanID.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: 'bold' }}>
                            Tỉnh <span className="required_text">(*)</span>{" "}
                        </Typography>
                        <FormControl fullWidth>
                            <Autocomplete
                                disablePortal
                                id="tinhID"
                                options={dataProvince}
                                getOptionLabel={(option) => option.tenTinh}
                                value={dataProvince.find(x => x.tinhID === defaulValue?.tinhID)}
                                onChange={(event, value) => formik.setFieldValue('tinhID', value?.tinhID || '')}
                                onBlur={formik.handleBlur}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="tinhID"
                                        error={formik.touched.tinhID && Boolean(formik.errors.tinhID)}
                                    />
                                )}
                            />
                        </FormControl>
                        {formik.touched.tinhID &&
                            Boolean(formik.errors.tinhID) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.tinhID
                                        ? formik.errors.tinhID.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>


                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Người đại diện
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="nguoiDaiDien"
                            name="nguoiDaiDien"
                            value={formik.values.nguoiDaiDien}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.nguoiDaiDien &&
                                Boolean(formik.errors.nguoiDaiDien)
                            }
                        />
                        {formik.touched.nguoiDaiDien &&
                            Boolean(formik.errors.nguoiDaiDien) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.nguoiDaiDien
                                        ? formik.errors.nguoiDaiDien.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <Box style={{ width: '100%' }}>
                                <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                    SĐT người đại diện
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="nddSoDienThoai"
                                    name="nddSoDienThoai"
                                    value={formik.values.nddSoDienThoai}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.nddSoDienThoai &&
                                        Boolean(formik.errors.nddSoDienThoai)
                                    }
                                />
                                {formik.touched.nddSoDienThoai &&
                                    Boolean(formik.errors.nddSoDienThoai) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.nddSoDienThoai
                                                ? formik.errors.nddSoDienThoai.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box style={{ width: '100%' }}>
                                <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                    Chức vụ người đại diện
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="nddChucVu"
                                    name="nddChucVu"
                                    value={formik.values.nddChucVu}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.nddChucVu &&
                                        Boolean(formik.errors.nddChucVu)
                                    }
                                />
                                {formik.touched.nddChucVu &&
                                    Boolean(formik.errors.nddChucVu) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.nddChucVu
                                                ? formik.errors.nddChucVu.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                        </Grid>
                    </Grid>
                    {
                        staffInChargeList && staffInChargeList.length > 0 && staffInChargeList.map((item, index) => (
                            <Box style={{ width: '100%' }} key={index}>
                                <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                    Nhân viên phụ trách <IconButton aria-label="delete" sx={{ color: 'red' }} onClick={() => handleRemoveStaffInCharge(item.id)}>
                                        <ClearIcon />
                                    </IconButton>
                                </Typography>

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id={`nhanVienPhuTrach-${index}`}
                                    name="tenNguoiPhuTrach"
                                    value={item.tenNguoiPhuTrach}
                                    onChange={(event) => handleChangeInput(index, event)}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.nhanVienPhuTrach &&
                                        Boolean(formik.errors.nhanVienPhuTrach)
                                    }
                                />
                                {formik.touched.nhanVienPhuTrach &&
                                    Boolean(formik.errors.nhanVienPhuTrach) && (
                                        <FormHelperText className="required_text">
                                            {formik.errors.nhanVienPhuTrach
                                                ? formik.errors.nhanVienPhuTrach.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}

                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item md={6} xs={12}>
                                        <Box style={{ width: '100%' }}>
                                            <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                                SĐT nhân viên phụ trách
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id={`soDienThoai-${index}`}
                                                name="soDienThoai"
                                                value={item.soDienThoai}
                                                onChange={(event) => handleChangeInput(index, event)}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.soDienThoai &&
                                                    Boolean(formik.errors.soDienThoai)
                                                }
                                            />
                                            {formik.touched.soDienThoai &&
                                                Boolean(formik.errors.soDienThoai) && (
                                                    <FormHelperText className="required_text">
                                                        {formik.errors.soDienThoai
                                                            ? formik.errors.soDienThoai.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={6} xs={12} >
                                        <Box style={{ width: '100%' }}>
                                            <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                                                Chức vụ nhân viên phụ trách
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id={`chucVu-${index}`}
                                                name="chucVu"
                                                value={item.chucVu}
                                                onChange={(event) => handleChangeInput(index, event)}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched.chucVu &&
                                                    Boolean(formik.errors.chucVu)
                                                }
                                            />
                                            {formik.touched.chucVu &&
                                                Boolean(formik.errors.chucVu) && (
                                                    <FormHelperText className="required_text">
                                                        {formik.errors.chucVu
                                                            ? formik.errors.chucVu.toString()
                                                            : ""}
                                                    </FormHelperText>
                                                )}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mb: 2, mt: 2 }} />
                            </Box>
                        ))
                    }
                    <IconButton
                        sx={{
                            color: 'green',
                            mt: 2,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={handleAddStaffInCharge}
                    >
                        <AddCircleIcon />
                    </IconButton>

                    <Box style={{ width: '100%' }}>
                        <Typography sx={{ mt: 1.5, mb: 1.5, fontWeight: "bold" }}>
                            Ghi chú
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="ghiChu"
                            name="ghiChu"
                            value={formik.values.ghiChu}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.ghiChu &&
                                Boolean(formik.errors.ghiChu)
                            }
                        />
                        {formik.touched.ghiChu &&
                            Boolean(formik.errors.ghiChu) && (
                                <FormHelperText className="required_text">
                                    {" "}
                                    {formik.errors.ghiChu
                                        ? formik.errors.ghiChu.toString()
                                        : ""}
                                </FormHelperText>
                            )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {isInsert &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={() => formik.handleSubmit()}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Thêm nhà thầu
                        </LoadingButton>
                    }
                    {isUpdate &&
                        <LoadingButton
                            sx={{ p: '12px 24px' }}
                            onClick={() => formik.handleSubmit()}
                            loading={loading}
                            variant="contained"
                            size='large'
                        >
                            Cập nhật nhà thầu
                        </LoadingButton>
                    }
                </DialogActions>
            </Dialog >
        </>
    );
}