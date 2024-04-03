import { DefaultCardItem } from "@/components/card";
import FilterSection from "@/components/filter";
import { AdminLayout } from "@/components/layout";
import SearchSection from "@/components/search/SearrchSection";
import { StyledButton } from "@/components/styled-button";
import TableStaff from "@/components/table/table-staff/TableStaff";
import CustomizeTab from "@/components/tabs";
import useChecking from "@/hooks/useChecking";
import useStaff from "@/hooks/useStaff";
import { Box, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import TabCheckinDate from "./TabCheckinDate";
import useDepartment from "@/hooks/useDepartment";
import { CheckingStateProps } from "@/interfaces/checking";
import TabReportCheckIn from "./TabReportCheckIn";

const CheckingPage = () => {
    const { getCheckInNow, dataChecking, isLoadding,getPersonInDepartment,getCheckInFromDateToDate } = useChecking()

    const theme = useTheme()
    useEffect(() => {
        getCheckInNow()
        // getCheckInFromDateToDate(1709251200,1711843200)
    }, [])

    const seenIDs = new Set<any>();

    const filteredArrayUnique = dataChecking.dataChecking?.filter((item: any) => {
        if (!seenIDs.has(item.personID)) {
            seenIDs.add(item.personID);
            return true;
        }
        return false;
    });
        
    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap={3}>
                    <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>

                        <Typography variant="h3" color={theme.palette.primary.main}>
                            Chấm công
                        </Typography>
                        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>
                            {/* <FilterSection 
                            title='Công ty' 
                            handleListItemClick={handleListItemClick}
                            handleOpen={setOpen}
                            open={open}
                            selected={selected}
                            /> */}
                            <SearchSection />
                        </Box>
                    </Box>
                    {isLoadding ?
                        <Box display='flex' justifyContent='center' alignItems='center' width='100%' height='80vh'>
                            <CircularProgress />
                        </Box>
                        :
                        <Box sx={{ background: theme.palette.background.paper, p:1 }} width='100%'>
                            
                            <CustomizeTab dataTabs={
                                [
                                    {
                                        title:'Hôm nay',
                                        content:<TabCheckinDate data={filteredArrayUnique}/>,
                                        total:filteredArrayUnique?.length.toString()
                                    },
                                    {
                                        title:'Thống kê',
                                        content:<TabReportCheckIn data={dataChecking.dataChecking}/>,
                                    }
                                ]
                            } />
                        </Box>
                    }

                </Box>
            </Box>
        </AdminLayout>

    )
}
export default CheckingPage