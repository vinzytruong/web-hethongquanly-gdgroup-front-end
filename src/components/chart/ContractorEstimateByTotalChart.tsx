import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ContractorEstimate } from '@/interfaces/contractorEstimate';
import { Staff } from '@/interfaces/user';

const chartSetting = {
    height: 500,

};


const valueFormatterX = (value: number | null) => `${value?.toLocaleString()} Đ`;
const valueFormatterY = (value: number | null) => {
    if (value === null || value === undefined) return '0';
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M `;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return `${value.toLocaleString()} Đ`;
};
export interface Props {
    filterModify: number,
    dataContractorEstimate?: ContractorEstimate[],
    dataStaffs: Staff[]
}

export default function ContractorEstimateByTotalChart({ filterModify, dataContractorEstimate, dataStaffs }: Props) {
    const [dataset, setDataset] = React.useState([
        {
            duKien: 0,
            thanhCong: 0,
            thatBai: 0,
            name: 'Tất cả',
        },
    ]);

    React.useEffect(() => {


        if (dataContractorEstimate && dataContractorEstimate.length > 0) {
            let duKien = 0;
            let thanhCong = 0;
            let thatBai = 0;
            dataContractorEstimate.forEach((item) => {
                duKien += item.doanhThuDuKien;
                if (item.ketQua === true) {
                    thanhCong += item.doanhThuDuKien;
                } else if (item.ketQua === false) {
                    thatBai += item.doanhThuDuKien;
                }
            });

            const name = "Tổng tiền";

            const updatedData = [
                {
                    duKien,
                    thanhCong,
                    thatBai,
                    name,
                },
            ];
            setDataset(updatedData);
        }
    }, [dataContractorEstimate]);

    return (
        <BarChart
            dataset={dataset}
            yAxis={[
                {
                    scaleType: 'linear',
                    valueFormatter: valueFormatterY,
                    tickNumber: 5
                },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            series={[
                { dataKey: 'duKien', label: 'Dự kiến', valueFormatter: valueFormatterX, color: '#2196f3' },
                { dataKey: 'thanhCong', label: 'Thành công', valueFormatter: valueFormatterX, color: '#4caf50' },
                { dataKey: 'thatBai', label: 'Thất bại', valueFormatter: valueFormatterX, color: '#ff3d00' },
            ]}
            {...chartSetting}
        />
    );
}
