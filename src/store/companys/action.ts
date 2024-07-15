import { Companys } from '@/interfaces/companys'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL = createAction<{ companys: Companys[] }>('@companys/GET_ALL')
export const ADD_COMPANY = createAction<{ companys: Companys }>('@companys/ADD_COMPANY')
export const UPDATE_COMPANY = createAction<{ companys: Companys }>('@companys/UPDATE_COMPANY')
export const DELETE_COMPANY = createAction<{ id: number }>('@companys/DELETE_COMPANY')
