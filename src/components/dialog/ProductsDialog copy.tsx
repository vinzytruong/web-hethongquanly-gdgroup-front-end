// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css';
// const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });
// import {
//     Alert,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FilledInput,
//     FormControl,
//     FormControlLabel,
//     FormHelperText,
//     Grid,
//     IconButton,
//     Input,
//     InputAdornment,
//     InputBase,
//     LinearProgress,
//     MenuItem,
//     OutlinedInput,
//     Radio,
//     RadioGroup,
//     Rating,
//     Select,
//     Snackbar,
//     Step,
//     StepLabel,
//     Stepper,
//     TextField,
//     TextareaAutosize,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { PropsDialog } from "@/interfaces/dialog";
// import { LoadingButton } from "@mui/lab";
// import { useEffect, useMemo, useRef, useState } from "react";
// import useProvince from "@/hooks/useProvince";
// import { Contractors } from "@/interfaces/contractors";
// import useContractors from "@/hooks/useContractors";
// import useContractorsType from "@/hooks/useContractorsType";
// import { Products } from "@/interfaces/products";
// import { addProduct } from "@/constant/api";
// import useProducts from "@/hooks/useProducts";
// import useProductTypes from "@/hooks/useProductTypes";
// import useSubjects from "@/hooks/useSubjects";
// import useGrades from "@/hooks/useGrades";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs'; // Import dayjs library
// import "react-datepicker/dist/react-datepicker.css";
// import moment from 'moment';
// import MultipleSelectCheckBoxUtilizedObject from "../multiple-select/MultipleSelectCheckBoxUtilizedObject";
// import { UtilizedObject, utilizedObjects } from "@/interfaces/utilizedObject";
// import { useFormik } from "formik";
// import * as yup from 'yup';
// import MultipleSelectCheckBoxGrade from "../multiple-select/MultipleSelectCheckBoxGrade";
// import MultipleSelectCheckBoxSubject from "../multiple-select/MultipleSelectCheckBoxSubject";
// export const validationUtilizedObjectSchema = yup.object({
//     maSanPham: yup
//         .string()
//         .required('Vui lòng nhập mã sản phẩm'),
//     donViTinh: yup
//         .string()
//         .required('Vui lòng nhập đơn vị tính'),
//     tenSanPham: yup
//         .string()
//         .required('Vui lòng nhập tên sản phẩm'),
//     hangSanXuat: yup
//         .string()
//         .required('Vui lòng nhập tên HSX/NSX'),
//     xuatXu: yup
//         .string()
//         .required('Vui lòng nhập tên xuất xứ'),
//     doiTuongSuDung: yup
//         .string()
//         .required('Vui lòng chọn đối tượng sử dụng'),
//     loaiSanPhamID: yup
//         .number()
//         .positive("Vui lòng nhập loại sản phẩm") // Validates against negative values
//         .required("Vui lòng nhập loại sản phẩm") // Sets it as a compulsory field
//         .min(1, "Vui lòng nhập loại sản phẩm"),
//     khoiLop: yup
//         .array()
//         .of(
//             yup.number()
//                 .positive("Vui lòng nhập nhập khối lớp") // Xác nhận số nguyên dương
//                 .required("Vui lòng nhập nhập khối lớp") // Sets it as a compulsory field
//         )
//         .min(1, "Vui lòng nhập nhập khối lớp"),
//     monHoc: yup
//         .array()
//         .of(
//             yup.number()
//                 .positive("Vui lòng nhập nhập môn học") // Xác nhận số nguyên dương
//                 .required("Vui lòng nhập nhập môn học") // Sets it as a compulsory field
//         )
//         .min(1, "Vui lòng nhập nhập môn học")

// });
// export default function ProductsDialog(props: PropsDialog) {
//     const { title, defaulValue, isInsert, handleOpen, open, isUpdate } = props;
//     const [formData, setFormData] = useState<Products>();
//     const { addProducts, updateProducts, dataProducts } = useProducts();
//     const { dataProductTypes } = useProductTypes();
//     const { dataSubjects } = useSubjects();
//     const { dataGrades } = useGrades();
//     const [loading, setLoaing] = useState<boolean>(false);
//     const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
//     const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
//     const formik = useFormik({
//         initialValues: {
//             maSanPham: defaulValue?.maSanPham ?? '',
//             donViTinh: defaulValue?.donViTinh ?? '',
//             tenSanPham: defaulValue?.tenSanPham ?? '',
//             hangSanXuat: defaulValue?.hangSanXuat ?? '',
//             thuongHieu: '',
//             xuatXu: '',
//             nhaXuatBan: '',
//             doiTuongSuDung: defaulValue?.doiTuongSuDung ?? '',
//             loaiSanPhamID: defaulValue?.loaiSanPhamID ?? 0,
//             khoiLop: selectedGrades,
//             monHoc: selectedSubjects,
//         },
//         validationSchema: validationUtilizedObjectSchema,
//         onSubmit: (values) => {
//             console.log(values);
//             alert(21);

