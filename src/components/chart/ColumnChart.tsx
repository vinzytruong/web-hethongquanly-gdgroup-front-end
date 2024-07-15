import React, { useEffect, useMemo, useRef, useState } from 'react';

import Chart, {
  ArgumentAxis,
  Label,
  Legend,
  Series,
  Title
} from 'devextreme-react/chart';
import { Box, Typography, useTheme } from '@mui/material';
import { title } from 'process';
import { BarChart } from '@mui/x-charts/BarChart';
import { formatNumber } from '@/utils/formatCurrency';

interface Props {
  labels: string[],
  title?:string,
  data: any[],
  width?: number,
  height?: number
}
const ColumnBarChart = (props: Props) => {
  const pData = props.data
  const xLabels = props.labels
  const theme = useTheme()
  const valueFormatter = (value: number) => `${formatNumber(value)}`;

  return (
    <BarChart
      sx={{ padding: 1 }}
      width={props?.width ? props?.width : 600}
      height={props?.height ? props?.height : 400}
      series={[
        {
          data: pData,
          label: props?.title,
          type: 'bar',
          color:theme.palette.primary.main
        },
      ]}
      yAxis={[{ valueFormatter }]}
      xAxis={[{
        scaleType: 'band',
        data: xLabels,
        colorMap: {
          type: 'ordinal',
          colors: [theme.palette.primary.main]
        }
      }]}
      slotProps={{
        bar: {
          clipPath: `inset(0px round 4px 4px 0px 0px)`,
        },
      }}
    />
  )
}

export default ColumnBarChart;