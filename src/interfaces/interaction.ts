import { Capital } from "./capital"
import { Companys } from "./companys"
import { DerparmentOfCompany } from "./derparmentOfCompany"
import { Organization } from "./organization"
import { Position } from "./position"
import { Step } from "./step"
import { Staff } from "./user"

export interface Interaction {
  tuongTacID: number,
  coQuanID: number,
  nsCoQuan: Organization,
  thoiGian: string,
  thongTinLienHe: string,
  thongTinTiepXuc: string,
  canBoTiepXuc: string,
  nhomHangQuanTam: string,
  ghiChu: string,
  active: boolean,
  doanhThuDuKien: number,
  buocThiTruongID: number,
  buocThiTruong: Step,
  nhanVienID: number,
  nhanVien: Staff,
  nguonVonID: number,
  nsNguonVon: Capital,
  thoiGianKetThucDuKien?: string,
  createDate: string,
  createBy: string,
  updateDate: string,
  updateBy: string,
  activeDate: string,
  activeBy: string

}
export interface DetailInteraction {
  tuongTacID: number,
  nsCoQuan: Organization,
  thoiGian: string,
  thongTinLienHe: string,
  thongTinTiepXuc: string,
  canBoTiepXuc: string,
  nhomHangQuanTam: string,
  ghiChu: string,
  doanhThuDuKien: number,
  nhanVienID: number,
  buocThiTruong: Step
  nhanVien: Staff
  lstChucVuView: [
    {
      lstChucVu: Position,
      lstPhongBan: DerparmentOfCompany
      lstCongTy: Companys
    },
  ]
}