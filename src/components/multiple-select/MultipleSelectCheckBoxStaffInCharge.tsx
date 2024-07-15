import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { StaffInCharge } from '@/interfaces/staffInCharge';
import { Checkbox, ListItemText } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props {
    onHandleSelectedStaffInCharge: (data: StaffInCharge[]) => void;
    staffInCharges: StaffInCharge[];
    selectedStaffInCharge: StaffInCharge[];
    error?: boolean;
    touched?: boolean;
}

export default function MultipleSelectCheckBoxStaffInCharge({
    onHandleSelectedStaffInCharge,
    staffInCharges,
    error,
    touched,
    selectedStaffInCharge,
}: Props) {
    const theme = useTheme();
    const [staffInChargeName, setGradeName] = React.useState<string[]>([]);
    const staffInChargesChild = staffInCharges.map(staffInCharge => `${staffInCharge.chucVu} - ${staffInCharge.tenNguoiPhuTrach} - ${staffInCharge.soDienThoai}`);
    console.log('dsdsdssds', staffInCharges);
    React.useEffect(() => {
        if (selectedStaffInCharge && selectedStaffInCharge.length > 0) {
            const selectedGradeNames = selectedStaffInCharge.map(staffInCharge => `${staffInCharge.chucVu} - ${staffInCharge.tenNguoiPhuTrach} - ${staffInCharge.soDienThoai}`);
            setGradeName(selectedGradeNames);
        } else {
            setGradeName([]);
        }
    }, [selectedStaffInCharge]);

    const handleChange = (event: SelectChangeEvent<typeof staffInChargeName>) => {
        const {
            target: { value },
        } = event;

        setGradeName(typeof value === 'string' ? value.split(',') : value);

        const foundStaffInCharge = staffInCharges.filter(staffInCharge =>
            value.includes(`${staffInCharge.chucVu} - ${staffInCharge.tenNguoiPhuTrach} - ${staffInCharge.soDienThoai}`)
        );

        onHandleSelectedStaffInCharge(foundStaffInCharge);
    };

    return (
        <div>
            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    error={error && touched}
                    value={staffInChargeName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {staffInChargesChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={staffInChargeName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
