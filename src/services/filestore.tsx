import { Sites } from "@/interfaces/site";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import { Product } from "@/interfaces/product";

export default async function insertSite(item: Sites) {
    try {
        await setDoc(doc(db, "dia-diem", item.idDoc), item);
        return {
            type: 'success',
            message: 'Thêm địa điểm thành công'
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi thêm địa điểm'
        }
    }
}

export async function deleteSite(id: any) {
    try {
        await deleteDoc(doc(db, 'dia-diem', id.toString()))
        return {
            type: 'success',
            message: 'Xoá địa điểm thành công'
        }
    }
    catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi xoá địa điểm'
        }
    }
}
export async function updateSite(id: any, dataUpdate: any) {
    try {
        await updateDoc(doc(db, 'dia-diem', id.toString()), dataUpdate)
        return {
            type: 'success',
            message: 'Cập nhật địa điểm thành công'
        }
    }
    catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi cập nhật địa điểm'
        }
    }
}

// Product
export async function insertProduct(item: Product) {
    try {
        await setDoc(doc(db, "san-pham", item.idDoc), item);
        return {
            type: 'success',
            message: 'Thêm sản phẩm thành công'
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi thêm sản phẩm'
        }
    }
}

export async function deleteProduct(id: any) {
    try {
        await deleteDoc(doc(db, 'san-pham', id.toString()))
        return {
            type: 'success',
            message: 'Xoá sản phẩm thành công'
        }
    }
    catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi xoá sản phẩm'
        }
    }
}
export async function updateProduct(id: any, dataUpdate: any) {
    try {
        await updateDoc(doc(db, 'san-pham', id.toString()), dataUpdate)
        return {
            type: 'success',
            message: 'Cập nhật sản phẩm thành công'
        }
    }
    catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi cập nhật sản phẩm'
        }
    }
}



