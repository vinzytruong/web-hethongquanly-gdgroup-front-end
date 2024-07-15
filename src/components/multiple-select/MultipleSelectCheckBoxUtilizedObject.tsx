import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { UtilizedObject } from '@/interfaces/utilizedObject';
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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightBold,
    };
}
interface Props {
    onhandleSelectedUtilizedObjects: (data: number[]) => void;
    utilizedObjects: UtilizedObject[];
}
export default function MultipleSelectCheckBoxUtilizedObject({ onhandleSelectedUtilizedObjects, utilizedObjects }: Props) {
    const theme = useTheme();
    const [utilizedObjectName, setUtilizedObjectName] = React.useState<string[]>([]);
    const utilizedObjectsChild = utilizedObjects.map(utilizedObject => utilizedObject.utilizedObjectName);
    const handleChange = (event: SelectChangeEvent<typeof utilizedObjectName>) => {
        const {
            target: { value },
        } = event;
        setUtilizedObjectName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const foundUtilizedObjectIds = utilizedObjects
            .filter(utilizedObject => value.includes(utilizedObject.utilizedObjectName))
            .map(utilizedObject => utilizedObject.utilizedObjectId);
        onhandleSelectedUtilizedObjects(foundUtilizedObjectIds);

    };

    return (
        <div>

            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    value={utilizedObjectName}
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
                    {utilizedObjectsChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={utilizedObjectName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}