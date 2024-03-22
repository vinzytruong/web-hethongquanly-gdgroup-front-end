import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Button, Grid } from '@mui/material'
import { DefaultCardItem } from '@/components/card'
import useSites from '@/hooks/useSites'

const ProvinceTab: FC = () => {
    const [showMore, setShowMore] = React.useState(false);
    const { dataSites } = useSites()
    const dataFilter = dataSites.sites.filter(item => item.category === 'di-tich-lich-su-cap-tinh')
    const dataShow = showMore ? dataFilter : dataFilter.slice(0, 4)
    return (
        <Box
            id="mentors"
            sx={{
                pt: {
                    xs: 4,
                    md: 6,
                },
                pb: {
                    xs: 4,
                    md: 6,
                },
                backgroundColor: 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3} sx={{ px: 0, py: 5 }}>
                    {dataShow.map((item, index) => (
                        <Grid item md={6} key={index}>
                            <DefaultCardItem key={String(item.id)} item={item} />
                        </Grid>
                    ))}
                </Grid>
                {dataFilter.length > 4 ?
                    <Box pt={5} alignItems='center' justifyContent='center' textAlign='center'>
                        <Button variant='outlined' onClick={() => setShowMore(!showMore)}>{showMore ? "Rút gọn" : "Xem thêm"}</Button>
                    </Box>
                    : null
                }
            </Container>
        </Box>
    )
}
export default ProvinceTab;