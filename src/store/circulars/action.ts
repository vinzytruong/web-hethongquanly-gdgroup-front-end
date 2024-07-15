import { Circulars } from '@/interfaces/circulars'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ circulars: Circulars[] }>('@circulars/GET_ALL')
export const ADD_CIRCULARS = createAction<{ circulars: Circulars }>('@circulars/ADD_CIRCULARS')
export const UPDATE_CIRCULARS = createAction<{ circulars: Circulars, id:number }>('@circulars/UPDATE_CIRCULARS')
export const DELETE_CIRCULARS = createAction<{ id: number }>('@circulars/DELETE_CIRCULARS')