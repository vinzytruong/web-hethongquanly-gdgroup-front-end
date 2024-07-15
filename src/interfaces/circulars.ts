import { Subjects } from "./subjects";

export interface Circulars {
  thongTuID?: number;
  tenThongTu: string;
  moTa?: string;
  lstMonHoc?: Subjects[];
}
