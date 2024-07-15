import { Agency } from '@/interfaces/agency'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ agency: Agency[] }>('@agency/GET_ALL')
export const ADD_AGENCY = createAction<{ agency: Agency }>('@agency/ADD_AGENCY')
export const UPDATE_AGENCY = createAction<{ agency: Agency, id:number }>('@agency/UPDATE_AGENCY')
export const DELETE_AGENCY = createAction<{ id: number }>('@agency/DELETE_AGENCY')