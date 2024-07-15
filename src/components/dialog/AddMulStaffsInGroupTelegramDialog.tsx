import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputAdornment,
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
    TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { PropsDialog } from "@/interfaces/dialog";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import useProvince from "@/hooks/useProvince";
import { Contractors } from "@/interfaces/contractors";
import useContractors from "@/hooks/useContractors";
import useContractorsType from "@/hooks/useContractorsType";
import { addConfigNotification, addMultiStaffsInGroupTelegram, addUnit, getAllStaffs, getStaffsByGroupTelegram, updateConfigNotification } from "@/constant/api";
import useUnits from "@/hooks/useUnits";
import dayjs from "dayjs"; // Import dayjs library
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import { Grades } from "@/interfaces/grades";
import { Circulars } from "@/interfaces/circulars";
import { Subjects } from "@/interfaces/subjects";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Units } from "@/interfaces/units";
import { ConfigNotification } from "@/interfaces/configNotification";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from "axios";
import { Staff } from "@/interfaces/user";

export const validationUtilizedObjectSchema = yup.object({
    maThongBao: yup.string().required("Vui lòng nhập mã thông báo"),
    tenNhom: yup.string().required("Vui lòng nhập tên nhóm"),
    noiDung: yup.string().required("Vui lòng nhập nội dung"),
    active: yup.boolean().required("Vui lòng xác nhận trạng thái hoạt động"),
});
export default function AddMulStaffsInGroupTelegramDialog(props: PropsDialog) {
    const { title, defaulValue, isInsert, handleOpen, open, isUpdate, fetchData } = props;
    const theme = useTheme()
    const [formData, setFormData] = useState<Units>();
    const { addUnits, updateUnits, dataUnits } = useUnits();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState(null);

    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);

    const onHandleClose = () => {
        handleOpen(false);
        if (isInsert) {
            setEntityError(null);
        }
    };
    const handleSelectAllChange = (event: any) => {
        if (event.target.checked) {
            setSelectedStaffs(dataStaffs.map((item) => item.nhanVienID));
        } else {
            setSelectedStaffs([]);
        }
    };
    const handleSave = async (event: any) => {
        console.log("Selected staffs", selectedStaffs);

        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(
                addMultiStaffsInGroupTelegram,
                {
                    thongBaoID: defaulValue.thongBaoID,
                    lstNhanVienID: selectedStaffs,
                },
                { headers }
            );
            if (response.status === 200) {
                toast.success("Cập nhật phân quyền thành công");
            } else {
                toast.error("Cập nhật phân quyền thất bại");
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi trong quá trình cập nhật phân quyền");
        }
    };
    const handleItemChange = (nhanVienID: number) => {
        setSelectedStaffs((prev: any) =>
            prev.includes(nhanVienID) ? prev.filter((id: number) => id !== nhanVienID) : [...prev, nhanVienID]
        );
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getAllStaffs, { headers });

                setDataStaffs(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                // Optional: Any cleanup or final steps
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                const headers = { Authorization: `Bearer ${accessToken}` };
                const response = await axios.get(getStaffsByGroupTelegram + "?ThongBaoID=" + defaulValue.thongBaoID, { headers });
                console.log("manage-staff", response.data);
                const staffIdsArray = response.data.map((staff: any) => Number(staff.nhanVienID));
                setSelectedStaffs(staffIdsArray);
            } catch (error) {
                console.log(error);
            } finally {
                // Optional: Any cleanup or final steps
            }
        };

        fetchData();
    }, []);
    const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);
    const isAllSelected = selectedStaffs.length === dataStaffs.length;

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                    <Typography variant="h3">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <Typography variant="h6">Phân quyền quản lý nhân viên</Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    indeterminate={
                                                        selectedStaffs.length > 0 && selectedStaffs.length < selectedStaffs.length
                                                    }
                                                    onChange={handleSelectAllChange}
                                                />
                                            }
                                            label="Chọn tất cả"
                                        />
                                        <Grid container spacing={2}>
                                            {dataStaffs.map((item, index) => (
                                                <Grid key={index} item sm={2}>
                                                    <FormControlLabel
                                                        key={item.nhanVienID}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedStaffs.includes(item.nhanVienID)}
                                                                onChange={() => handleItemChange(item.nhanVienID)}
                                                            />
                                                        }
                                                        label={item.tenNhanVien}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </FormGroup>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {isInsert && (
                        <LoadingButton
                            sx={{ p: "12px 24px" }}
                            onClick={handleSave}
                            type="submit"
                            loading={loading}
                            variant="contained"
                            size="large"
                        >
                            Lưu
                        </LoadingButton>
                    )}
                    {isUpdate && (
                        <LoadingButton
                            sx={{ p: "12px 24px" }}
                            type="submit"
                            onClick={handleSave}
                            loading={loading}
                            variant="contained"
                            size="large"
                        >
                            Lưu
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);