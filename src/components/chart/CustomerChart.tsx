import React, { useEffect, useRef, useState } from 'react';

import Chart, {
  ArgumentAxis,
  Label,
  Legend,
  Series,
  Title
} from 'devextreme-react/chart';
import { Box, Typography } from '@mui/material';

const populationData = [
  {
    arg: 'Th01',
    val: 3032019978,
  },
  {
    arg: 'Th02',
    val: 3683676306,
  },
  {
    arg: 'Th03',
    val: 4434021975,
  },
  {
    arg: 'Th04',
    val: 5281340078,
  },
  {
    arg: 'Th05',
    val: 6115108363,
  },
  {
    arg: 'Th06',
    val: 6922947261,
  },
  {
    arg: 'Th08',
    val: 7795000000,
  },
  {
    arg: 'Th09',
    val: 7795000000,
  },
  {
    arg: 'Th10',
    val: 5281340078,
  },
  {
    arg: 'Th11',
    val: 5281340078,
  },
  {
    arg: 'Th12',
    val: 5281340078,
  },
];
const BajajAreaChartCard = () => {
  const heightRef = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hàm xử lý sự kiện thay đổi kích thước màn hình
    function handleResize() {
      // Lấy chiều cao của phần tử divRef và cập nhật tham chiếu heightRef
      if (divRef.current) {
        heightRef.current = divRef.current.clientHeight;
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
    <Box height='60vh' p={1} ref={divRef}>
    <Chart
      // title='Thống kê sản phẩm theo tháng'
      dataSource={populationData}
      id="chart"
      size={{height:(heightRef.current*90)/100}}
    >
      <ArgumentAxis tickInterval={10}>
        <Label format="decimal" />
      </ArgumentAxis>

      <Series
        type="bar"
        
      />

      <Legend
        visible={false}
      />
    <Title text="Khách hàng" alignment='left' verticalAlignment='top' />
    </Chart>
  </Box>

  )
}

export default BajajAreaChartCard;