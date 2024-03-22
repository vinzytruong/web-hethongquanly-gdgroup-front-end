import { deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";


export function uploadFileToFirebase(file: any, path: string) {
    const url = path + '/' + file?.name
    const storageRef = ref(storage, url);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return uploadTask;
}

export async function deleteFileToFirebase(url:string) {
    try {
        await deleteObject(ref(storage, url))
        return {
            type: 'success',
            message: 'Xoá ảnh thành công'
        }
    }
    catch (e) {
        return {
            type: 'error',
            message: 'Lỗi khi xoá ảnh'
        }
    }
}