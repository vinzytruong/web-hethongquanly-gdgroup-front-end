import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { formatNumber } from '@/utils/formatCurrency';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { useTheme } from '@mui/material';


interface Props {
    labels: string[],
    title?:string,
    data: any[],
    width?: number,
    height?: number
  }

export default function BasicComposition(props: Props) {
  const [isResponsive, setIsResponsive] = React.useState(false);
  const theme = useTheme()

  const valueFormatter = (value: number) => `${formatNumber(value)}`;
  return (
    <Box sx={{ width: '100%' }}>
      

      <Paper sx={{ width: '100%', height: 300 }} elevation={0}>
        {/* @ts-ignore */}
        <ResponsiveChartContainer
          series={[
            {
              type: 'bar',
              data: props.data,
            },
           
          ]}
          xAxis={[
            {
              data: props.labels,
              scaleType: 'band',
              id: 'x-axis-id',
              colorMap: {
                type: 'ordinal',
                colors: [theme.palette.primary.main]
              }
            },
          ]}
          yAxis={[{ valueFormatter }]}
          
        >
          <BarPlot />
   
          <ChartsAxis label="X axis" position="bottom" axisId="x-axis-id" />
          <ChartsTooltip />
          <ChartsAxisHighlight y='band' />
        </ResponsiveChartContainer>
      </Paper>
    </Box>
  );
}
