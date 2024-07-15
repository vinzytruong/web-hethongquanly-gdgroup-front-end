import OfficersPage from "@/views/customer/project/officers/Officers"
import { useRouter } from "next/router"



const IndexPage = () => {
    const router = useRouter()
    const { id } = router.query
    

    return < OfficersPage id={id} />
}

export default IndexPage