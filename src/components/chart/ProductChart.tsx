import { faker } from "@faker-js/faker";
import MainCard from "../card/MainCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";
import { Box, useTheme } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7','Th8','Th9','Th10', 'Th11', 'Th12'];
const data = {
  labels,
  datasets: [
    {
      label: 'Sản phẩm',
      data: labels.map(() =>  faker.number.int({min:0,max:90})),
      backgroundColor:'#0CC0F1',
    },
  ],
};

const ProductChart = () => {
 
  return (
   
      <Box height='60vh'>
        <Bar options={options} data={data} style={{ height: "500px", width:'100%' }}/>
      </Box>

    
  )
}

export default ProductChart;