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
    field?: Field[]
    buttonText: string,
    action: string,
    defaulValue?: Product,
    isInsert?: boolean
    isEdit?: boolean
    id?: any,
    handleAlertContent: (e: Message) => void,
    handleOpenAlert: (e: boolean) => void
}
export interface PropsDialogSites {
    title: string,
    field?: Field[]
    buttonText: string,
    action: string,
    defaulValue?: Sites,
    isInsert?: boolean
    isEdit?: boolean,
    handleAlertContent: (e: Message) => void,
    handleOpenAlert: (e: boolean) => void
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