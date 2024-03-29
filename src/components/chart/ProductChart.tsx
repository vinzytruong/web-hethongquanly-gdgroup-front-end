import React, { useEffect, useRef } from 'react';
import PieChart, {
  Legend,
  Series,
  Tooltip,
  Format,
  Label,
  Connector,
  Export,
} from 'devextreme-react/pie-chart';
import { Box } from '@mui/material';

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


const ProductChart = () => {
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
      <PieChart
        id="pie"
        type="doughnut"
        title="Sản phẩm"
        palette="Soft Pastel"
        dataSource={populationByRegions}
        size={{height:(heightRef.current*90)/100}}
      >
        <Series argumentField="region">
          <Label visible={true} format="millions">
            <Connector visible={true} />
          </Label>
        </Series>
        <Export enabled={true} />
        <Legend margin={0} horizontalAlignment="center" verticalAlignment="bottom" />
        <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
          <Format type="millions" />
        </Tooltip>
      </PieChart>
    </Box>


  )
}

export default ProductChart;