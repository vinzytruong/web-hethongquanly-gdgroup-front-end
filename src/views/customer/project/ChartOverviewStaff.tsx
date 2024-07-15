/* eslint-disable react-hooks/exhaustive-deps */
import MainCard from "@/components/card/MainCard"
import BasicComposition from "@/components/chart/ChartResponsive"
import ColumnBarChart from "@/components/chart/ColumnChart"
import MUIPieActiveArc from "@/components/chart/MUIPieActiveArc"
import useCompanys from "@/hooks/useCompanys"
import useInteraction from "@/hooks/useInteraction"
import useOrganization from "@/hooks/useOrganization"
import useStaff from "@/hooks/useStaff"
import { Companys } from "@/interfaces/companys"
import { ReportProjectInteract } from "@/interfaces/reportProjectInteract"
import { Step } from "@/interfaces/step"
import { Staff, StaffDetail } from "@/interfaces/user"
import { formatCurrency } from "@/utils/formatCurrency"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"

interface Props {
    companyName: string,
    dataReportProjectInteract: ReportProjectInteract[],
}
const ChartOverviewStaff = ({ dataReportProjectInteract, companyName }: Props) => {
    const theme = useTheme()
    const router = useRouter()
    const elementRef = useRef<any>(null);

    console.log("dataReportProjectInteract", dataReportProjectInteract);

    const countExpectedValueByStaff = (nhanVienID: any) => {
        let count = 0
        dataReportProjectInteract?.map((item) => {
            if (item?.nhanVien?.nhanVienID === nhanVienID) count += item.doanhThuDuKien
        })
        return count
    }

    const countActualValueByStaff = (nhanVienID: any) => {
        let count = 0
        dataReportProjectInteract?.map((item) => {
            if (item?.nhanVien?.nhanVienID === nhanVienID) count += item.doanhThuThucTe
        })
        return count
    }

    const dataExpectedValuesByStaffOfCompany = useMemo(() => {
        let data: number[] = []
        dataReportProjectInteract?.map(item => {
            data.push(countExpectedValueByStaff(item?.nhanVien?.nhanVienID))

        })
        return data
    }, [countExpectedValueByStaff, dataReportProjectInteract])



    const dataActualValuesByStaffOfCompany = useMemo(() => {
        let data: number[] = []
        dataReportProjectInteract?.map(item => {
            data.push(countActualValueByStaff(item?.nhanVien?.nhanVienID))

        })
        return data
    }, [countActualValueByStaff, dataReportProjectInteract])


    const dataLabelsByStaffOfCompany = useMemo(() => {
        let data: string[] = []
        dataReportProjectInteract?.map(item => {
            data.push(item?.nhanVien?.tenNhanVien)
        })
        return data
    }, [dataReportProjectInteract])

    const totalActualValueByCompany = () => {
        let count = 0
        dataActualValuesByStaffOfCompany?.map((item) => {
            count += item
        })
        return count
    }
    const totalExpectedValueByCompany = () => {
        let count = 0
        dataExpectedValuesByStaffOfCompany?.map((item) => {
            count += item
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Giá trị cơ hội của nhân viên {briefCompanyName(companyName)}</Typography>
                    <BasicComposition
                        data={dataExpectedValuesByStaffOfCompany}
                        labels={dataLabelsByStaffOfCompany}
                    />
                    <Typography py={1} align="center">Tống giá trị cơ hội: <span style={{ fontWeight: "bold" }}>{formatCurrency(totalExpectedValueByCompany())}</span></Typography>
                </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Doanh thu của nhân viên {briefCompanyName(companyName)}</Typography>
                    <BasicComposition
                        data={dataActualValuesByStaffOfCompany}
                        labels={dataLabelsByStaffOfCompany}
                    />
                    <Typography py={1} align="center">Tống doanh thu: <span style={{ fontWeight: "bold" }}>{formatCurrency(totalActualValueByCompany())}</span></Typography>
                </Box>
            </Grid>
        </Grid>
    )
}
export default ChartOverviewStaff