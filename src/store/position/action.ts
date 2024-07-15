import { Position } from '@/interfaces/position'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL_POSITION = createAction<{ position: Position[] }>('@position/GET_ALL_POSITION')
export const GET_POSITION_BY_DEPARTMENT = createAction<{ position: Position[] }>('@position/GET_POSITION_BY_DEPARTMENT')
export const UPDATE_POSITION_BY_ID = createAction<{ position: Position }>('@position/UPDATE_POSITION_BY_ID')
export const ADD_POSITION_OF_COMPANY = createAction<{ position: Position }>('@position/ADD_POSITION_OF_COMPANY')
export const DELETE_POSITION_OF_COMPANY = createAction<{ id: number }>('@position/DELETE_POSITION_OF_COMPANY')
