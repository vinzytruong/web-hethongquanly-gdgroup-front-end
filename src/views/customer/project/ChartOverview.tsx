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
import { StaffDetail } from "@/interfaces/user"
import { formatCurrency } from "@/utils/formatCurrency"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"

interface Props {
    dataSteps: Step[],
    dataReportProjectInteract: ReportProjectInteract[],
    dataCompanys: Companys[]
}
const ChartOverview = ({ dataCompanys, dataReportProjectInteract, dataSteps }: Props) => {
    const theme = useTheme()
    const router = useRouter()
    const elementRef = useRef<any>(null);

    console.log("dataReportProjectInteract", dataReportProjectInteract);


    const countValueByStep = (step: any) => {
        let count = 0
        dataReportProjectInteract.map((item) => {
            if (item.buocThiTruong.buocThiTruongTen === step) count += item.doanhThuDuKien
        })
        return count
    }

    const countActualValueByCompany = (congTyID: any) => {
        let count = 0
        dataReportProjectInteract?.map((item) => {
            if (item?.nhanVien?.lstChucVuView?.[0]?.lstCongTy?.congTyID === congTyID) count += item.doanhThuThucTe
        })
        return count
    }

    const countExpectedValueByCompany = (congTyID: any) => {
        let count = 0
        dataReportProjectInteract?.map((item) => {
            if (item?.nhanVien?.lstChucVuView?.[0]?.lstCongTy?.congTyID === congTyID) count += item.doanhThuDuKien
        })
        return count
    }

    const totalActualValueByCompany = () => {
        let count = 0
        dataActualValuesByCompany?.map((item) => {
            count += item
        })
        return count
    }
    const totalExpectedValueByCompany = () => {
        let count = 0
        dataExpectedValuesByCompany?.map((item) => {
            count += item
        })
        return count
    }

    const dataLabelsByStep = useMemo(() => {
        let data: string[] = []
        dataSteps?.map(item => {
            data.push(item.buocThiTruongTen)
        })
        return data
    }, [dataSteps])

    const dataValuesByStep = useMemo(() => {
        let data: number[] = []
        dataSteps?.map(item => {
            data.push(countValueByStep(item.buocThiTruongTen))
        })
        return data
    }, [countValueByStep, dataSteps])

    const dataActualValuesByCompany = useMemo(() => {
        let data: number[] = []
        dataCompanys?.map(item => {
            data.push(countActualValueByCompany(item?.congTyID))
        })
        return data
    }, [countActualValueByCompany, dataCompanys])

    const dataExpectedValuesByCompany = useMemo(() => {
        let data: number[] = []
        dataCompanys?.map(item => {
            data.push(countExpectedValueByCompany(item?.congTyID))
        })
        return data
    }, [countExpectedValueByCompany, dataCompanys])
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
        else if (companyName?.includes("Công ty Cổ phần Giải pháp Công nghệ")) {
            return companyName?.toLowerCase()?.replace("công ty cổ phần giải pháp công nghệ", "").trim().toUpperCase()
        }
        return companyName?.toUpperCase()
    }
    const dataLabelsByCompany = useMemo(() => {
        let data: string[] = []
        dataCompanys?.map(item => {
            data.push(briefCompanyName(item?.tenCongTy))
        })
        return data
    }, [dataCompanys])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Giá trị cơ hội theo công ty</Typography>
                    <BasicComposition
                        data={dataExpectedValuesByCompany}
                        labels={dataLabelsByCompany}
                    />
                    <Typography py={1} align="center">Tống giá trị cơ hội: <span style={{ fontWeight: "bold" }}>{formatCurrency(totalExpectedValueByCompany())}</span></Typography>


                </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
                <Box sx={{ border: 1, borderColor: theme.palette.grey[400], borderRadius: '8px', p: 3 }}>
                    <Typography variant="h6">Doanh thu theo công ty</Typography>
                    <BasicComposition
                        data={dataActualValuesByCompany}
                        labels={dataLabelsByCompany}
                    />
                    <Typography py={1} align="center">Tống doanh thu: <span style={{ fontWeight: "bold" }}>{formatCurrency(totalActualValueByCompany())}</span></Typography>
                </Box>
            </Grid>
        </Grid>

    )
}
export default ChartOverview