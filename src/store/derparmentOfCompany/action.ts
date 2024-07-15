import { DerparmentOfCompany } from '@/interfaces/derparmentOfCompany'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL = createAction<{ derparmentOfCompany: DerparmentOfCompany[] }>('@derparmentOfCompany/GET_ALL')
export const GET_DERPARMENT_OF_COMPANY = createAction<{ derparmentOfCompany: DerparmentOfCompany[] }>('@derparmentOfCompany/GET_DERPARMENT_OF_COMPANY')
export const ADD_DEPARTMENT_OF_COMPANY = createAction<{ derparmentOfCompany: DerparmentOfCompany }>('@derparmentOfCompany/ADD_DEPARTMENT_OF_COMPANY')
export const UPDATE_DEPARTMENT_OF_COMPANY = createAction<{ derparmentOfCompany: DerparmentOfCompany }>('@derparmentOfCompany/UPDATE_DEPARTMENT_OF_COMPANY')
export const DELETE_DEPARTMENT_OF_COMPANY = createAction<{ id: number }>('@derparmentOfCompany/DELETE_DEPARTMENT_OF_COMPANY')