//         },
//     });
//     useEffect(() => {
//         if (defaulValue) {
//             setFormData(defaulValue);
//             setContent(defaulValue.tieuChuanKyThuat);
//         }
//     }, [defaulValue]);
//     const handleChange = (e: any) => {
//         if (e.target) {
//             console.log(e.target.name);
//             setFormData((prevState: any) => ({
//                 ...prevState,
//                 [e.target.name]: e.target.value,
//             }));
//         }
//     };
//     const handleAdd = (e: any) => {
//         e.preventDefault();
//         setLoaing(true);
//         console.log(formData);
//         if (typeof formData !== 'undefined') {
//             formData.namSanXuat = selectedDate?.toDate() ?? new Date();
//             formData.tieuChuanKyThuat = content;
//             formData.giaDaiLy = parseInt(formData.giaDaiLy.toString());
//             formData.giaKhachHang = parseInt(formData.giaKhachHang.toString());
//             formData.soLuong = parseInt(formData.soLuong.toString());
//             formData.thue = parseInt(formData.thue.toString());
//             formData.baoHanh = parseInt(formData.baoHanh.toString());
//             formData.namSanXuat = moment(selectedDate?.toDate() ?? new Date(), 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');;
//         }
//         if (formData) addProducts(formData);
//         setLoaing(false);
//         handleOpen(false);
//         setFormData(undefined);
//     };

//     const handleUpdate = (e: any) => {
//         e.preventDefault();
//         setLoaing(true);
//         if (formData) updateProducts(formData);

//         setLoaing(false);
//         handleOpen(false);
//     };
//     //quill editor
//     const [content, setContent] = useState('');
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             ['link', 'image'],
//             [{ align: [] }],
//             [{ color: [] }],
//             ['code-block'],
//             ['clean'],
//         ],
//     };
//     const quillFormats = [
//         'header',
//         'bold',
//         'italic',
//         'underline',
//         'strike',
//         'blockquote',
//         'list',
//         'bullet',
//         'link',
//         'image',
//         'align',
//         'color',
//         'code-block',
//     ];
//     //namSanXuat
//     const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs()); // Initialize with dayjs object

//     const handleDateChange = (date: dayjs.Dayjs | null) => { // Accept dayjs.Dayjs | null type
//         setSelectedDate(date);
//     };
//     const handleEditorChange = (newContent: any) => {
//         setContent(newContent);
//         console.log(newContent);

//     };

//     //KhoiLop
//     const handleSelectedGrades = (data: number[]) => {
//         formik.setFieldValue('khoiLop', selectedGrades);
//         setSelectedGrades(data);
//     }
//     //Môn Học
//     const handleSelectedSubjects = (data: number[]) => {
//         formik.setFieldValue('monHoc', selectedSubjects);
//         setSelectedSubjects(data);
//     }
//     return (
//         <>
//             <form onSubmit={formik.handleSubmit} id="form_product">

//                 <Dialog
//                     maxWidth="xl"
//                     fullWidth
//                     open={open}
//                     onClose={() => handleOpen(false)}
//                     aria-labelledby="modal-modal-title"
//                     aria-describedby="modal-modal-description"
//                 >

//                     <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
//                         <Typography variant="h3">{title}</Typography>
//                     </DialogTitle>
//                     <IconButton
//                         aria-label="close"
//                         onClick={() => handleOpen(false)}
//                         sx={{
//                             position: "absolute",
//                             right: 8,
//                             top: 8,
//                         }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                     <DialogContent sx={{ p: 3 }}>
//                         <Box
//                             display="flex"
//                             flexDirection="column"
//                             justifyContent="space-between"
//                             alignItems="center"
//                             gap="12px"
//                         >
//                             <Grid container spacing={2}>
//                                 <Grid item xs={6}>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }} >Mã sản phẩm <span className="required_text">(*)</span> </Typography>
//                                                 <TextField
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     id="maSanPham"
//                                                     name="maSanPham"
//                                                     value={formik.values.maSanPham}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.maSanPham && Boolean(formik.errors.maSanPham)}
//                                                     helperText={formik.touched.maSanPham && formik.errors.maSanPham ? formik.errors.maSanPham.toString() : ''}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Đơn vị tính <span className="required_text"><span className="required_text">(*)</span></span> </Typography>
//                                                 <TextField
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     id="donViTinh"
//                                                     name="donViTinh"
//                                                     value={formik.values.donViTinh}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.donViTinh && Boolean(formik.errors.donViTinh)}
//                                                     helperText={formik.touched.donViTinh && formik.errors.donViTinh ? formik.errors.donViTinh.toString() : ''}
//                                                 />
//                                             </Box>

