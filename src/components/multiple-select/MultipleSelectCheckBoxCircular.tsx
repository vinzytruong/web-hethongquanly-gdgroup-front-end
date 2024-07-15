import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Circulars } from '@/interfaces/circulars';
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
    onHandleSelectedCirculars: (data: Circulars[]) => void;
    circulars: Circulars[];
    selectedCirculars: Circulars[];
    error?: boolean;
    touched?: boolean;
}
export default function MultipleSelectCheckBoxCircular({ onHandleSelectedCirculars, circulars, error, touched, selectedCirculars }: Props) {
    const theme = useTheme();
    const [circularName, setGradeName] = React.useState<string[]>([]);
    const circularsChild = circulars.map(circular => circular.tenThongTu);
    React.useEffect(() => {
        if (selectedCirculars && selectedCirculars.length > 0) {
            const selectedGradeNames = selectedCirculars.map(circular => circular.tenThongTu);
            setGradeName(selectedGradeNames);
        }
        return () => {
            setGradeName([]);
        };
    }, [selectedCirculars]);
    const handleChange = (event: SelectChangeEvent<typeof circularName>) => {
        const {
            target: { value },
        } = event;
        setGradeName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const foundCircularIds = circulars
            .filter(circular => value.includes(circular.tenThongTu))

        onHandleSelectedCirculars(foundCircularIds);

    };

    return (
        <div>

            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    error={error && touched}
                    value={circularName}
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
                    {circularsChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={circularName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}