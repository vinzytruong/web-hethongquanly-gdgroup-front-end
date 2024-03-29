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

const CheckingPage = () => {
    const { getAllChecking, dataChecking, isLoadding,getPersonInDepartment } = useChecking()
    const { dataDepartment, getAllDepartment } = useDepartment()
    const [selected, setSelected] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [filterData,setFilterData]=useState<CheckingStateProps>(dataChecking)
    const theme = useTheme()
    useEffect(() => {
        getAllChecking()
        setFilterData(dataChecking)
    }, [dataChecking, getAllChecking])
    console.log("dataCheckin",dataChecking);
    const seenIDs = new Set<any>();

    const filteredArrayUnique = filterData?.dataChecking?.filter((item: any) => {
        if (!seenIDs.has(item.personID)) {
            seenIDs.add(item.personID);
            return true;
        }
        return false;
    });
        


    const handleListItemClick = (
        event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
        id: number,
        name: string
    ) => {

        getPersonInDepartment(id, name)
        // console.log('vsdnbk',dataPersonByDepartment);
        // const filterData=filteredArrayUnique?.filter((item) => dataPersonByDepartment!.find((itemDepartment: any) => itemDepartment.personID === item.personID))
        // setFilterData({dataChecking:})
        setOpen(false);
        setSelected(name)
        
    };

    return (
        <AdminLayout>
            <Box padding="24px">
                <Box display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' gap={3}>
                    <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>

                        <Typography variant="h3" color={theme.palette.primary.main}>
                            Chấm công
                        </Typography>
                        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={1}>
                            <FilterSection 
                            title='Công ty' 
                            handleListItemClick={handleListItemClick}
                            handleOpen={setOpen}
                            open={open}
                            selected={selected}
                            />
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
                                        total:filteredArrayUnique!.length.toString()
                                    },
                                    {
                                        title:'Thống kê',
                                        content:<></>,
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