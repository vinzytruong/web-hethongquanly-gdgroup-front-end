import { DefaultCardItem } from "@/components/card"
import useChecking from "@/hooks/useChecking"
import { Box, Grid, Typography, useTheme } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react"
import moment from "moment";
import dayjs from "dayjs";
import { GetChecking } from "@/interfaces/checking";
import { StyledButton } from "@/components/styled-button";

const TabReportCheckIn = (data: any) => {
    const { getCheckInNow, dataChecking, isLoadding, getPersonInDepartment, getCheckInFromDateToDate } = useChecking()
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const theme = useTheme()
    useEffect(() => {
        console.log("change", dayjs(dateFrom).startOf('day').valueOf(), dayjs(dateTo).endOf('day').valueOf());

        if (dateFrom && dateTo) getCheckInFromDateToDate('2610678871007166464', dayjs(dateFrom).startOf('day').valueOf(), dayjs(dateTo).endOf('day').valueOf())
    }, [dateFrom, dateTo])
    // console.log(moment(dateFrom).startOf('day').valueOf(),moment(dateTo).endOf('day').valueOf());
    const filterData = () => {
        const startDay = dayjs(dateFrom).day()
        const endDay = dayjs(dateFrom).day()

        return dataChecking.dataChecking?.filter((item) => dayjs(item.checkinTime).day() >= startDay && dayjs(item.checkinTime).day() <= endDay)

    }
    // const startDate=dayjs(dateFrom).day()

    // console.log("dddd",startDate);
    return (
        <Box>
            <Box sx={{ width: '100%' }} display='flex' gap={2}>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dateFrom}
                        onChange={(newValue: any) => setDateFrom(newValue)}
                        disableFuture={true}
                        format="DD/MM/YYYY"
                    />
                    <DatePicker
                        value={dateTo}
                        onChange={(newValue: any) => setDateTo(newValue)}
                        disableFuture={true}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
                {/* <StyledButton onClick={()=>getCheckInFromDateToDate('2610678871007166464', moment(dateFrom).startOf('day').valueOf(), moment(dateTo).endOf('day').valueOf())}>
                    Lọc
                </StyledButton> */}

            </Box>

            {filterData()!.map((item: any, index: any) => (
                <Box key={index}>{item.personName}------------{moment(item.checkinTime).format('DD/MM/YYYY hh:mm')}</Box>
            ))}

        </Box >

    )
}
export default TabReportCheckIn;