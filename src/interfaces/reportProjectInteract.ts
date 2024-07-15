import { District } from "./district"
import { Interaction } from "./interaction"
import { Officers } from "./officers"
import { ProjectEstimate } from "./projectEstimate"
import { Province } from "./province"
import { Step } from "./step"
import { Staff } from "./user"

export interface ReportProjectInteract {
    coQuanID: number,
    tenCoQuan: string,
    thoiGian: string,
    doanhThuThucTe: number,
    doanhThuDuKien: number,
    buocThiTruong: Step,
    thoiGianKetThucDuKien:string,
    nhanVien: {
        nhanVienID: number,
        tenNhanVien: string,
        lstChucVuView?: [
            {
                lstChucVu: {
                    chucVuID: number,
                    tenChucVu: string,
                    chiTiet: string,
                    phongBanID: number
                },
                lstPhongBan: {
                    phongBanID: number,
                    tenPhongBan: string,
                    chiTiet: string,
                    congTyID: number
                },
                lstCongTy: {
                    congTyID: number,
                    tenCongTy: string,
                    maSoThue: string,
                    tinhID: number,
                    diaChi: string
                }
            }
        ]
    }

}