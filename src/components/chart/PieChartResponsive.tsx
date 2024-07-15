import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useTheme ,useMediaQuery} from '@mui/material';
import { PiePlot } from '@mui/x-charts/PieChart';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';


interface Props {
  title?: string,
  data: any[],
  width?: number,
  height?: number
}

export default function PieChartResponsive(props: Props) {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getChartDimensions  = () =>{
    return isMobile ? props.data.length * 20 : 0
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', height: 370 + getChartDimensions () }} elevation={0}>
        {/* @ts-ignore */}
        <ResponsiveChartContainer
          series={[
            {
              type: 'pie',
              data: props?.data,
              innerRadius: 1,
              outerRadius: isMobile ? 115 : 150,
              paddingAngle: 0,
              cornerRadius: 4,
              startAngle: 0,
              endAngle: 360,
              cx: isMobile? '50%' : '20%',
              cy: isMobile? '25%' : '50%',
            },

          ]}
        // yAxis={[{ valueFormatter }]}

        >
         
          <PiePlot />
          <ChartsTooltip
            trigger="item"
            formatter={(params: any) => `${params.data.label}: ${formatCurrency(params.data.value)}`}
          />
          <ChartsLegend
            direction={isMobile ? "row" : "column"}
            position={{
              vertical: isMobile? 'bottom' : 'top',
              horizontal: isMobile ? 'left' : 'right',
            }}
          />
        </ResponsiveChartContainer>
      </Paper>
    </Box>
  );
}
