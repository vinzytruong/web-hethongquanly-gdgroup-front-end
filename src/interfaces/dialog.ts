import { ReactNode } from "react"
import { Product } from "./product";
import { ExportExcelProduct, Products } from "./products";
import { Sites } from "./site";

interface Field {
  label: string;
  value: string;
}
interface Message {
  type: string;
  message: string;
}
export interface PropsDialog {
  title: string,
  defaulValue?: any,
  isInsert?: boolean
  isUpdate?: boolean,
  open: boolean,
  id?: number,
  idParent?: number,
  file?: File | null,
  content?: ReactNode,
  handleUploadFile?: (e: any) => void,
  handleOpen: (e: boolean) => void,
  handlSaveFile?: (e: any) => void,
  note?: string;
  onHandleExportExcel?: (data: ExportExcelProduct) => void;
  fetchData?: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}
