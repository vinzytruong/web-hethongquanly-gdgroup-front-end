import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ADD_SITE, DELETE_SITE, EDIT_SITE, SAVE_SITE } from '@/store/sites/action';
import { Sites } from '@/interfaces/site';
import { db } from '@/services/firebase';
import insertSite, { deleteSite, updateSite } from '@/services/filestore';

export default function useSites() {
    const dataSites = useAppSelector((state) => state.sites);
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const fetchDataSites = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "dia-diem"));
            querySnapshot.forEach((doc) => {
                setSites({
                    id: doc.data().id,
                    idDoc: doc.id,
                    photo: doc.data().photo,
                    name: doc.data().name,
                    category: doc.data().category,
                    address: doc.data().address,
                    description: doc.data().description,
                    detail: doc.data().detail,
                    isPopular: doc.data().isPopular,
                    createdTime: doc.data().createdTime
                }, doc.data().id);
            });
            setIsLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchDataSites()
    }, []);

    const setSites = (sitesData: Sites, id: number) => {
        dispatch(SAVE_SITE({ site: sitesData, id: id }))
    }

    const addSite = async (site: Sites) => {
        const task = await insertSite(site)
        dispatch(ADD_SITE({ site: site }))
        return task;
    }

    const editSite = async (id: any, dataUpdate: any) => {
        const task = await updateSite(id, dataUpdate);
        dispatch(EDIT_SITE({ id: id, site: dataUpdate }))
        return task;
    }
    const removeSite = async (id: any) => {
        const task = await deleteSite(id)
        dispatch(DELETE_SITE({ id: id }))
        return task;
    }

    const getSite = (id: number) => {
        return dataSites.sites[id]
    }

    return {
        dataSites, addSite, setSites, getSite, editSite, removeSite, isLoaddingSites: isLoadding
    };
}
