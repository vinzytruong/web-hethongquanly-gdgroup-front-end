import { Product } from "./product"
import { Sites } from "./site"

interface Field {
    label: string,
    value: string
}
interface Message {
    type: string,
    message: string
}
export interface PropsDialog {
    title: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean
    open:boolean,
    id?:number,
    file?:File | null,
    handleUploadFile?:(e: any) => void,
    handleOpen: (e: boolean) => void,
    handlSaveFile?:(e: any) => void,
}