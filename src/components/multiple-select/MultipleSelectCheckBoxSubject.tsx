import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Subjects } from '@/interfaces/subjects';
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



function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightBold,
    };
}
interface Props {
    onHandleSelectedSubjects: (data: Subjects[]) => void;
    subjects: Subjects[];
    selectedSubjects: Subjects[];
    error: boolean;
    touched: boolean;
}
export default function MultipleSelectCheckBoxSubject({ onHandleSelectedSubjects, subjects, error, touched, selectedSubjects }: Props) {
    const theme = useTheme();
    const [subjectName, setSubjectName] = React.useState<string[]>([]);
    const subjectsChild = subjects.map(subject => subject.tenMonHoc);
    React.useEffect(() => {
        if (selectedSubjects && selectedSubjects.length > 0) {
            const selectedGradeNames = selectedSubjects.map(subject => subject.tenMonHoc);
            setSubjectName(selectedGradeNames);
        }
        return () => {
            setSubjectName([]);
        };
    }, [selectedSubjects]);
    const handleChange = (event: SelectChangeEvent<typeof subjectName>) => {
        const {
            target: { value },
        } = event;
        setSubjectName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const foundGradeIds = subjects
            .filter(subject => value.includes(subject.tenMonHoc))
        onHandleSelectedSubjects(foundGradeIds);

    };

    return (
        <div>

            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    value={subjectName}
                    error={error && touched}
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
                    {subjectsChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={subjectName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}