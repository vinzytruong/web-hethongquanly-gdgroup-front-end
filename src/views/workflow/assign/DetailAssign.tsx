import { CustomInput } from "@/components/input"
import CustomizeTab from "@/components/tabs"
import useRole from "@/hooks/useRole"
import { RoleByUser } from "@/interfaces/role"
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material"
import { useState } from "react"

const TabProfile = () => {
    const theme = useTheme()
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >

        </Box>
    )
}

const TabAccount = () => {
    const theme = useTheme()
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >

        </Box>
    )
}

const TabRole = ({rows}:any) => {
    const theme = useTheme()
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<any>();
    const { dataRole, getAllRole, addStaffToRole, getAllRoleOfUser, dataRoleByUser, removeStaffToRole } = useRole(undefined,rows)


    const [role, setRole] = useState<RoleByUser[]>(dataRoleByUser);

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setRole(value);
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            width='100%'
            bgcolor={theme.palette.background.paper}
            px={3}
            py={3}
        >
            <Box style={{ width: '100%' }}>
            {dataRoleByUser[0]?.roleName.join(',')}
                <FormControl sx={{ m: 1, width: 300 }}>
                   
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={role}
                        onChange={handleChange}
                        input={<CustomInput/>}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {dataRole.map((item) => (
                            <MenuItem key={item.id} value={item.name}>
                                {/* <Checkbox checked={role.indexOf(item.name) > -1} /> */}
                                <ListItemText primary={item.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )
}
export interface Props {
    title?: string,
    defaulValue?: any,
    handleOpenAlert?: (e: boolean) => void,
    open?: boolean,
    id?: number,
    handleOpen?: (e: boolean) => void,
    handleEdit?: (e: any) => void;
    handleDelete?: (e: any) => void;
}

const DetailStaff = (props: Props) => {
    const { defaulValue } = props
    console.log("abc",defaulValue);

    return (
        <CustomizeTab
            dataTabs={
                [
                    { title: 'Hồ sơ nhân viên', content: <TabProfile /> },
                    { title: 'Tài khoản', content: <TabAccount /> },
                    { title: 'Phân quyền', content: <TabRole rows={defaulValue}/> }
                ]
            }
        />
    )
}
export default DetailStaff;