import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material'
import useSites from '@/hooks/useSites'


const ImageCustom = styled('img')({
    width: "auto",
    minWidth: "100%",
    height: "auto",
    minHeight: "100%",
    objectFit: "cover",
    cursor: 'pointer',
    opacity: 0.9,
    borderRadius: 4,
    transition: '0.9s',
    ':hover': {
        opacity: 1,
        transform: 'scale(1.1)',

    }
})
const ProvinceArchitectureTab: FC = () => {
    const [showMore, setShowMore] = React.useState(false);
    const { dataSites } = useSites()
    const dataFilter = dataSites.sites.filter(item => item.category === 'di-tich-kien-truc-cap-tinh')
    const dataShow = showMore ? dataFilter : dataFilter.slice(0, 1);

    return (
        <Container maxWidth='lg' style={{ padding: 0 }}>
            <Grid container>
                {dataShow.map((item, index) => (
                    <Grid item xs={12} md={12} key={index}>

                        <Box sx={{
                            display: "flex",
                            position: "relative",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            height: { xs: '400px', md: '675px' },
                            width: { xs: '100vw', md: '1200px' },
                            margin: "0 auto",
                            color: "#fff",
                            textAlign: "center",
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                display: "flex",
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                            }}>
                                <ImageCustom
                                    sx={{
                                        height: { xs: '400px', md: '675px' },
                                        width: { xs: '100vw', md: '1200px' },
                                    }}
                                    src={item.photo} alt="Picsum placeholder image" />
                                <Box sx={{
                                    zIndex: 0,
                                    position: "absolute",
                                    width: "100%",
                                    height: "20%",
                                    bottom: 0,
                                    backgroundColor: 'primary.main',
                                    opacity: 0.8

                                }}>

                                </Box>
                            </Box>
                            <div style={{
                                zIndex: 1,
                                maxWidth: "100%",
                                padding: "20px 5%"
                            }}>
                                <Typography
                                    variant='h1'
                                    sx={{
                                        margin: { xs: '0px', md: '"0 0 24px"' },
                                        fontSize: { xs: '16px', md: '32px' },
                                        wordBreak: 'break-all'
                                    }}>{item.name}
                                </Typography>
                                <Typography
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                        paddingTop: 2
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ProvinceArchitectureTab
