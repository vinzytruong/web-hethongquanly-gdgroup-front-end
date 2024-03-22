import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT, SAVE_PRODUCT } from '@/store/product/action';
import { Product } from '@/interfaces/product';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { deleteProduct, insertProduct, updateProduct } from '@/services/filestore';

export default function useProduct() {
    const dataProduct = useAppSelector((state) => state.product);
    const [isLoadding, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const fetchDataProduct = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "san-pham"));
            querySnapshot.forEach((doc) => {
                setProduct({
                    id: doc.data().id,
                    name: doc.data().name,
                    author: doc.data().author,
                    address: doc.data().address,
                    star: doc.data().star,
                    detail: doc.data().detail,
                    idDoc:doc.data().id,
                    createdTime:doc.data().createdTime
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
        fetchDataProduct()
    }, []);

    const setProduct = (productData: Product, id: number) => {
        dispatch(SAVE_PRODUCT({ products: productData, id: id }))
    }
    const addProduct = async (product: Product) => {
        const task = await insertProduct(product)
        dispatch(ADD_PRODUCT({ product: product }))
        return task;
    }

    const editProduct = async (id: any, dataUpdate: any) => {
        const task = await updateProduct(id, dataUpdate);
        dispatch(EDIT_PRODUCT({id:id, product: dataUpdate }))
        return task;
    }
    const removeProduct = async (id: any) => {
        const task = await deleteProduct(id)
        dispatch(DELETE_PRODUCT({ id: id }))
        return task;
    }

    const getProduct = (id: number) => {
        return dataProduct.products[id]
    }

    return {
        dataProduct, addProduct, setProduct, getProduct, editProduct, removeProduct, isLoaddingProduct: isLoadding
    };
}