//                                         </Grid>
//                                     </Grid>
//                                     <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                         <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Tên sản phẩm <span className="required_text">(*)</span></Typography>
//                                         <TextField
//                                             variant="outlined"
//                                             fullWidth
//                                             id="tenSanPham"
//                                             name="tenSanPham"
//                                             value={formik.values.tenSanPham}
//                                             onChange={formik.handleChange}
//                                             onBlur={formik.handleBlur}
//                                             error={formik.touched.tenSanPham && Boolean(formik.errors.tenSanPham)}
//                                             helperText={formik.touched.tenSanPham && formik.errors.tenSanPham ? formik.errors.tenSanPham.toString() : ''}
//                                         />
//                                     </Box>
//                                     <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                         <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Thương hiệu</Typography>
//                                         <TextField
//                                             variant="outlined"
//                                             fullWidth
//                                             id="thuongHieu"
//                                             name="thuongHieu"
//                                             value={formik.values.thuongHieu}
//                                             onChange={formik.handleChange}
//                                             onBlur={formik.handleBlur}
//                                             error={formik.touched.thuongHieu && Boolean(formik.errors.thuongHieu)}
//                                             helperText={formik.touched.thuongHieu && formik.errors.thuongHieu ? formik.errors.thuongHieu.toString() : ''}
//                                         />
//                                     </Box>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>HSX/NSX <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     id="hangSanXuat"
//                                                     name="hangSanXuat"
//                                                     value={formik.values.hangSanXuat}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.hangSanXuat && Boolean(formik.errors.hangSanXuat)}
//                                                     helperText={formik.touched.hangSanXuat && formik.errors.hangSanXuat ? formik.errors.hangSanXuat.toString() : ''}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Xuất xứ <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     id="xuatXu"
//                                                     name="xuatXu"
//                                                     value={formik.values.xuatXu}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.xuatXu && Boolean(formik.errors.xuatXu)}
//                                                     helperText={formik.touched.xuatXu && formik.errors.xuatXu ? formik.errors.xuatXu.toString() : ''}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Nhà xuất bản</Typography>
//                                                 <TextField
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     id="nhaXuatBan"
//                                                     name="nhaXuatBan"
//                                                     value={formik.values.nhaXuatBan}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.nhaXuatBan && Boolean(formik.errors.nhaXuatBan)}
//                                                     helperText={formik.touched.nhaXuatBan && formik.errors.nhaXuatBan ? formik.errors.nhaXuatBan.toString() : ''}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Đối tượng sử dụng <span className="required_text">(*)</span></Typography>
//                                                 <FormControl fullWidth>
//                                                     <Select
//                                                         labelId="demo-simple-select-label"
//                                                         id="doiTuongSuDung"
//                                                         name="doiTuongSuDung"
//                                                         type="doiTuongSuDung"

//                                                         value={formik.values.doiTuongSuDung}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         error={formik.touched.doiTuongSuDung && Boolean(formik.errors.doiTuongSuDung)}
//                                                     >
//                                                         {utilizedObjects.map((item) => (
//                                                             <MenuItem key={item.utilizedObjectId} value={item.utilizedObjectName}>
//                                                                 {item.utilizedObjectName}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                                 {
//                                                     formik.touched.doiTuongSuDung && Boolean(formik.errors.doiTuongSuDung) && (
//                                                         <FormHelperText className='required_text'> {formik.errors.doiTuongSuDung ? formik.errors.doiTuongSuDung.toString() : ''}</FormHelperText>
//                                                     )
//                                                 }

//                                             </Box>
//                                         </Grid>
//                                     </Grid>

//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Năm sản xuất <span className="required_text">(*)</span></Typography>
//                                                 {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
//                                                 <div className="date_picker">
//                                                     <LocalizationProvider dateAdapter={AdapterDayjs} >
//                                                         <DatePicker
//                                                             value={selectedDate} onChange={handleDateChange}
//                                                             format="DD/MM/YYYY"
//                                                         />
//                                                     </LocalizationProvider>
//                                                 </div>
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Loại sản phẩm <span className="required_text">(*)</span></Typography>
//                                                 <FormControl fullWidth> <Select
//                                                     labelId="demo-simple-select-label"
//                                                     id="loaiSanPhamID"
//                                                     name="loaiSanPhamID"
//                                                     type="loaiSanPhamID"

