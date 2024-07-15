import { BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH, QUAN_TRI, BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH } from "@/constant/role"
import useRole from "@/hooks/useRole"
import { useEffect } from "react"

export function checkAdminRole(itemID:number){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole } = useRole()
    /* Role */
    const isBusinessAdmin = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
    }, [])
    return isAdmin || (dataRoleByUser[0]?.nhanVienID===itemID)
}