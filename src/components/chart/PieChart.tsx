import React, { useEffect, useRef, useState } from 'react';
import PieChart, {
    Legend,
    Series,
    Tooltip,
    Format,
    Label,
    Connector,
    Export,
} from 'devextreme-react/pie-chart';
import { Box, Divider, Typography, useTheme } from '@mui/material';

function customizeTooltip(arg: { valueText: string; percent: number; }) {
    return {
        text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
    };
}

interface Props {
    data: any,
    title: string
}

const CustomPieChart = (props: Props) => {
    const theme = useTheme()
    const heightRef = useRef(0);
    const widthRef = useRef(0);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hàm xử lý sự kiện thay đổi kích thước màn hình
        function handleResize() {
            // Lấy chiều cao của phần tử divRef và cập nhật tham chiếu heightRef
            if (divRef.current) {
                heightRef.current = divRef.current.clientHeight;
                widthRef.current = divRef.current.clientWidth;
            }
        }

        // Đăng ký sự kiện lắng nghe thay đổi kích thước màn hình
        window.addEventListener('resize', handleResize);

        // Gọi handleResize một lần khi component được mount để cập nhật chiều cao ban đầu
        handleResize();

        // Xóa bỏ sự kiện khi component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '32px',
                paddingBottom: '32px',
                borderBottom: 1,
                borderColor: theme.palette.text.secondary,
            }}>
                <Typography px={2} variant='h6'>{props.title}</Typography>
            </Box>
            <Box p={2} height='50vh' ref={divRef} >
                <PieChart
                    id="pie"
                    type="doughnut"
                    // title="Số lượng nhân viên các bước"
                    palette="Harmony Light"
                    dataSource={props.data}
                    size={{ height: (heightRef.current * 90) / 100 }}
                >
                    <Series argumentField="region">
                        <Label visible={true}>
                            <Connector visible={true} />
                        </Label>
                    </Series>
                    <Export enabled={true} />
                    <Legend margin={0} horizontalAlignment="left" verticalAlignment="bottom" />
                    <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
                        <Format />
                    </Tooltip>
                </PieChart>
            </Box>
        </Box>
    )
}

export default CustomPieChart;