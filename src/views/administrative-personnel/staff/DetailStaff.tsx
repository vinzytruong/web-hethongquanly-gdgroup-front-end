import CustomizeTab, { CustomizeTabColumn } from "@/components/tabs"
import TabRole from "./TabRole"
import TabLeave from "./TabLeave"
import TabPosition from "./TabPosition"
import TabAccount from "./TabAccount"
import TabProfile from "./TabProfile"
import useStaff from "@/hooks/useStaff"
import { useEffect } from "react"
import { Box, useTheme } from "@mui/material"
import TabManageStaff from "./TabManageStaff"

export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

const DetailStaff = (props: Props) => {
    const theme = useTheme()
    const { id } = props
    const { isLoaddingDetail, dataStaffDetail, dataStaff, getStaffDetailByID } = useStaff()

    useEffect(() => {
        getStaffDetailByID(id)
    }, [id])

    const dataDefault = dataStaffDetail?.nhanVienID === id ? dataStaffDetail : null
    // const dataDefault = dataStaff.find(item=>item.nhanVienID===id)
    return (
        <>
            {dataDefault &&
                <>
                    <Box sx={{
                        [theme.breakpoints.down('sm')]: {
                            display: 'none'
                        },
                    }}>
                        <CustomizeTabColumn
                            dataTabs={
                                [
                                    { title: 'Hồ sơ nhân viên', content: <TabProfile rows={dataDefault} /> },
                                    { title: 'Tài khoản', content: <TabAccount rows={dataDefault} /> },
                                    { title: 'Nghỉ phép', content: <TabLeave rows={dataDefault} /> },
                                    { title: 'Phân quyền', content: <TabRole rows={dataDefault} /> },
                                    { title: 'Phân quyền phụ trách nhân viên', content: <TabManageStaff rows={dataDefault} /> },
                                    { title: 'Vị trí việc làm', content: <TabPosition rows={dataDefault} /> },
                                ]
                            }
                        />
                    </Box>
                    <Box sx={{
                        [theme.breakpoints.up('sm')]: {
                            display: 'none'
                        },
                    }}>
                        <CustomizeTab
                            dataTabs={
                                [
                                    { title: 'Hồ sơ nhân viên', content: <TabProfile rows={dataDefault} /> },
                                    { title: 'Tài khoản', content: <TabAccount rows={dataDefault} /> },
                                    { title: 'Nghỉ phép', content: <TabLeave rows={dataDefault} /> },
                                    { title: 'Phân quyền', content: <TabRole rows={dataDefault} /> },
                                    { title: 'Vị trí việc làm', content: <TabPosition rows={dataDefault} /> },
                                ]
                            }
                        />
                    </Box>
                </>

            }
        </>


    )
}
export default DetailStaff;