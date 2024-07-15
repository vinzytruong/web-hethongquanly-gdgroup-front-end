import { Companys } from "./companys"
import { DerparmentOfCompany } from "./derparmentOfCompany"
import { Organization } from "./organization"
import { Position } from "./position"
import { Step } from "./step"
import { Staff } from "./user"

export interface ProjectEstimate {
  duToanID: number,
  tenDuToan: string,
  fileCoQuan?: string,
  tenFileCoQuan?: string,
  fileCongTy?: string,
  tenFileCongTy?: string,
  doanhThuDuKien?: number,
  ghiChu?: string,
  thoiGian?: string,
  buocThiTruongID?: number,
  buocThiTruong?: Step
  coQuanID: number,
  nsCoQuan?: Organization
  nhanVienID?: number,
  nhanVien?: Staff,
  ketQua?: boolean,
  lyDoThatBai?: string,
  doanhThuThucTe?: number,
  thoiGianKetThucDuKien:string,
}
export interface DetailProjectEstimate {
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