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
import { StaffDetail } from "@/interfaces/user"
import { generateContrastingColors, getRandomColor } from "@/utils/randomColor"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"
interface Props {
    dataReportProjectInteract: ReportProjectInteract[],
    dataCompanys: Companys[]
}
const PieChartOverview = ({ dataCompanys, dataReportProjectInteract }: Props) => {
    const theme = useTheme()
    const router = useRouter()
    const elementRef = useRef<any>(null);


    const countExpectedValueByCompany = (congTyID: any) => {
        let count = 0
        dataReportProjectInteract?.map((item) => {
            if (item?.nhanVien?.lstChucVuView?.[0]?.lstCongTy.congTyID === congTyID) count += item.doanhThuDuKien
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
        dataCompanys?.map((company, index) => {
            data.push({
                id: index,
                value: countExpectedValueByCompany(company?.congTyID),
                label: briefCompanyName(company?.tenCongTy),
                color:generateContrastingColors(dataCompanys?.length)?.[index]
            })


        })

        return data
    }, [dataCompanys, dataReportProjectInteract])

    const dataExpectedLabel = useMemo(() => {
        let data: any = []
        dataCompanys?.map((company, index) => {
            data.push(briefCompanyName(company?.tenCongTy),)


        })

        return data
    }, [dataCompanys, dataReportProjectInteract])




    const countActualValueByCompany = (congTyID: any) => {
        let count = 0
        dataReportProjectInteract.map((item) => {
            if (item?.nhanVien?.lstChucVuView?.[0]?.lstCongTy.congTyID === congTyID) count += item.doanhThuThucTe
        })
        return count
    }



    const dataActualValue = useMemo(() => {
        let data: any = []
        dataCompanys?.map((company, index) => {
            data.push({
                id: index,
                value: countActualValueByCompany(company?.congTyID),
                label: briefCompanyName(company?.tenCongTy),
                color:generateContrastingColors(dataCompanys?.length)?.[index]
            })
        })

        return data
    }, [dataCompanys, dataReportProjectInteract])

    const dataActualLabel = useMemo(() => {
        let data: any = []
        dataCompanys?.map((company, index) => {
            data.push(briefCompanyName(company?.tenCongTy))
        })

        return data
    }, [dataCompanys, dataReportProjectInteract])


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Cơ cấu giá trị cơ hội theo công ty</Typography>
                    <PieChartResponsive
                        data={dataExpectedValue}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Cơ cấu doanh thu theo công ty</Typography>
                    <PieChartResponsive
                        data={dataActualValue}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}
export default PieChartOverview