import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { ProductTypes } from '@/interfaces/productTypes';
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
    onHandleSelectedProductTypes: (data: ProductTypes[]) => void;
    ProductTypes: ProductTypes[];
    selectedProductTypes: ProductTypes[];
    error?: boolean;
    touched?: boolean;
}
export default function MultipleSelectCheckBoxProductType({ onHandleSelectedProductTypes, ProductTypes, error, touched, selectedProductTypes }: Props) {
    const theme = useTheme();
    const [ProductTypeName, setProductTypeName] = React.useState<string[]>([]);
    const ProductTypesChild = ProductTypes.map(ProductType => ProductType.tenLoaiSanPham);
    React.useEffect(() => {
        if (selectedProductTypes && selectedProductTypes.length > 0) {
            const selectedProductTypeNames = selectedProductTypes.map(ProductType => ProductType.tenLoaiSanPham);
            setProductTypeName(selectedProductTypeNames);
        }
        return () => {
            setProductTypeName([]);
        };
    }, [selectedProductTypes]);
    const handleChange = (event: SelectChangeEvent<typeof ProductTypeName>) => {
        const {
            target: { value },
        } = event;
        setProductTypeName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        const foundProductTypes = ProductTypes
            .filter(ProductType => value.includes(ProductType.tenLoaiSanPham))
        onHandleSelectedProductTypes(foundProductTypes);

    };

    return (
        <div>

            <FormControl sx={{ width: '100%' }}>
                <Select
                    id="demo-multiple-chip"
                    multiple
                    error={error && touched}
                    value={ProductTypeName}
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
                    {ProductTypesChild.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={ProductTypeName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}