import { Units } from '@/interfaces/units'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ units: Units[] }>('@units/GET_ALL')
export const ADD_UNITS = createAction<{ units: Units }>('@units/ADD_UNITS')
export const UPDATE_UNITS = createAction<{ units: Units, id:number }>('@units/UPDATE_UNITS')
export const DELETE_UNITS = createAction<{ id: number }>('@units/DELETE_UNITS')