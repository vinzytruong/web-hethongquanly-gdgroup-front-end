import { Chart } from "react-google-charts";
import MainCard from "../card/MainCard";
import { Line } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7','Th8','Th9','Th10', 'Th11', 'Th12'];

const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: labels.map(() =>  faker.number.int({min:0,max:90})),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const BajajAreaChartCard = () => {
  
  return (
    
      <Line options={options} data={data} />
   

  )
}

export default BajajAreaChartCard;