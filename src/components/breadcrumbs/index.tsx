import { Box, Breadcrumbs, Link, Typography, useTheme } from "@mui/material"
import { useMemo } from "react"
interface Props {
  title: string,
  path: string
}
const BreadCrumbWithTitle = (props: Props) => {
  const theme = useTheme()

  const arrayLink = useMemo(() => {
    return props.path.split('/')
  }, [props.path])


  return (
    <Box display='flex' flexDirection="column" alignItems='flex-start' justifyContent='center'>
      <Typography variant="h3" color={theme.palette.primary.main} pb={2}>
        {props.title}
      </Typography>
      {/* <Breadcrumbs aria-label="breadcrumb">
        {arrayLink.map((item, index) => (
          <Link key={index} underline="hover" color="inherit" href={`/${item}`}>
            {item}
          </Link>
        ))}
      </Breadcrumbs> */}
    </Box>
  )
}
export default BreadCrumbWithTitle