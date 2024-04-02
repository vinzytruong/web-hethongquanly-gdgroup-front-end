import { Supplier } from '@/interfaces/supplier'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ supplier: Supplier[] }>('@supplier/GET_ALL')
export const ADD_SUPPLIER = createAction<{ supplier: Supplier }>('@supplier/ADD_SUPPLIER')
export const UPDATE_SUPPLIER = createAction<{ supplier: Supplier, id:number }>('@supplier/UPDATE_SUPPLIER')
export const DELETE_SUPPLIER = createAction<{ id: number }>('@supplier/DELETE_SUPPLIER')