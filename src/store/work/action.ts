import { Work } from '@/interfaces/work'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ work: Work[] }>('@work/GET_ALL')
export const ADD_WORK = createAction<{ work: Work }>('@work/ADD_WORK')
export const UPDATE_WORK = createAction<{ work: Work, id:number }>('@work/UPDATE_WORK')
export const DELETE_WORK = createAction<{ id: number }>('@work/DELETE_WORK')