import SearchNoButtonSection from "@/components/search/SearchNoButton"
import { StyledButton } from "@/components/styled-button"
import useImportFile from "@/hooks/useImportFile"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import InfoCard from "@/components/card/InfoCard"
import useRole from "@/hooks/useRole"
import CircularLoading from "@/components/loading/CircularLoading"
import { toast } from "react-toastify"
import CustomDialog from "@/components/dialog/CustomDialog"
import FormReportInteractValue from "@/components/form/FormReportInteractValue"
import { IconPlus } from "@tabler/icons-react"
import TableReportValue from "./TableReportValue"
import useProjectEstimate from "@/hooks/useProjectEstimate"
import { formatCurrency } from "@/utils/formatCurrency"
import useRoleLocalStorage from "@/hooks/useRoleLocalStorage"

interface HeadCell {
    disablePadding: boolean;
    id: keyof any;
    label: string;
    numeric: boolean;
}
const headCells: HeadCell[] = [
    {
        id: '1',
        numeric: false,
        disablePadding: false,
        label: 'Tên dự toán',
    },
    {
        id: '8',
        numeric: false,
        disablePadding: false,
        label: 'Thời gian tiếp xúc',
    },
    {
        id: '8',
        numeric: false,
        disablePadding: false,
        label: 'Thời gian kết thúc dự kiến',
    },
    {
        id: '2',
        numeric: false,
        disablePadding: false,
        label: 'Bước thị trường',
    },
    {
        id: '3',
        numeric: false,
        disablePadding: false,
        label: 'Doanh thu dự kiến',
    },
    {
        id: '4',
        numeric: false,
        disablePadding: false,
        label: 'Doanh thu thực tế',
    },
    {
        id: '5',
        numeric: false,
        disablePadding: false,
        label: 'Kết quả',
    },
    {
        id: '9',
        numeric: true,
        disablePadding: false,
        label: 'Hành động',
    },
];
const TabReportValue = (id: any) => {
    const theme = useTheme()

    const { uploadFileInteraction } = useImportFile();
    const { getAllProjectEstimate, dataProjectEstimate, deleteMulProjectEstimate } = useProjectEstimate()
    const { userID,isLoadingRole } = useRoleLocalStorage()

    /* State */
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [account, setAccount] = useState<any>()
    const [isOpenAddCard, setOpenAddCard] = useState<boolean>(false);
    const [isOpenEditCard, setOpenEditCard] = useState<boolean>(false);
    const [isOpenViewCard, setOpenViewCard] = useState<boolean>(false);
    const [isOpenFinishCard, setOpenFinishCard] = useState<boolean>(false);
    const [contentSearch, setContentSearch] = useState<string>('');
    const [selected, setSelected] = useState<number[]>([]);
    const [viewId, setViewId] = useState<number>(0);
    const [editId, setEditId] = useState<number>(0);
    const [finishId, setFinishId] = useState<number>(0);
console.log("coQuanID",id?.id);

    useEffect(() => {
        getAllProjectEstimate(id?.id)
    }, [id?.id])

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
    const infoByID = dataProjectEstimate.find((item) => item.duToanID === viewId)
    const infoByIDEdit = dataProjectEstimate.find((item) => item.duToanID === editId)
    console.log("dataInfo", infoByID);

    const dataCard = [
        {
            key: 'Nhân viên',
            value: infoByID?.nhanVien?.tenNhanVien
        },
        {
            key: 'Bước thị trường',
            value: infoByID?.buocThiTruong?.buocThiTruongTen
        },
        {
            key: 'Cơ quan tiếp xúc',
            value: infoByID?.nsCoQuan?.tenCoQuan
        },
        {
            key: 'Tên dự toán',
            value: infoByID?.tenDuToan
        },
        {
            key: 'Tên file dự toán',
            value: infoByID?.tenFileCoQuan
        },
        {
            key: 'Kết quả',
            value: infoByID?.ketQua !== null ? (infoByID?.ketQua === true ? "Thành công" : "Thất bại") : "Chưa xác định"
        },
        {
            key: 'Doanh thu dự kiến',
            value: formatCurrency(infoByID?.doanhThuDuKien!)
        },
        {
            key: infoByID?.ketQua!==null? (infoByID?.ketQua === true ? "Doanh thu thực tế" : "Lý do thất bại") : "Doanh thu thực tế",
            value:infoByID?.ketQua!==null? (infoByID?.ketQua === true ? formatCurrency(infoByID?.doanhThuThucTe!) : infoByID?.lyDoThatBai) : "Chưa có",
        },
       
        // {
        //     key: 'Tên file cơ quan',
        //     value: infoByID?.fileCoQuan
        // },
        // {
        //     key: 'Tên file công ty',
        //     value: infoByID?.tenFileCoQuan
        // },
        // {
        //     key: 'Tên file cơ quan',
        //     value: infoByID?.fileCongTy
        // },
        {
            key: 'Ghi chú',
            value: infoByID?.ghiChu
        }
    ]

    const handleDelete = async (ids: number[]) => {

        console.log("delete", ids);
        const rs = await deleteMulProjectEstimate(ids)
        if (rs) toast.success("Xoá thành công")
        // else toast.error("Xoá thất bại")
        setSelected([])

    }
    console.log("update", dataProjectEstimate);

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
                                            Thêm báo cáo giá trị cơ hội
                                        </StyledButton>
                                    </Box>
                                    <CustomDialog
                                        id={id.id}
                                        title="Thêm báo cáo giá trị cơ hội"
                                        defaulValue={null}
                                        isInsert
                                        handleOpen={setOpenAdd}
                                        open={openAdd}
                                        content={
                                            <FormReportInteractValue
                                                id={id.id}
                                                buttonActionText={"Cập nhật"}
                                                handleOpen={setOpenAdd}
                                            />
                                        }
                                    />
                                    <CustomDialog
                                        id={id.id}
                                        title="Cập nhật kết quả"
                                        handleOpen={setOpenEditCard}
                                        open={isOpenEditCard}

                                        content={
                                            <FormReportInteractValue
                                                id={editId}
                                                isEdit
                                                defaulValue={infoByIDEdit}
                                                buttonActionText={"Cập nhật"}
                                                handleOpen={setOpenEditCard}
                                            />
                                        }
                                    />

                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    {/* Data */}
                    <Grid item xs={12}>
                        {
                            // isLoadding ?
                            //     <CircularLoading />
                            //     :
                            dataProjectEstimate?.length > 0 ?
                                <Box display='flex' justifyContent='center' flexDirection="column" alignItems='flex-start' width='100%' gap={3} p={2}>
                                    <TableReportValue
                                        contentSearch={contentSearch}
                                        title={""}
                                        handleOpenViewCard={setOpenViewCard}
                                        handleOpenEditCard={setOpenEditCard}
                                        handleViewId={setViewId}
                                        handleEditId={setEditId}
                                        handleSelected={setSelected}
                                        handleDelete={handleDelete}
                                        selected={selected}
                                        rows={dataProjectEstimate}
                                        head={headCells}
                                        orderByKey={""}
                                        isButtonEdit
                                        isButtonView
                                        isRoleDelete
                                        
                                    />
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
                                </Box>
                                :
                                <Box display='flex' justifyContent='center' alignItems='flex-start' width='100%' my={6} gap={3}> Không có dữ liệu</Box>
                        }
                    </Grid>
                </Grid>
            }
        </>

    )
}
export default TabReportValue