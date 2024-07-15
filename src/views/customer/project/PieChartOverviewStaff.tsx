/* eslint-disable react-hooks/exhaustive-deps */
import MainCard from "@/components/card/MainCard"
import ColumnBarChart from "@/components/chart/ColumnChart"
import MUIPieActiveArc from "@/components/chart/MUIPieActiveArc"
import PieChartResponsive from "@/components/chart/PieChartResponsive"
import useCompanys from "@/hooks/useCompanys"
import useInteraction from "@/hooks/useInteraction"
import useOrganization from "@/hooks/useOrganization"
import useStaff from "@/hooks/useStaff"
import { Companys } from "@/interfaces/companys"
import { DetailInteraction, Interaction } from "@/interfaces/interaction"
import { ReportProjectInteract } from "@/interfaces/reportProjectInteract"
import { Step } from "@/interfaces/step"
import { Staff, StaffDetail } from "@/interfaces/user"
import { generateContrastingColors } from "@/utils/randomColor"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"
interface Props {
    companyName: string,
    dataReportProjectInteract: ReportProjectInteract[],
    dataStaffByCompany: Staff[]
}
const PieChartOverviewStaff = ({ dataStaffByCompany, companyName, dataReportProjectInteract }: Props) => {
    const theme = useTheme()
    const router = useRouter()
    const elementRef = useRef<any>(null);

    const countExpectedValueByStaff = (nhanVienID: any) => {
        let count = 0
        dataReportProjectInteract.map((item) => {
            if (item?.nhanVien?.nhanVienID === nhanVienID) count += item.doanhThuDuKien
        })
        return count
    }
    const briefCompanyName = (companyName: string) => {
        if (companyName?.toLowerCase().includes("công ty cổ phần giáo dục")) {
            return companyName?.toLowerCase()?.replace("công ty cổ phần giáo dục", "").trim().toUpperCase()
        }
        if (companyName?.toLowerCase().includes("công ty tnhh công nghệ - thiết bị - giáo dục")) {
            return companyName?.toLowerCase()?.replace("công ty tnhh công nghệ - thiết bị - giáo dục", "").trim().toUpperCase()
        }
        if (companyName?.toLowerCase().includes("công ty cổ phần phát triển")) {
            return companyName?.toLowerCase()?.replace("công ty cổ phần phát triển", "").trim().toUpperCase()
        }
        else if (companyName.includes("Công ty Cổ phần Giải pháp Công nghệ")) {
            return companyName?.toLowerCase()?.replace("công ty cổ phần giải pháp công nghệ", "").trim().toUpperCase()
        }
        return companyName?.toUpperCase()
    }
    const dataExpectedValue = useMemo(() => {
        let data: any = []
        dataStaffByCompany?.map((staff, index) => {
            data.push({
                id: index,
                value: countExpectedValueByStaff(staff?.nhanVienID),
                label: staff?.tenNhanVien,
                color:generateContrastingColors(dataStaffByCompany?.length)?.[index]
            })
        })

        return data
    }, [dataStaffByCompany, dataReportProjectInteract])

    const countActualValueByStaff = (nhanVienID: any) => {
        let count = 0
        dataReportProjectInteract.map((item) => {
            if (item?.nhanVien?.nhanVienID === nhanVienID) count += item.doanhThuThucTe
        })
        return count
    }

    const dataActualValue = useMemo(() => {
        let data: any = []
        dataStaffByCompany?.map((staff, index) => {
            data.push({
                id: index,
                value: countActualValueByStaff(staff?.nhanVienID),
                label: staff?.tenNhanVien,
                color:generateContrastingColors(dataStaffByCompany?.length)?.[index]
            })
        })

        return data
    }, [dataStaffByCompany, dataReportProjectInteract])

    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Cơ cấu giá trị cơ hội {briefCompanyName(companyName)}</Typography>
                    <PieChartResponsive
                        data={dataExpectedValue}

                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Cơ cấu doanh thu {briefCompanyName(companyName)}</Typography>
                    <PieChartResponsive
                        data={dataActualValue}

                    />
                </Box>
            </Grid>
        </Grid>
    )
}
export default PieChartOverviewStaff