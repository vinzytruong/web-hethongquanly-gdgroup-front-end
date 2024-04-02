import { Contractors } from '@/interfaces/contractors'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ contractors: Contractors[] }>('@contractors/GET_ALL')
export const ADD_CONTRACTORS = createAction<{ contractors: Contractors }>('@contractors/ADD_CONTRACTORS')
export const UPDATE_CONTRACTORS = createAction<{ contractors: Contractors, id:number }>('@contractors/UPDATE_CONTRACTORS')
export const DELETE_CONTRACTORS = createAction<{ id: number }>('@contractors/DELETE_CONTRACTORS')