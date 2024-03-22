import { deleteFileToFirebase, uploadFileToFirebase } from "@/services/storage";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { SAVE_FILE } from "@/store/storage/action";
import { getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";


const useStorage = () => {
    const dataStorage = useAppSelector((state) => state.storage);
    const dispatch = useAppDispatch()


    const uploadFile = (file: any, path: string) => {
        return uploadFileToFirebase(file, path);
    };

    const deleteFile = (url: string) => {
        return deleteFileToFirebase(url);
    };

    return {
        uploadFile,
        deleteFile
    };
};

export default useStorage;