import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';


interface Props {
  title?:string,
  data: any[],
  width?: number,
  height?: number
}
export default function MUIPieActiveArc(props: Props) {
  return (
    <PieChart
      series={[
        {
          data:props?.data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      slotProps={{
        legend: {
          
          direction: "column",
          
          position: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          itemMarkWidth: 12,
          itemMarkHeight: 12,
          markGap: 4,
          itemGap: 12,
        }
      }}
      sx={{ padding: 1}}
      margin={{ top: 0, left: 0, right:240 }}
      width={props?.width ? props?.width : 600}
      height={props?.height ? props?.height : 400}
      
    />
  );
}
