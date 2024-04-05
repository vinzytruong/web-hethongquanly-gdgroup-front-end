/* eslint-disable react-hooks/exhaustive-deps */
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
import { getUnique } from "@/utils/getUnique";
import TableCheckin from "@/components/table/table-checkin/TableCheckin";
import { GET_DATA_CHECKING } from "@/store/checking/action";
import { useAppDispatch } from "@/store/hook";

const TabReportCheckIn = (data: any) => {
    const { getCheckInNow, dataChecking, isLoadding, getPersonInDepartment, getCheckInFromDateToDate } = useChecking()
    const [date, setDate] = useState(dayjs());
    // const [dateTo, setDateTo] = useState();
    const theme = useTheme();
    const [viewId, setViewId] = useState<number>(0);
    const [openCard, setOpenCard] = useState<boolean>(false);
    let dataTempTest:any[]=[]
    const dispatch = useAppDispatch();

    useEffect(() => {
        let personIDs: (string)[] = []
        getUnique(dataChecking.dataChecking)?.map((item: any) => {
            personIDs.push(item.personID)

        })
        const stringPersonIDs = personIDs.join(',')
        

        if (date) {
            // for(let i=0;i<=personIDs.length;i++){
            //     getCheckInFromDateToDate(personIDs[i], dayjs(date).startOf('month').valueOf(), dayjs(date).endOf('month').valueOf())
            //     dataTempTest= [...dataTempTest, {personID:personIDs[i],data:dataChecking.dataChecking?.filter(itemx=>itemx.personID===personIDs[i])}]
            // }
                
                
            //    console.log("cccc",dataChecking);
               
            //    console.log("dataTempTest", dataTempTest);
            //    getCheckInFromDateToDate(stringPersonIDs, dayjs(date).startOf('month').valueOf(), dayjs(date).endOf('month').valueOf())
               getCheckInFromDateToDate(personIDs[1], dayjs(date).startOf('month').valueOf(), dayjs(date).endOf('month').valueOf())
         
        }
    }, [date])
    

    const maxObject = (obj: any) => {
        let maxValueObject = obj[0]; // Giả sử phần tử đầu tiên có giá trị lớn nhất

        for (let i = 1; i < obj.length; i++) {
            if (obj[i].checkinTime > maxValueObject.checkinTime) {
                maxValueObject = obj[i];
            }
        }
        return maxValueObject?.checkinTime
    }

    const minObject = (obj: any) => {
        let minValueObject = obj[0]; // Giả sử phần tử đầu tiên có giá trị lớn nhất

        for (let i = 1; i < obj.length; i++) {
            if (obj[i].checkinTime < minValueObject.checkinTime) {
                minValueObject = obj[i];
            }
        }
        return minValueObject?.checkinTime
    }
    const filterDataCheckInByPersonID = (id: any) => dataChecking.dataChecking!.filter((item) => item.personID === id)
    const filterData = (id: any) => {
        const month = dayjs(date).month()
        const year = dayjs(date).year()
        const startDay = dayjs(date).startOf('month').date()
        const endDay = dayjs(date).endOf('month').date()


        let arr: any[] = []
        for (let i = startDay; i <= endDay; i++) {
            const startDayValueOf = dayjs(`${month + 1}/${i}/${year}`).startOf('day').valueOf()
            const endDayValueOf = dayjs(`${month + 1}/${i}/${year}`).endOf('day').valueOf()
            // console.log("start-end", startDayValueOf, endDayValueOf, `${i}/${month + 1}/${year}`);

            arr = [
                ...arr,
                {
                    key: dayjs(`${month + 1}/${i}/${year}`).format('DD-MM'),
                    value: [
                        minObject(filterDataCheckInByPersonID(id).filter((item: any) => dayjs(item.checkinTime).valueOf() >= startDayValueOf && dayjs(item.checkinTime).valueOf() <= endDayValueOf)),
                        maxObject(filterDataCheckInByPersonID(id).filter((item: any) => dayjs(item.checkinTime).valueOf() >= startDayValueOf && dayjs(item.checkinTime).valueOf() <= endDayValueOf))
                    ]
                }
            ]

            // arr.map((item, idx) => console.log(arr[idx]))


        }
        return arr

    }
    const headerData = () => {
        const month = dayjs(date).month()
        const year = dayjs(date).year()
        const startDay = dayjs(date).startOf('month').date()
        const endDay = dayjs(date).endOf('month').date()


        let arr: any[] = []
        for (let i = startDay; i <= endDay; i++) {
            const startDayValueOf = dayjs(`${month + 1}/${i}/${year}`).startOf('day').valueOf()
            const endDayValueOf = dayjs(`${month + 1}/${i}/${year}`).endOf('day').valueOf()
            // console.log("start-end", startDayValueOf, endDayValueOf, `${i}/${month + 1}/${year}`);

            arr = [
                ...arr,
                {
                    key: dayjs(`${month + 1}/${i}/${year}`).format('DD-MM'),
                }
            ]
        }
        return arr

    }
    const fillData = () => {
        const data: any[] = []
        getUnique(dataChecking.dataChecking)?.map((checkin: any, indexCheckin: any) =>
            data.push(
                {
                    name: checkin.personName,
                    dataCheckInTime: filterData(checkin.personID)
                }
            )
        )
        return data
    }
    console.log('AAAAAAAAA', dataChecking.dataChecking);
    return (
        <Box>
            <Box sx={{ width: '100%' }} display='flex' gap={2} px={3}>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={date}
                        onChange={(newValue: any) => setDate(newValue)}
                        disableFuture={true}
                        format="MM-YYYY"
                        views={['month', 'year']}
                    />

                </LocalizationProvider>
            </Box>
            <TableCheckin
                rows={fillData()}
                isAdmin={true}
                handleViewId={setViewId}
                handleOpenCard={setOpenCard}
                headerCell={headerData()}
            />
        </Box >

    )
}
export default TabReportCheckIn;