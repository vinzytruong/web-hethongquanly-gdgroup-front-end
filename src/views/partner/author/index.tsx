import AuthorDialog from "@/components/dialog/AuthorDialog"
import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import useAuthor from "@/hooks/useAuthor"
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import InfoCard from "@/components/card/InfoCard"
import InfoCardMobile from "@/components/card/InfoCardMobile"
import AuthorTable from "@/components/table/table-author"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, QUAN_TRI_DOI_TAC, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import { toast } from "react-toastify"
import useStaff from "@/hooks/useStaff"
import { CustomInput } from "@/components/input"
import ListForMobile from "@/components/accordion/index";

const AuthorPage = () => {
    const theme = useTheme()
    const { uploadFileAuthor, error } = useImportFile();
    const { dataAuthor, isLoaddingAuthor, deleteAuthor } = useAuthor()
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [viewId, setViewId] = useState<number>(0);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    const { dataStaff } = useStaff()
    const [filterMajor, setFilterMajor] = useState<string>("0");
    const [filterPlace, setFilterPlace] = useState<string>("0");
    const [filterModify, setFilterModify] = useState<number>(0);

    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isPartner = dataRoleByUser[0]?.roleName.includes(QUAN_TRI_DOI_TAC)

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)

    }, [])

    useEffect(() => {
        if (error?.maLoi) toast.error(error?.maLoi.toString())
    }, [error])

    const handleDownload = () => {
        const filePath = '/data/TacGia.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'TacGia.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };
    const handleSaveFileImport = async (file: File | null) => {
        if (file) {
            const rs = await uploadFileAuthor(file)
            if (rs) toast.success("Nhập file thành công")
        }
        setOpenUpload(false)
    }

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        deleteAuthor(viewId)
        setOpenCard(false)
    }
    const handleEditItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined) => {
        setOpenDialog(true)
    }

    const infoByID = dataAuthor.find((item) => item.tacGiaID === viewId)

    const initRow = [
        {
            id: 1,
            label: 'MSNV'
        },
        {
            id: 2,
            label: 'Họ và tên'
        },
        {
            id: 3,
            label: 'Chức vụ'
        },
        {
            id: 4,
            label: 'Phòng ban'
        },
        {
            id: 5,
            label: 'Công ty'
        },
    ];


    const dataCard = [
        {
            key: 'Họ và tên',
            value: infoByID?.tenTacGia
        },
        {
            key: 'Ngày sinh',
            value: infoByID?.ngaySinh === "01/01/0001 00:00:00" ? "Chưa có dữ liệu" : infoByID?.ngaySinh
        },
        {
            key: 'Giới tính',
            value: infoByID?.gioiTinh === 0 ? 'Nữ' : 'Nam'
        },
        {
            key: 'Số điện thoại',
            value: infoByID?.soDienThoai
        },
        {
            key: 'Email',
            value: infoByID?.email
        },
        {
            key: 'CCCD',
            value: infoByID?.cccd
        },
        {
            key: 'Chức vụ',
            value: infoByID?.chucVuTacGia
        },
        {
            key: 'Môn chuyên ngành',
            value: infoByID?.monChuyenNghanh
        },
        {
            key: 'Đơn vị công tác',
            value: infoByID?.donViCongTac
        }
    ]
    const filterDataAuthors = useMemo(() => {

        if (!dataAuthor || dataAuthor.length === 0) {
            return [];
        }

        return dataAuthor.filter((item) => {
            const matchesSearch = !contentSearch || (item.tenTacGia && item.tenTacGia.includes(contentSearch));
            const matchesMajor = filterMajor === "0" || item.monChuyenNghanh === filterMajor;
            const matchesPlace = filterPlace === "0" || item.donViCongTac === filterPlace
            const matchesModify = filterModify === 0 || item.nhanVienID === filterModify

            if (filterMajor === "0" && filterMajor === "0" && filterPlace === "0" && filterModify === 0) {
                return matchesSearch
            }

            return matchesSearch && matchesMajor && matchesModify && matchesPlace
        });
    }, [contentSearch, dataAuthor, filterMajor, filterModify, filterPlace]);

    const filterDataModifyAuthors = useMemo(() => {
        // Mảng để lưu các người nhập không trùng lặp
        const uniquePersonModify: any[] = [];

        // Lặp qua mảng đối tượng
        dataAuthor?.forEach(author => {
            const name = dataStaff.find((item, index) => item.nhanVienID === author.nhanVienID)?.tenNhanVien

            // Kiểm tra xem người nhập đã tồn tại trong mảng chưa
            if (!uniquePersonModify.find(unique => unique.nhanVienID === author.nhanVienID)) {

                // Nếu chưa tồn tại, thêm người nhập vào mảng 
                uniquePersonModify.push({ nhanVienID: author.nhanVienID, tenNhanVien: name });
            }
        });

        return uniquePersonModify
    }, [dataAuthor, dataStaff])

    const filterDataPlaceAuthors = useMemo(() => {
        // Mảng để lưu các donvicongtac không trùng lặp
        const uniquePlaces: string[] = [];
        // Lặp qua mảng đối tượng
        dataAuthor?.forEach(item => {
            // Kiểm tra xem donvicongtac đã tồn tại trong mảng uniquePlaces chưa
            if (!uniquePlaces.includes(item.donViCongTac)) {
                // Nếu chưa tồn tại, thêm donvicongtac vào mảng uniquePlaces
                if (item.donViCongTac !== "") uniquePlaces.push(item.donViCongTac);
            }
        });
        return uniquePlaces
    }, [dataAuthor])

    const filterDataMajorAuthors = useMemo(() => {
        // Mảng để lưu các monchuyennganh không trùng lặp
        const uniqueMajors: any[] = [];
        // Lặp qua mảng đối tượng
        dataAuthor?.forEach(item => {
            // Kiểm tra xem monchuyennganh đã tồn tại trong mảng uniqueMajors chưa
            if (!uniqueMajors.includes(item.monChuyenNghanh)) {
                // Nếu chưa tồn tại, thêm monchuyennganh vào mảng uniqueMajors
                if (item.monChuyenNghanh !== "") uniqueMajors.push(item.monChuyenNghanh);
            }
        });
        console.log(uniqueMajors);

        return uniqueMajors
    }, [dataAuthor])

    const handleChangeFilter = (e: any, setter: Function) => {
        setter(e.target.value);
    };


    return (
        <AdminLayout>
            {isLoadingRole ?
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='flex-start'
                    width='100%'
                    my={6}
                    gap={3}
                >
                    Đang tải ......
                </Box>
                :
                (
                    isAdmin || isBusinessStaff || isBusinessAdmin || isPartner ?
                        <Box padding="24px">
                            <Box display='flex' alignItems='center' justifyContent='space-between'>
                                <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
                                    Quản lý tác giả
                                </Typography>
                            </Box>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='flex-start'
                                width='100%'
                                bgcolor={theme.palette.background.paper}
                                px={3}
                                py={3}
                            >
                                <Box sx={{

                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: { xl: 1, xs: 2 },
                                    width: '100%',
                                    flexDirection: { xl: 'row', xs: 'column' }
                                }}>
                                    <Box sx={{ width: { xl: 280, xs: '100%' } }}>
                                        <SearchNoButtonSection fullwidth handleContentSearch={setContentSearch} contentSearch={contentSearch} />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1,
                                            width: '100%',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Box display='flex' justifyContent='flex-start' alignItems='center' width='100%' gap={1}
                                            flexWrap={{
                                                xs: 'wrap',
                                                sm: 'wrap',
                                                md: 'nowrap',
                                                lg: 'nowrap',
                                                xl: 'nowrap'
                                            }}
                                        >
                                            <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: '140px' } }}>
                                                <InputLabel id="demo-simple-select-label-place" sx={{ color: theme.palette.text.secondary }}>Đơn vị công tác</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-place"
                                                    label="Đơn vị công tác"
                                                    id="placeID"
                                                    name="placeID"
                                                    type="placeID"
                                                    value={filterPlace}
                                                    onChange={(e) => handleChangeFilter(e, setFilterPlace)}
                                                    input={<CustomInput size="small" label="Đơn vị công tác" />}
                                                >
                                                    <MenuItem value={"0"}>Tất cả</MenuItem>
                                                    {filterDataPlaceAuthors.map((item, index) => (
                                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: '140px' } }}>
                                                <InputLabel id="demo-simple-select-label-type" sx={{ color: theme.palette.text.secondary }}>Môn chuyên ngành</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-type"
                                                    label="Môn chuyên ngành"
                                                    id="major"
                                                    name="major"
                                                    type="major"
                                                    value={filterMajor}
                                                    onChange={(e) => handleChangeFilter(e, setFilterMajor)}
                                                    input={<CustomInput size="small" label="Môn chuyên ngành" />}
                                                >
                                                    <MenuItem value={"0"}>Tất cả</MenuItem>
                                                    {filterDataMajorAuthors.map((item, index) => (
                                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: '140px' } }}>
                                                <InputLabel id="demo-simple-select-label-modify" sx={{ color: theme.palette.text.secondary }}>Người nhập</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label-modify"
                                                    label="Người nhập"
                                                    id="created"
                                                    name="created"
                                                    type="created"
                                                    value={filterModify}
                                                    onChange={(e) => handleChangeFilter(e, setFilterModify)}
                                                    input={<CustomInput size="small" label="Người nhập" />}
                                                >
                                                    <MenuItem value={0}>Tất cả</MenuItem>
                                                    {filterDataModifyAuthors.map((item, index) => (
                                                        <MenuItem key={index} value={item.nhanVienID}>{item.tenNhanVien}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>


                                        </Box>
                                        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}
                                            flexWrap={{
                                                xs: 'wrap',
                                                sm: 'wrap',
                                                md: 'nowrap',
                                                lg: 'nowrap',
                                                xl: 'nowrap'
                                            }}>
                                            <StyledButton
                                                onClick={handleDownload}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                            >
                                                Tải file mẫu
                                            </StyledButton>
                                            <StyledButton
                                                onClick={() => setOpenUpload(true)}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                            >
                                                Upload file
                                            </StyledButton>
                                            <StyledButton
                                                onClick={() => setOpenAdd(true)}
                                                variant='contained'
                                                size='large'
                                                disabled={!isBusinessAdmin && !isBusinessStaff && !isAdmin && !isPartner}
                                            >
                                                Thêm tác giả
                                            </StyledButton>
                                        </Box>
                                    </Box>

                                    <AuthorDialog title="Thêm tác giả" defaulValue={null} isInsert handleOpen={setOpenAdd} open={openAdd} />
                                    <UploadFileDialog
                                        title="Tải file"
                                        defaulValue={null}
                                        isInsert
                                        handleOpen={setOpenUpload}
                                        open={openUpload}
                                        handlSaveFile={handleSaveFileImport}
                                    />
                                </Box>
                            </Box>
                            {isLoaddingAuthor ?
                                <Box display='flex' justifyContent='center' alignItems='center' width='100%' my={3}>
                                    <CircularProgress />
                                </Box>
                                :
                                (filterDataAuthors?.length > 0 ?
                                    <Box
                                        display='flex'
                                        justifyContent='center'
                                        alignItems='flex-start'
                                        width='100%'
                                        my={3}
                                        gap={3}
                                    >
                                        <Box
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'none',
                                                    md: 'block'
                                                }
                                            }}
                                        >
                                            <AuthorTable
                                                title="Tác giả"
                                                handleOpenCard={setOpenCard}
                                                rows={filterDataAuthors}
                                                handleViewId={setViewId}
                                            />

                                        </Box>
                                        <Box
                                            sx={{
                                                display: {
                                                    xs: 'block',
                                                    sm: 'block',
                                                    md: 'none'
                                                }
                                            }}
                                            width={'100%'}
                                        >
                                            <ListForMobile
                                                open={openCard}
                                                style={{ width: '100%' }}
                                                pathDisplayField={'tenTacGia'}
                                                fieldContainsId={'tacGiaID'}
                                                showMoreOption={false}
                                                autoShow={true}
                                                initRow={[]}
                                                contentSearch={contentSearch}
                                                handleOpenCard={setOpenCard}
                                                handleViewId={setViewId}
                                                rows={filterDataAuthors}
                                            >
                                                <InfoCardMobile
                                                    id={viewId}
                                                    layout={[4, 6]}
                                                    data={dataCard}
                                                    open={openCard}
                                                    handleDelete={handleDeleteItem}
                                                    handleEdit={handleEditItem}
                                                    isAllowDelete={isAdmin || (dataRoleByUser[0]?.nhanVienID === infoByID?.nhanVienID)}
                                                />
                                            </ListForMobile>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'none',
                                                    md: 'block'
                                                }
                                            }}
                                        >
                                            <InfoCard
                                                id={viewId}
                                                title="Thông tin cá nhân tác giả"
                                                data={dataCard}
                                                handleOpen={setOpenCard}
                                                open={openCard}
                                                handleDelete={handleDeleteItem}
                                                handleEdit={handleEditItem}
                                                isAllowDelete={isAdmin || (dataRoleByUser[0]?.nhanVienID === infoByID?.nhanVienID)}
                                            />
                                        </Box>
                                    </Box>
                                    :
                                    <Box
                                        display='flex'
                                        justifyContent='center'
                                        alignItems='flex-start'
                                        width='100%'
                                        my={6}
                                        gap={3}
                                    >
                                        Không có dữ liệu
                                    </Box>
                                )
                            }
                            <AuthorDialog
                                title="Cập nhật tác giả"
                                defaulValue={dataAuthor.find(item => item.tacGiaID === viewId)}
                                handleOpen={setOpenDialog}
                                open={openDialog}
                                isUpdate
                            />
                        </Box>
                        :
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='flex-start'
                            width='100%'
                            my={6}
                            gap={3}
                        >
                            Không có quyền truy cập
                        </Box>
                )
            }

        </AdminLayout>
    )
}
export default AuthorPage