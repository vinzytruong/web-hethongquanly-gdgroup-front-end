import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
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
const generateTicks = (min: number, max: number, numTicks: number) => {
    const step = (max - min) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => min + step * i);
};
export interface Props {
    filterModify: number,
    dataContractorEstimate?: ContractorEstimate[],
    dataStaffs: Staff[],
    width?: number,
}

export default function ContractorEstimateByStaffChart({ filterModify, dataContractorEstimate, dataStaffs }: Props) {
    const [dataset, setDataset] = React.useState([
        {
            duKien: 0,
            thanhCong: 0,
            thatBai: 0,
            name: 'Tất cả',
        },
    ]);

    React.useEffect(() => {
        console.log('1', dataContractorEstimate);
        console.log('2', dataContractorEstimate);
        console.log('3', filterModify);

        if (dataContractorEstimate && dataContractorEstimate.length > 0 && dataStaffs && dataStaffs.length > 0) {
            if (filterModify !== 0) {
                let duKien = 0;
                let thanhCong = 0;
                let thatBai = 0;
                dataContractorEstimate.forEach((item) => {
                    if (filterModify === item.nhanVienID) {
                        duKien += item.doanhThuDuKien;
                        if (item.ketQua === true) {
                            thanhCong += item.doanhThuDuKien;
                        } else if (item.ketQua === false) {
                            thatBai += item.doanhThuDuKien;
                        }
                    }
                });

                const staff = dataStaffs.find(item => item.nhanVienID === filterModify);
                const name = staff ? staff.tenNhanVien : "Unknown";

                const updatedData = [
                    {
                        duKien,
                        thanhCong,
                        thatBai,
                        name,
                    },
                ];
                setDataset(updatedData);
            } else {
                let updatedDataList: any = [];
                dataStaffs.forEach((staff) => {
                    let duKien = 0;
                    let thanhCong = 0;
                    let thatBai = 0;
                    dataContractorEstimate.forEach((contractorEstimate) => {
                        if (contractorEstimate.nhanVienID === staff.nhanVienID) {
                            duKien += contractorEstimate.doanhThuDuKien;
                            if (contractorEstimate.ketQua === true) {
                                thanhCong += contractorEstimate.doanhThuDuKien;
                            } else if (contractorEstimate.ketQua === false) {
                                thatBai += contractorEstimate.doanhThuDuKien;
                            }
                        }
                    });
                    const name = staff.tenNhanVien;
                    updatedDataList.push({
                        duKien,
                        thanhCong,
                        thatBai,
                        name
                    })
                })
                setDataset(updatedDataList);
            }
        }
    }, [filterModify, dataContractorEstimate, dataStaffs]);

    return (
        <BarChart
            dataset={dataset}
            yAxis={[
                {
                    scaleType: 'linear',
                    valueFormatter: valueFormatterY,
                    tickNumber:5
                },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            series={[
                { dataKey: 'duKien', label: 'Dự kiến', valueFormatter: valueFormatterX, color: '#2196f3' },
                { dataKey: 'thanhCong', label: 'Thành công', valueFormatter: valueFormatterX, color: '#4caf50' },
                { dataKey: 'thatBai', label: 'Thất bại', valueFormatter: valueFormatterX, color: '#ff3d00' },
            ]}
            {...chartSetting}
            slotProps={{
                bar: {
                    clipPath: `inset(0px round 4px 4px 0px 0px)`,
                },
            }}
        />
    );
}
