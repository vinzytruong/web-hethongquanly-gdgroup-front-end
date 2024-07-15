import { useEffect, useMemo, useState } from "react";
import useRole from "./useRole"
import {
    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
    BAN_PHAP_CHE_HC_NS_TRUONG_BAN,
    BAN_PHAP_CHE_HC_NS_PHO_BAN,
    BAN_SAN_PHAM_NHAN_VIEN,
    BAN_SAN_PHAM_TRUONG_BAN,
    BAN_SAN_PHAM_PHO_BAN,
    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN,
    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
    BAN_THI_TRUONG_TRUONG_BAN,
    BAN_THI_TRUONG_PHO_BAN,
    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
    QUAN_TRI,
    TONG_GIAM_DOC,
    PHO_TONG_GIAM_DOC,
    NHAN_VIEN,
} from "@/constant/role";
import { Staff } from "@/interfaces/user";

export default function useRoleLocalStorage() {
    /* Custom Hook */
    const { getAllRoleOfUser, dataRoleByUser, isLoadingRole, getAllUserOfRole, dataStaffDepartment } = useRole()

    /* Usestate */
    const [userName, setUserName] = useState()

    /* Lấy phân quyền người dùng hiện tại */
    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account')!)
        getAllRoleOfUser(account?.userID)
        setUserName(account?.username)
    }, [])

    /* ------------------------- Phân quyền tài khoản --------------------------------*/
    /* Ban giám đốc */
    const isAdmin = dataRoleByUser[0]?.roleName.includes(QUAN_TRI)
    const isGeneralDirector = dataRoleByUser[0]?.roleName.includes(TONG_GIAM_DOC)
    const isDeputyGeneralDirector = dataRoleByUser[0]?.roleName.includes(PHO_TONG_GIAM_DOC)

    /* Ban sản phẩm */
    const isProductDeparmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_TRUONG_BAN)
    const isProductDeparmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_PHO_BAN)
    const isProductDeparmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_SAN_PHAM_NHAN_VIEN)

    /* Ban tài chính kế hoạch */
    const isAccountantAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN)
    const isAccountantAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_PHO_BAN)
    const isAccountantStaff = dataRoleByUser[0]?.roleName.includes(BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN)

    /* Ban pháp chế hành chính nhân sự */
    const isPersonelAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_TRUONG_BAN)
    const isPersonelAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_PHO_BAN)
    const isPersonelStaff = dataRoleByUser[0]?.roleName.includes(BAN_PHAP_CHE_HC_NS_NHAN_VIEN)

    /* Ban thị trường */
    const isMarketDepartmentAdmin1 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_TRUONG_BAN)
    const isMarketDepartmentAdmin2 = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_PHO_BAN)
    const isMarketDepartmentStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)
    const isProjectDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_DU_AN)
    const isBranchDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH)
    const isBusinessDirector = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH)
    const isBusinessStaff = dataRoleByUser[0]?.roleName.includes(BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH)

    /* Nhân viên bình thường */
    const isStaff = dataRoleByUser?.[0]?.roleName.includes(NHAN_VIEN)

    const userID = dataRoleByUser?.[0]?.nhanVienID

    const roleName = dataRoleByUser?.[0]?.roleName


    useEffect(() => {
        console.log("role name", roleName);

        roleName?.map(item => {

            if (item?.includes("Ban sản phẩm")) {
                getAllUserOfRole([
                    BAN_SAN_PHAM_NHAN_VIEN,
                    BAN_SAN_PHAM_PHO_BAN,
                    BAN_SAN_PHAM_TRUONG_BAN
                ])
            }
            if (item?.includes("Ban pháp chế, hành chính, nhân sự")) {

                getAllUserOfRole([
                    BAN_PHAP_CHE_HC_NS_NHAN_VIEN,
                    BAN_PHAP_CHE_HC_NS_PHO_BAN,
                    BAN_PHAP_CHE_HC_NS_TRUONG_BAN
                ])
            }
            if (item?.includes("Ban tài chính, kế hoạch")) {
                getAllUserOfRole([
                    BAN_TAI_CHINH_KE_HOACH_NHAN_VIEN,
                    BAN_TAI_CHINH_KE_HOACH_PHO_BAN,
                    BAN_TAI_CHINH_KE_HOACH_TRUONG_BAN
                ])
            }
            if (item?.includes("Ban thị trường")) {

                getAllUserOfRole([
                    BAN_THI_TRUONG_NHAN_VIEN_KINH_DOANH,
                    BAN_THI_TRUONG_GIAM_DOC_KINH_DOANH,
                    BAN_THI_TRUONG_GIAM_DOC_CHI_NHANH,
                    BAN_THI_TRUONG_GIAM_DOC_DU_AN,
                    BAN_THI_TRUONG_PHO_BAN,
                    BAN_THI_TRUONG_TRUONG_BAN
                ])

            }

        })
    }, [roleName])

    return {
        userID,
        userName,
        roleName,
        dataStaffDepartment,
        isLoadingRole,
        isAdmin,
        isGeneralDirector,
        isDeputyGeneralDirector,
        isProjectDirector,
        isBranchDirector,
        isBusinessDirector,
        isBusinessStaff,
        isProductDeparmentAdmin1,
        isProductDeparmentAdmin2,
        isProductDeparmentStaff,
        isAccountantAdmin1,
        isAccountantAdmin2,
        isAccountantStaff,
        isPersonelAdmin1,
        isPersonelAdmin2,
        isPersonelStaff,
        isMarketDepartmentAdmin1,
        isMarketDepartmentAdmin2,
        isMarketDepartmentStaff,
        isStaff,
    }
}