import { ProductTypes } from '@/interfaces/productTypes'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ productTypes: ProductTypes[] }>('@products/GET_ALL')
export const ADD_PRODUCTTYPES = createAction<{ productTypes: ProductTypes }>('@products/ADD_PRODUCTTYPES')
export const UPDATE_PRODUCTTYPES = createAction<{ productTypes: ProductTypes, id:number }>('@products/UPDATE_PRODUCTTYPES')
export const DELETE_PRODUCTTYPES = createAction<{ id: number }>('@products/DELETE_PRODUCTTYPES')