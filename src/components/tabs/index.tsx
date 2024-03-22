import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Sites } from '@/interfaces/site';
import NationalArchitectureTab from './items/NationalArchitectureTab';
import ProvinceTab from './items/ProvinceTab';
import ProvinceArchitectureTab from './items/ProvinceArchitectureTab';
import HistoricalSitesTab from './items/HistoricalSitesTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 5 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
interface Props {
    item: Sites[]
}
const SitesTab: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box pt={10} alignItems='center' justifyContent='center' display='flex' flexDirection='column' sx={{ width: '100%' }}>
            <Box>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // indicatorColor="secondary"
                    textColor='inherit'
                    variant="scrollable"
                    // scrollButtons
                    allowScrollButtonsMobile
                    aria-label="secondary tabs example"
                >
                    <Tab sx={{ pt: 3, pb: 3 }} label="Di tích lịch sử" {...a11yProps(0)} />
                    <Tab sx={{ pt: 3, pb: 3 }} label="Kiến trúc nghệ thuật cấp quốc gia" {...a11yProps(1)} />
                    <Tab sx={{ pt: 3, pb: 3 }} label="Kiến trúc nghệ thuật cấp tỉnh" {...a11yProps(2)} />
                    <Tab sx={{ pt: 3, pb: 3 }} label="Di tích lịch sử cấp tỉnh" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <HistoricalSitesTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <NationalArchitectureTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <ProvinceArchitectureTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <ProvinceTab />
            </CustomTabPanel>
        </Box>
    );
}
export default SitesTab;