import { Products } from '@/interfaces/products'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ products: Products[] }>('@products/GET_ALL')
export const ADD_PRODUCTS = createAction<{ products: Products }>('@products/ADD_PRODUCTS')
export const UPDATE_PRODUCTS = createAction<{ products: Products, id:number }>('@products/UPDATE_PRODUCTS')
export const DELETE_PRODUCTS = createAction<{ id: number }>('@products/DELETE_PRODUCTS')