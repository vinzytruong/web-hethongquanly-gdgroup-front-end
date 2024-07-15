import { ContractorEstimateStatus } from "./contractorEstimateStatus";
import { Contractors } from "./contractors";
import { Province } from "./province";
import { Staff } from "./user";

export interface ContractorEstimate {
  duToanID?: number;
  tenDuToan: string;
  tinhID: number;
  nhaThauID?: number;
  trangThaiID: number;
  doanhThuDuKien: number;
  tenFileNhaThau?: string;
  fileNhaThau?: string;
  tenFileCongTy?: string;
  fileCongTy?: string;
  ghiChu?: string;
  tinh?: Province;
  nT_TrangThaiDuToan?: ContractorEstimateStatus;
  nhaThau?: Contractors;
  createDate?: string;
  updateDate?: string;
  lyDoThatBai?: string | null;
  ketQua?: boolean | null;
  nhanVienID?: number;
  nhanVien?: Staff;
}
