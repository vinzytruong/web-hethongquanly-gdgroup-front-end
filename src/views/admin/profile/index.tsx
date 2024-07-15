'use client';

// Third-party
import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { toast } from 'react-toastify';
import { Stack, Box, Typography, FormControlLabel, Button, TextField, Grid, useTheme, Divider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Link from "next/link";
import { AdminLayout } from '@/components/layout';
import useStaff from '@/hooks/useStaff';
import { Item } from 'devextreme-react/cjs/html-editor';
import CustomDialog from '@/components/dialog/CustomDialog';
import FormChangePassword from '@/components/form/FormChangePassword'
import Image from 'next/image';
import MainCard from '@/components/card/MainCard';
import { CustomInput } from "@/components/input";
import Certificate from "./certificate"
import { apiPort } from '@/constant/api'
import { StyledButton } from '@/components/styled-button';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
dayjs.locale('vi');

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#00CCFF' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.primary.main,
  },
}));

function BpRadio(props: any) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}


interface Image {
  fileID: number | null
  fileName: string;
  fileType: string;
  fileUrl: string;
  loaiID: number;
}


interface UserInfo {
  nhanVienID?: number;
  tenNhanVien: string;
  anhdaidien: string;
  vanbang: string[]
  gioiTinh: string;
  email: string;
  diaChi: string;
  soDienThoai: string;
  ngaySinh: string;
  ngayKyHopDong: string;
  lstChucVuView: string[];
  lstFile: Image[];
}

