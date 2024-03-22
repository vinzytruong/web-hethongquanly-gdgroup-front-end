import { Product } from '@/interfaces/product'
import { createAction } from '@reduxjs/toolkit'
import { DocumentData } from 'firebase/firestore'

export const SAVE_PRODUCTS = createAction<{ products: Product[] }>('@product/SAVE_PRODUCTS')
export const SAVE_PRODUCT = createAction<{ products: Product, id: number }>('@product/SAVE_PRODUCT')
export const DELETE_PRODUCT = createAction<{ id: number }>('@product/DELETE_PRODUCT')
export const ADD_PRODUCT = createAction<{ product: Product }>('@product/ADD_PRODUCT')
export const EDIT_PRODUCT = createAction<{ id:number, product: Product }>('@product/EDIT_PRODUCT')