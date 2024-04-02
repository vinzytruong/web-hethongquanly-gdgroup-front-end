import { useRouter } from "next/router"
import OfficersPage from "./Officers"


const GiftCardsPage = () => {
    const router = useRouter()
    const { id } = router.query


    return < OfficersPage id={id} />
}

export default GiftCardsPage