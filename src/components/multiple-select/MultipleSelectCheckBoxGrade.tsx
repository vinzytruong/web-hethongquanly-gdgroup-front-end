import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Grades } from '@/interfaces/grades';
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
    onHandleSelectedGrades: (data: Grades[]) => void;
    grades: Grades[];
    selectedGrades: Grades[];
    error?: boolean;
    touched?: boolean;
}
export default function MultipleSelectCheckBoxGrade({ onHandleSelectedGrades, grades, error, touched, selectedGrades }: Props) {
    const theme = useTheme();
    const [gradeName, setGradeName] = React.useState<string[]>([]);
    const gradesChild = grades.map(grade => grade.tenKhoiLop);
    React.useEffect(() => {
        if (selectedGrades && selectedGrades.length > 0) {
            const selectedGradeNames = selectedGrades.map(grade => grade.tenKhoiLop);
            setGradeName(selectedGradeNames);
        }
        return () => {
            setGradeName([]);
        };
    }, [selectedGrades]);
    const handleChange = (event: SelectChangeEvent<typeof gradeName>) => {
        const {
            target: { value },
        } = event;
        setGradeName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const foundGrades = grades
            .filter(grade => value.includes(grade.tenKhoiLop))
        onHandleSelectedGrades(foundGrades);

    };

    return (
        <div>

            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    error={error && touched}
                    value={gradeName}
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
                    {gradesChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={gradeName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}