import { ContentWorkPlan } from "./contentWorkPlan"
import { CostOtherWork, CostWork } from "./costWork"
import { PeopleTogether } from "./peopleTogether"
import { VehicleWork } from "./vehicleWork"

export interface PlanMonth {
    thangID: number,
    tieuDe: string,
    noiDung: string,
    thang: number,
    nam: number,
    tuNgay: string,
    denNgay: string,
    isApprove: boolean,
    nguoiDuyet: string,
    nguoiDuyetID: string,
    active: boolean,
    khcT_Tuan?: any,
    createDate: string,
    createBy: string,
    nguoiTaoID?:number,
    updateDate?: string,
    updateBy?: string,
    activeDate?: string,
    activeBy?: string
}
export interface PlanWeek {
    tuanID: number,
    tieuDe: string,
    noiDung: string,
    tuan: number,
    nam: number,
    thangID: number,
    tuan_Thang: number,
    tuan_Nam: number,
    tuNgay: string,
    denNgay: string,
 nguoiTaoID?:number,
    isApprove: boolean,
    nguoiDuyet: string,
    nguoiDuyetID: string,
    active: boolean,
    createDate: string,
    createBy: string,
    updateDate?: string,
    updateBy?: string,
    activeDate?: string,
    activeBy?: string
}

export interface PlanDay {
    ngayID: number,
    tuanID: number,
    isApprove: boolean,
    nguoiDuyet?: string,
    active: boolean,
    createDate: string,
    createBy: string,
    updateDate?: string,
    updateBy?: string,
    activeDate?: string,
    activeBy?: string,
    nguoiTaoID: number,
    hoTen: string,
    chucVuID: number,
    tenChucVu: string,
    phongBanID: number,
    tenPhongBan: string,
    congTyID: number,
    tenCongTy: string,
    tuNgay: string,
    denNgay: string,
    mucDich: string,
    khcT_Tuan: PlanWeek,
    khcT_Ngay_LichSu: HistoryPlanDay[],
    khcT_NguoiDiCung: PeopleTogether[],
    khcT_NoiDung: ContentWorkPlan[],
    khcT_Xe: VehicleWork[],
    khcT_ChiPhi: CostWork[],
    khcT_ChiPhiKhac: CostOtherWork[],
}
interface HistoryPlanDay {
    lsid: number,
    nhanVienID: number,
    nhanVien: {
        nhanVienID: number,
        tenNhanVien: string,
        soDienThoai: string,
        email: string
    },
    thoiGan: string,
    trangThaiID: number,
    khcT_Ngay_TrangThai: {
        trangThaiID: number,
        tenTrangThai: string
    },
    nguoiDuyetID: number,
    tenNguoiDuyet: string
}