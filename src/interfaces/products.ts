import { Circulars } from "./circulars";
import { Grades } from "./grades";
import { ProductTypes } from "./productTypes";
import { Subjects } from "./subjects";
import { Units } from "./units";

export interface ProductBase {
  sanPhamID?: number;
  maSanPham: string;
  tenSanPham: string;
  tieuChuanKyThuat: string;
  tieuChuanKyThuatFull?: string;
  hangSanXuat: string | null;
  xuatXu: string;
  baoHanh: number;
  namSanXuat: number;
  nhaXuatBan: string | null;
  model: string;
  dvtid: number;
  giaDaiLy: number;
  giaVon: number;
  giaTTR: number;
  giaTH_TT: number;
  giaCDT: number;
  thue: number;
  soLuong: number;
  doiTuongSuDung: string;
  duToan?: [];
  thuongHieu: string | null;
  monHoc: Subjects[];
  khoiLop: Grades[];
  thongTu: Circulars[];
  loaiSanPhamID: number;
  loaiSanPham?: ProductTypes;
  hinhAnh?: string | null;
  giaBan?: number;
  donViTinh?: Units;
  isChange?: boolean;
}
export interface Products extends ProductBase {
  [key: string]: any;
}
export interface ProductInEstimate {
  khoiLopID: number;
  tenKhoiLop: string | null;
  monHocID: number;
  tenMonHoc: string;
  sanPham: Products[];
}
export interface ExportExcelProduct {
  companyEstimateId: number;
  fileName: string;
  isShowTCKT: string;
  priceCode: string;
  circularId: number;
  isShowGiaVon: string;
}
export interface FindProductInExcel {
  index: number;
  productName: string;
  sanPhamView?: Products | null;
}
