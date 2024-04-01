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
    // field?: Field[]
    // action: string,
    defaulValue?: any,
    isInsert?: boolean
    isUpdate?: boolean
    // id?: any,
    open:boolean,
    handleOpen: (e: boolean) => void,
    // handleAlertContent: (e: Message) => void,
    // handleOpenAlert: (e: boolean) => void
}
export interface PropsDialogProducts {
    title: string,
    field?: Field[]
    buttonText: string,
    action: string,
    defaulValue?: Product,
    isInsert?: boolean
    isEdit?: boolean,
    handleAlertContent: (e: Message) => void,
    handleOpenAlert: (e: boolean) => void
}