import { Interaction } from '@/interfaces/interaction'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ interaction: Interaction[] }>('@interaction/GET_ALL')
export const ADD_INTERACTION = createAction<{ interaction: Interaction }>('@interaction/ADD_INTERACTION')
export const UPDATE_INTERACTION = createAction<{ interaction: Interaction, id:number }>('@interaction/UPDATE_INTERACTION')
export const DELETE_INTERACTION = createAction<{ id: number }>('@interaction/DELETE_INTERACTION')