const Account: React.FC = () => {
  // Khởi tạo giá trị ban đầu cho userInfo
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>({
    nhanVienID: 0,
    tenNhanVien: " ",
    anhdaidien: '',
    vanbang: [''],
    gioiTinh: " ",
    email: " ",
    diaChi: " ",
    soDienThoai: " ",
    ngaySinh: '',
    ngayKyHopDong: '',
    lstChucVuView: [""],
    lstFile: [],
  });

  const theme = useTheme()

  const [openDialog, setOpenDialog] = useState(false);

  const { tenNhanVien, anhdaidien, email, diaChi, soDienThoai, ngaySinh, gioiTinh, vanbang, lstChucVuView } = userInfo || {};

  const dataFetchedRef = useRef(false);

  const { dataStaffDetail, getStaffDetailByID, updateStaff, updateStaffClient } = useStaff()

  const [image, setImage] = useState<File | null>(null);

  const [newavatar, setNewAvatar] = useState<Image | null>(null);       // Ảnh đại diện mới

  const [newDiploma, setNewDiploma] = useState<Image[]>([]);            // Danh sách văn bằng cũ + mới

  const [isImageProcessed, setIsImageProcessed] = useState(false)       // Status Xử lý ảnh

  const renderImage = () => {
    if (image) {
      const { name, type } = image;
      if (!isImageProcessed || newavatar?.fileName !== name) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileUrl = e.target?.result as string;
          const imageAvatar = {
            fileID: null,
            fileName: name,
            fileType: type,
            fileUrl: fileUrl,
            loaiID: 1
          };
          setNewAvatar(imageAvatar);
          setIsImageProcessed(true);
        };
        reader.readAsDataURL(image);
      }
      return URL.createObjectURL(new Blob([image!], { type: image?.type }))
    } else if (anhdaidien) {
      return apiPort + anhdaidien
    }
    return '/images/no-data-1.png'
  }


  useEffect(() => {
    if (!dataFetchedRef.current) {
      const accountString = localStorage.getItem('account');
      if (accountString) {
        const account = JSON.parse(accountString);
        // console.log('account', account);
        getStaffDetailByID(account.userID);
        dataFetchedRef.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (dataStaffDetail) {

      let dataImage = ''
      let dataVanBang = new Array();

      if (dataStaffDetail.lstFile && dataStaffDetail.lstFile?.length > 0) {
        dataStaffDetail.lstFile.map((item: Image) => {
          if (item?.loaiID === 1) {
            dataImage = `${item.fileUrl}`
          }
          dataVanBang.push(item)
        })
      }
      setNewDiploma(dataVanBang)
      const chucVuStrings = dataStaffDetail?.lstChucVuView?.map(chucVu => chucVu.lstChucVu.tenChucVu) || [];

      const nam = dataStaffDetail.ngaySinh?.slice(0, 10).split("/")?.[2]
      const thang = dataStaffDetail.ngaySinh?.slice(0, 10).split("/")?.[1]
      const ngay = dataStaffDetail.ngaySinh?.slice(0, 10).split("/")?.[0]
      const convertFromDate = dayjs(`${nam}-${thang}-${ngay}`).format("DD/MM/YYYY HH:mm:ss")

      const nam2 = dataStaffDetail.ngayKyHopDong?.slice(0, 10).split("/")?.[2]
      const thang2 = dataStaffDetail.ngayKyHopDong?.slice(0, 10).split("/")?.[1]
      const ngay2 = dataStaffDetail.ngayKyHopDong?.slice(0, 10).split("/")?.[0]
      const convertFromDatengayKyHopDong = dayjs(`${nam2}-${thang2}-${ngay2}`).format("DD/MM/YYYY HH:mm:ss")


      setUserInfo({
        nhanVienID: dataStaffDetail.nhanVienID,
        tenNhanVien: dataStaffDetail.tenNhanVien || "",
        anhdaidien: dataImage,
        vanbang: dataVanBang,
        gioiTinh: dataStaffDetail.gioiTinh === 'Nam' ? 'Nam' : 'Nữ',
        email: dataStaffDetail.email || "",
        diaChi: dataStaffDetail.diaChi || "",
        soDienThoai: dataStaffDetail.soDienThoai || "",
        ngaySinh: dataStaffDetail?.ngaySinh ? convertFromDate : '01/01/0001 00:00:00',
        ngayKyHopDong: dataStaffDetail?.ngayKyHopDong ? convertFromDatengayKyHopDong : '01/01/0001 00:00:00',
        lstChucVuView: chucVuStrings,
        lstFile: [],
      });
    }
  }, [dataStaffDetail]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo(prevState => {
      return {
        ...prevState,
        [name]: value
      } as UserInfo;
    });
  };

  const handleInputChangeDate = (date: any) => {
    if (date) {
      setUserInfo(prevState => {
        return {
          ...prevState,
          ngaySinh: date,
        } as UserInfo;
      });
    }
  };

  const handleInputChangeDateContract = (date: any) => {
    if (date) {
      setUserInfo(prevState => {
        return {
          ...prevState,
          ngayKyHopDong: date,
        } as UserInfo;
      });
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserInfo(prevState => {
      return {
        ...prevState,
        gioiTinh: value
      } as UserInfo;
    });
  }

  const handleSave = async () => {
    if (userInfo) {
      console.log('userInfo', userInfo);
      let status = await updateStaffClient(userInfo, newavatar, newDiploma);
      if (status === 200) toast.success(`Cập nhật thông tin tài khoản thành công`)
      else toast.error('Cập nhật thất bại')
    }
  };

  const handleChangePassword = () => {
    setOpenDialog(true)
  };

  const formatDate = () => {
    const dateFormat = 'DD/MM/YYYY HH:mm:ss';
    if (dataStaffDetail?.ngaySinh !== null) {
      return dayjs(dataStaffDetail?.ngaySinh, dateFormat);
    } else {
      return dayjs('01/01/0001 00:00:00', dateFormat);
    }
  }

  const formatDateContract = () => {
    const dateFormat = 'DD/MM/YYYY HH:mm:ss';
    if (dataStaffDetail?.ngayKyHopDong !== null) {
      return dayjs(dataStaffDetail?.ngayKyHopDong, dateFormat);
    } else {
      return dayjs('01/01/0001 00:00:00', dateFormat);
    }
  }

  console.log('dataStaffDetail', dataStaffDetail);

  return (
    <AdminLayout>
      <Box sx={{ padding: { xs: '6px', ms: '24px' } }} display='flex' flexDirection='column' gap={3}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant="h3" color={theme.palette.primary.main} sx={{ px: { xs: 2 }, py: { xs: 2, md: 3 } }}>
            Thông tin cá nhân
          </Typography>
        </Box>
        <Box
          padding={'6px'}
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='flex-start'
          width='100%'
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4} bgcolor={theme.palette.background.paper}>
              <Box sx={{ border: `1px solid ${theme.palette.text.secondary}`, borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>Ảnh đại diện</Typography>
                <Divider sx={{ height: 2, color: theme.palette.primary.contrastText, width: '100%' }} />
                <Box
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  px={3}
                  py={3}
                >
                  <Box sx={{
                    pb: { xs: 8, md: 10 },
                    mb: 2,
                    width: { xs: 100, md: 120 },
                    height: { xs: 100, md: 120 },
                    backgroundSize: 'cover',
                    objectFit: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url('${renderImage()}')`,
                    borderRadius: '50%',
                    border: `1px dashed ${theme.palette.primary.main}`
                  }} />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    onChange={(event: any) => setImage(event.target.files[0])}
                    type="file"
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="outlined" size='large' fullWidth component="span" >
                      Tải ảnh lên
                    </Button>
                  </label>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} bgcolor={theme.palette.background.paper}>
              <Box sx={{ border: `1px solid ${theme.palette.text.secondary}`, borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>Chi tiết tài khoản</Typography>
                <Divider sx={{ height: 2, color: theme.palette.primary.contrastText, width: '100%' }} />
                <Box
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  px={3}
                  py={3}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Họ và tên
                        </Typography>
                        <CustomInput
                          value={tenNhanVien}
                          onChange={handleInputChange}
                          type="text"
                          name="tenNhanVien"
                          sx={{ width: '100%' }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0} sx={{ width: '100%' }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Giới tính
                        </Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            onChange={handleGenderChange}
                            value={gioiTinh}
                          >
                            <FormControlLabel
                              value={'Nam'}
                              control={<BpRadio />}
                              label="Nam"
                            />
                            <FormControlLabel
                              value={'Nữ'}
                              control={<BpRadio />}
                              label="Nữ"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Ngày sinh
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={formatDate()}
                            onChange={(value) => handleInputChangeDate(value)}
                            format="DD/MM/YYYY"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Ngày ký hợp đồng lao động
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={formatDateContract()}
                            onChange={(value) => handleInputChangeDateContract(value)}
                            disabled
                            format="DD/MM/YYYY"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0} >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Số điện thoại
                        </Typography>
                        <CustomInput
                          value={soDienThoai}
                          onChange={handleInputChange}
                          type="number"
                          name="soDienThoai"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0} sx={{ width: '100%' }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Email
                        </Typography>
                        <CustomInput
                          value={email}
                          onChange={handleInputChange}
                          type="email"
                          name="email"
                          sx={{ width: '100%' }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Địa chỉ
                        </Typography>
                        <CustomInput
                          value={diaChi}
                          onChange={handleInputChange}
                          type="email"
                          name="diaChi"
                          sx={{ width: '100%' }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Stack direction={'column'} spacing={0}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          component="label"
                          htmlFor="username"
                          mb="0px"
                        >
                          Văn bằng / chứng chỉ
                        </Typography>
                        <Certificate newDiploma={newDiploma} setNewDiploma={setNewDiploma} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} bgcolor={theme.palette.background.paper}>
                      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} width={'100%'}>
                        <Button
                          variant='text'
                          onClick={() => handleChangePassword()}
                        > Thay đổi mật khẩu ?</Button>
                      </Box>
                      <CustomDialog
                        title="Thay đổi mật khẩu"
                        defaulValue={null}
                        isInsert
                        handleOpen={setOpenDialog}
                        open={openDialog}
                        content={< FormChangePassword />}
                      />
                      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                        <StyledButton onClick={handleSave} variant='contained' fullwidth>Lưu lại</StyledButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid >
          </Grid >
        </Box >
      </Box >

    </AdminLayout >
  );
};

export default Account;
