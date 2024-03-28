import { DefaultCardItem } from "@/components/card"
import { Grid } from "@mui/material"

const TabCheckinDate = ({data}:any) => {
    return (
        <Grid container >
            {data?.map((item:any, idx:any) => (
                <Grid item sm={4} md={4} lg={3} xl={2} key={idx} p={2}>
                    <DefaultCardItem item={item} />
                </Grid>
            ))}
        </Grid>
    )
}
export default TabCheckinDate;