//                                                     value={formik.values.loaiSanPhamID}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                     error={formik.touched.loaiSanPhamID && Boolean(formik.errors.loaiSanPhamID)}
//                                                 >
//                                                     {dataProductTypes.map((item, index) => (
//                                                         <MenuItem key={index} defaultValue={formik.values.loaiSanPhamID} value={item.loaiSanPhamID}>{item.tenLoaiSanPham}</MenuItem>
//                                                     ))}
//                                                 </Select>
//                                                     {
//                                                         formik.touched.loaiSanPhamID && Boolean(formik.errors.loaiSanPhamID) && (
//                                                             <FormHelperText className='required_text'> {formik.errors.loaiSanPhamID ? formik.errors.loaiSanPhamID.toString() : ''}</FormHelperText>
//                                                         )
//                                                     }
//                                                 </FormControl>
//                                             </Box>

//                                         </Grid>
//                                     </Grid>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: '100%' }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Lớp <span className="required_text">(*)</span></Typography>
//                                                 <MultipleSelectCheckBoxGrade onHandleSelectedGrades={handleSelectedGrades} grades={dataGrades} />
//                                                 {
//                                                     formik.touched.khoiLop && Boolean(formik.errors.khoiLop) && (
//                                                         <FormHelperText className='required_text'> {formik.errors.khoiLop ? formik.errors.khoiLop.toString() : ''}</FormHelperText>
//                                                     )
//                                                 }
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: '100%' }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Môn học <span className="required_text">(*)</span></Typography>
//                                                 <MultipleSelectCheckBoxSubject onHandleSelectedSubjects={handleSelectedSubjects} subjects={dataSubjects} />
//                                                 {
//                                                     formik.touched.monHoc && Boolean(formik.errors.monHoc) && (
//                                                         <FormHelperText className='required_text'> {formik.errors.monHoc ? formik.errors.monHoc.toString() : ''}</FormHelperText>
//                                                     )
//                                                 }
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
//                                         <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Thông tư <span className="required_text">(*)</span></Typography>
//                                         <Select
//                                             defaultValue={defaulValue?.loaiSanPhamID}
//                                             name='loaiSanPhamID'
//                                             value={formData?.loaiSanPhamID}
//                                             onChange={handleChange}
//                                             fullWidth
//                                         >
//                                             {dataProductTypes.map((item, index) => (
//                                                 <MenuItem key={index} defaultValue={formData?.loaiSanPhamID} value={item.loaiSanPhamID}>{item.tenLoaiSanPham}</MenuItem>
//                                             ))}
//                                         </Select>

//                                     </Box>

//                                     <Box style={{ width: "100%", height: "150px" }} sx={{ mb: 1.5 }}>
//                                         <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Tiêu chuẩn kĩ thuật <span className="required_text">(*)</span></Typography>
//                                         <QuillEditor
//                                             value={content}
//                                             onChange={handleEditorChange}
//                                             modules={quillModules}
//                                             formats={quillFormats}
//                                             style={{ height: '150px', width: '100%' }}
//                                             className="w-full h-full mt-10 bg-white"
//                                         />
//                                     </Box>
//                                 </Grid>
//                                 <Grid item xs={1}>

//                                 </Grid>
//                                 <Grid item xs={5}>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Giá TTR <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaKhachHang"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaKhachHang}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>VNĐ</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Giá TH-TT <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaTH-TT"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaKhachHang}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>VNĐ</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Giá CĐT <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>VNĐ</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Giá đại lý <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>VNĐ</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Giá vốn <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>VNĐ</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Bảo hành <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>tháng</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     <Grid container spacing={3} sx={{ mb: 1.5 }}>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Thuế <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end" ><p style={{ fontWeight: 900, color: 'black' }}>%</p></InputAdornment>
//                                                         )
//                                                     }}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                         <Grid item md={6}>
//                                             <Box style={{ width: "100%" }}>
//                                                 <Typography sx={{ mb: 1.5, fontWeight: 'bold' }}>Số lượng <span className="required_text">(*)</span></Typography>
//                                                 <TextField
//                                                     name="giaDaiLy"
//                                                     style={{ width: "100%" }}
//                                                     value={formData?.giaDaiLy}
//                                                     onChange={handleChange}
//                                                 />
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                         </Box>
//                     </DialogContent>
//                     <DialogActions sx={{ p: 3 }}>
//                         {isInsert && (
//                             <LoadingButton
//                                 sx={{ p: "12px 24px" }}
//                                 loading={loading}
//                                 form="form_product"
//                                 type="submit"
//                                 variant="contained"
//                                 size="large"
//                             >
//                                 Thêm sản phẩm
//                             </LoadingButton>
//                         )}
//                         {isUpdate && (
//                             <LoadingButton
//                                 sx={{ p: "12px 24px" }}
//                                 onClick={handleUpdate}
//                                 loading={loading}
//                                 form="form_product"
//                                 variant="contained"
//                                 type="submit"
//                                 size="large"
//                             >
//                                 Cập nhật sản phẩm
//                             </LoadingButton>
//                         )}
//                     </DialogActions>
//                 </Dialog>
//             </form >
//         </>
//     );
// }
