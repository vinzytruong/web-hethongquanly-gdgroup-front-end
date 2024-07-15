import { TypeOfCooperations } from "./TypeOfCooperation";
import { AreaOfOperations } from "./areaOfOperation";
import { ContractorInteractions } from "./contractorInteraction";
import { StaffInCharge } from "./staffInCharge";
import { Staff } from "./user";

export interface Contractors {
  nhaThauID?: number;
  tenCongTy: string;
  maSoThue: string;
  diaChi: string;
  nguoiDaiDien: string;
  ghiChu: string;
  tinhID: number;
  nhanVienPhuTrach: string;
  listNhanVienPhuTrach?: StaffInCharge[];
  chucVu: string;
  soDienThoai: string;
  loaiNTID: number;
  nddChucVu: string;
  nddSoDienThoai: string;
  nhanVienID?: number;
  email: string;
  diaBanID: number;
  loaiHopTacID: number;
  nT_LoaiHopTac?: TypeOfCooperations;
  nT_DiaBanHoatDong?: AreaOfOperations;
  nhanVien?: Staff;
  nT_GiaTriCoHoi?: ContractorInteractions[];
}
export interface ContractorsType {
  loaiNTID: number;
  tenLoai: string;
}
export interface SendMailContractor {
  provinceID: number;
  subject: string;
  bodyContent: string;
  fileSendMailDtos: FileSendMailDto[]
}
export interface FileSendMailDto {
  fileID?: number | null,
  fileName: string,
  fileType: string,
  fileUrl: string,
  loai?: number
}