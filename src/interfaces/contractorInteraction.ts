import { ContractorTags } from "./contractorTag";
import { Contractors } from "./contractors";
import { ProductTypes } from "./productTypes";
import { SourceOfFunds } from "./sourceOfFunds";
import { StaffInCharge } from "./staffInCharge";
import { Staff } from "./user";

export interface ContractorInteractions {
  gtchid?: number;
  nhaThauID: number;
  thoiGianTiepXuc: string;
  canBoTiepXuc: string;
  listCanBoTiepXuc?: StaffInCharge[];
  soDienThoai?: string;
  nhomHangQuanTam: string;
  nguonVonID: number;
  isQuanTamHopTac: boolean;
  isKyHopDongNguyenTac: boolean;
  loaiSanPhamDTO?: ProductTypes[];
  loaiSanPham?: ProductTypes[];
  ghiChu: string;
  theID: number;
  nguonVon?: SourceOfFunds;
  nT_The?: ContractorTags;
  nhaThau?: Contractors;
  nhanVien?: Staff;
  lstChucVuView?: [
    {
      lstChucVu: {
        chucVuID: number;
        tenChucVu: string;
        chiTiet: string;
        phongBanID: number;
      };
      lstPhongBan: {
        phongBanID: number;
        tenPhongBan: string;
        chiTiet: string;
        congTyID: number;
      };
      lstCongTy: {
        congTyID: number;
        tenCongTy: string;
        maSoThue: string;
        tinhID: number;
        diaChi: string;
      };
    }
  ];
}
