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
import useInteraction from '@/hooks/useInteraction';

function customizeTooltip(arg: { valueText: string; percent: number; }) {
  return {
    text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
  };
}
export const populationByRegions = [{
  region: 'GDClass',
  val: 4119626293,
}, {
  region: 'Tin học',
  val: 1012956064,
}, {
  region: 'GDSchool',
  val: 344124520,
}, {
  region: 'Bộ học liệu điện tử',
  val: 590946440,
}, {
  region: 'Phần mềm 3D',
  val: 727082222,
}, {
  region: 'GDLib',
  val: 35104756,
}];


const OpportunityValueChartByMoney = () => {
  const heightRef = useRef(0);
  const widthRef = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);
  const { dataInteraction } = useInteraction()
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

  const renderDataSteps = () => {
    let data: any[] = []
    dataInteraction.map((item, index) => {
      console.log(`Số nhân viên: ${countStaffByStep(item.buocThiTruong)}\n Doanh thu dự kiến: ${countValueByStaffByStep(item.buocThiTruong)}`);
      data = [
        ...data,
        {
          region: `Số lượng nhân viên ở bước ${item.buocThiTruong}`,
          val: countValueByStaffByStep(item.buocThiTruong)
        }
      ]

    })
    return data
  }
  const countStaffByStep = (step: any) => {
    let count = 0
    dataInteraction.map((item, index) => {
      if (item.buocThiTruong === step) count++
    })
    return count
  }

  const countValueByStaffByStep = (step: any) => {
    let count = 0
    dataInteraction.map((item, index) => {
      if (item.buocThiTruong === step) count += item.doanhThuDuKien
    })
    return count
  }

  
  console.log(populationByRegions);
  const theme = useTheme()

  return (
    <Box >
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='flex-start'
        sx={{
          paddingTop: '32px',
          paddingBottom: '32px',
          borderBottom: 1,
          borderColor: theme.palette.text.secondary,
        }}

      >
        <Typography
          px={2}
          variant='h6'>Báo cáo số lượng nhân viên tại mỗi bước</Typography>

      </Box>
      <Box p={2} height='50vh' ref={divRef} >
        <PieChart
          id="pie"
          type="doughnut"
          // title="Số lượng nhân viên các bước"
          palette="Harmony Light"
          dataSource={renderDataSteps()}

          size={{ height: (heightRef.current * 90) / 100 }}
        >

          <Series argumentField="region">
            <Label visible={true}>
              <Connector visible={true} />
            </Label>
          </Series>

          <Export enabled={true} />
          <Legend margin={0} horizontalAlignment="center" verticalAlignment="bottom" />
          <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
            <Format />
          </Tooltip>
        </PieChart>
      </Box>

    </Box>


  )
}

export default OpportunityValueChartByMoney;