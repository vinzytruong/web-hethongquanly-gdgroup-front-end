import UploadFileDialog from "@/components/dialog/UploadFileDialog"
import { AdminLayout } from "@/components/layout"
import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import InfoCard from "@/components/card/InfoCard"
import useRole from "@/hooks/useRole"
import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import CircularLoading from "@/components/loading/CircularLoading"
import TableCustom from "@/components/table/table-custom"
import { toast } from "react-toastify"
import CustomDialog from "@/components/dialog/CustomDialog"
import FormReportInteract from "@/components/form/FormReportInteract"
import { IconPlus } from "@tabler/icons-react"
import useStaff from "@/hooks/useStaff"
import useInteraction from "@/hooks/useInteraction"
import ListForMobile from "@/components/accordion/index";

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
const headCells: HeadCell[] = [
    // {
    //     id: '1',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Nhân viên',
    // },
    {
        id: '2',
        numeric: false,
        disablePadding: false,
        label: 'Cán bộ tiếp xúc',
    },
    {
        id: '4',
        numeric: false,
        disablePadding: false,
        label: 'Thời gian tiếp xúc',
    },
    {
        id: '5',
        numeric: false,
        disablePadding: false,
        label: 'Sản phẩm quan tâm',
    },
    {
        id: '6',
        numeric: false,
        disablePadding: false,
        label: 'Nguồn vốn',
    },
    {
        id: '5',
        numeric: false,
        disablePadding: false,
        label: 'Bước thị trường',
    },

    {
        id: '9',
        numeric: true,
        disablePadding: false,
        label: 'Hành động',
    },
];
const TabReportInteract = (id: any) => {
    const theme = useTheme()

    const { dataStaff } = useStaff()
    const { uploadFileInteraction } = useImportFile();
    // const { getAllInteraction, addInteraction, dataInteraction, isLoadding, deleteInteraction, updateInteraction, deleteMulInteraction } = useInteraction(id?.id)
    const { getAllInteraction, dataInteraction, deleteMulInteraction, getAllInteractionByCoQuan, dataSteps, dataCapitals } = useInteraction()
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()

    /* State */
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [account, setAccount] = useState<any>()
    const [isOpenAddCard, setOpenAddCard] = useState<boolean>(false);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [selected, setSelected] = useState<number[]>([]);
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);

    useEffect(() => {
        getAllInteractionByCoQuan(id?.id)
    }, [])

    const handleDownload = () => {
        const filePath = '/data/TacGia.xlsx';
        const a = document.createElement('a');
        a.href = filePath;
        a.download = 'TacGia.xlsx'; // Tên của tệp tin khi được tải xuống
        document.body.appendChild(a); // Thêm liên kết vào body
        a.click(); // Kích hoạt sự kiện click trên liên kết ẩn
        document.body.removeChild(a); // Sau khi click, xóa liên kết ra khỏi body
    };

    const handleSaveFileImport = (file: File | null) => {

        if (file) uploadFileInteraction(file)
        setOpenUpload(false)
    }
    const infoByID = dataInteraction.find((item) => item.tuongTacID === viewId)


    const dataCard = [
        {
            key: 'Nhân viên',
            value: infoByID?.createBy
        },
        {
            key: 'Cán bộ tiếp xúc',
            value: infoByID?.canBoTiepXuc
        },
        {
            key: 'Thời gian tiếp xúc',
            value: infoByID?.thoiGian?.slice(0, 10)
        },
        {
            key: 'Sản phẩm quan tâm',
            value: infoByID?.nhomHangQuanTam
        },
        {
            key: 'Bước thị trường',
            value: dataSteps?.find(item => item.buocThiTruongID === infoByID?.buocThiTruongID)?.buocThiTruongTen
        },
        {
            key: 'Thông tin liên hệ',
            value: infoByID?.thongTinLienHe
        },
        {
            key: 'Thông tin tiếp xúc',
            value: infoByID?.thongTinTiepXuc
        },
        {
            key: 'Nguồn vốn',
            value: infoByID?.nguonVonID
        },
        {
            key: 'Ghi chú',
            value: infoByID?.ghiChu
        }
    ]



    console.log(dataInteraction);

    const dataRenderTable = useMemo(() => {
        let data: any[] = []
        dataInteraction.map((item, index: any) => {
            data.push([
                item?.tuongTacID,
                item?.canBoTiepXuc,
                item?.thoiGian?.slice(0, 10),
                item?.nhomHangQuanTam,
                dataCapitals!?.find(item => item.nguonVonID === item?.nguonVonID)?.tenNguonVon,
                dataSteps?.find(item1 => item1.buocThiTruongID === item?.buocThiTruongID)?.buocThiTruongTen,
                // item?.buocThiTruongID,

            ])
        })
        return data
    }, [dataCapitals, dataInteraction, dataSteps])

    const handleDelete = async (ids: number[]) => {

        console.log("delete", ids);
        const rs = await deleteMulInteraction(ids)
        if (rs) toast.success("Xoá thành công")
        // else toast.error("Xoá thất bại")
        setSelected([])

    }

    return (
        <>
            {isLoadingRole ?
                <CircularLoading />
                :

                <Grid container>
                    {/* Filter và các hành động */}
                    <Grid item xs={12}>
                        <Box width='100%' bgcolor={theme.palette.background.paper} p={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} lg={4}>
                                    <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={setContentSearch} />
                                </Grid>
                                {/* Hành động thêm */}
                                <Grid item xs={12} sm={12} lg={8} >
                                    <Box display="flex" justifyContent="flex-end">
                                        <StyledButton
                                            onClick={() => setOpenAdd(true)}
                                            variant='contained'
                                            size='large'
                                            startIcon={<IconPlus size={18} stroke={2} />}
                                        >
                                            Thêm báo cáo tiếp xúc
                                        </StyledButton>
                                    </Box>
                                    <CustomDialog
                                        id={id.id}
                                        title="Thêm báo cáo tiếp xúc"
                                        defaulValue={null}
                                        isInsert
                                        handleOpen={setOpenAdd}
                                        open={openAdd}
                                        content={
                                            <FormReportInteract
                                                id={id.id}
                                                coQuanId={id.id}
                                                buttonActionText={"Cập nhật"}
                                            />
                                        }
                                    />




                                </Grid >
                            </Grid >
                        </Box >
                    </Grid >
                    {/* Data */}
                    < Grid item xs={12} >
                        {
                            // isLoadding ?
                            //     <CircularLoading />
                            //     :
                            dataInteraction?.length > 0 ?
                                <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3} p={2}>
                                    <Box
                                        sx={{
                                            display: {
                                                xs: 'none',
                                                sm: 'block',
                                                md: 'block'
                                            }
                                        }}
                                        style={{ width: '100%' }}
                                    >
                                        <TableCustom
                                            contentSearch={contentSearch}
                                            title={""}
                                            handleOpenViewCard={setOpenViewCard}
                                            handleOpenEditCard={setOpenEditCard}
                                            handleViewId={setViewId}
                                            handleEditId={setEditId}
                                            handleSelected={setSelected}
                                            handleDelete={handleDelete}
                                            selected={selected}
                                            rows={dataRenderTable}
                                            head={headCells}
                                            orderByKey={""}
                                            isButtonEdit
                                            isButtonView
                                            isRoleDelete
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
                                        style={{ width: '100%' }}
                                    >
                                        <ListForMobile
                                            open={false}
                                            autoShow={true}
                                            pathDisplayField={'canBoTiepXuc'}
                                            fieldContainsId={'tuongTacID'}
                                            showMoreOption={false}
                                            initRow={[
                                                { path: 'canBoTiepXuc', isBoolean: false, label: 'Cán bộ tiếp xúc' },
                                                { path: 'thoiGian', isBoolean: false, label: 'Thời gian' },
                                                { path: 'nhomHangQuanTam', isBoolean: false, label: 'Sản phẩm quan tâm' },
                                                { path: 'buocThiTruongID', isBoolean: false, label: 'Bước thị trường' },
                                            ]}
                                            contentSearch={contentSearch}
                                            handleOpenCard={() => { }}
                                            handleViewId={setViewId}
                                            rows={dataInteraction}
                                        >
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} flexWrap={'wrap'} gap={1}>
                                                <StyledButton fullwidth={false}
                                                    onClick={() => setOpenViewCard(true)}
                                                >
                                                    Chi tiết
                                                </StyledButton>
                                                <StyledButton fullwidth={false}
                                                    onClick={() => setOpenEditCard(true)}
                                                >
                                                    Chỉnh sửa
                                                </StyledButton>
                                            </Box>
                                        </ListForMobile>


                                    </Box>
                                    <CustomDialog
                                        title="Chi tiết"
                                        defaulValue={null}
                                        handleOpen={setOpenViewCard}
                                        open={isOpenViewCard}
                                        content={
                                            <InfoCard
                                                id={viewId}
                                                title="Thông tin cá nhân tương tác"
                                                data={dataCard}
                                                handleOpen={setOpenViewCard}
                                                open={isOpenViewCard}
                                                isAllowDelete={false}
                                            />
                                        }
                                    />
                                    <CustomDialog
                                        id={id.id}
                                        title="Cập nhật báo cáo tiếp xúc"
                                        handleOpen={setOpenEditCard}
                                        open={isOpenEditCard}
                                        isUpdate
                                        content={
                                            <FormReportInteract
                                                isEdit
                                                coQuanId={id.id}
                                                id={editId}
                                                defaulValue={dataInteraction.find(item => item.tuongTacID === editId)}
                                                buttonActionText={"Cập nhật"}
                                            />
                                        }
                                    />


                                </Box>
                                :
                                <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                        }
                    </Grid >
                </Grid >

            }
        </>

    )
}
export default TabReportInteract