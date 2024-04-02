import { Officers } from '@/interfaces/officers'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ officers: Officers[] }>('@officers/GET_ALL')
export const ADD_OFFICERS = createAction<{ officers: Officers }>('@officers/ADD_OFFICERS')
export const UPDATE_OFFICERS = createAction<{ officers: Officers, id:number }>('@officers/UPDATE_OFFICERS')
export const DELETE_OFFICERS = createAction<{ id: number }>('@officers/DELETE_OFFICERS')