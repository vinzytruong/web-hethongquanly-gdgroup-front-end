import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
                <Box>
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
interface TabProps {
    title: string,
    content: React.ReactNode,
    total?: string
}
interface TabPropsArray {
    dataTabs: TabProps[]
}
const CustomizeTab = ({ dataTabs }: TabPropsArray) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box alignItems='flex-start' justifyContent='flex-start' display='flex' flexDirection='column' sx={{ width: '100%' }}>
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
                    sx={{ px: 0, py: 3 }}
                >
                    {dataTabs.map((item, idx) =>
                        <Tab key={idx} sx={{ pt: 0, pb: 2 }} label={item.title + ` ${item.total ? `(${item.total})`:''}`} {...a11yProps(idx)} />
                    )}
                </Tabs>
            </Box>
            {dataTabs.map((item, idx) =>
                <CustomTabPanel key={idx} value={value} index={idx} >
                    {item.content}
                </CustomTabPanel>
            )}
        </Box>
    );
}
export default CustomizeTab;