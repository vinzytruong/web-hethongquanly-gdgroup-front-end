import { ProjectEstimate } from '@/interfaces/projectEstimate'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ projectEstimate: ProjectEstimate[] }>('@projectEstimate/GET_ALL')
export const ADD_PROJECTESTIMATE = createAction<{ projectEstimate: ProjectEstimate }>('@projectEstimate/ADD_PROJECTESTIMATE')
export const UPDATE_PROJECTESTIMATE = createAction<{ projectEstimate: ProjectEstimate, id:number }>('@projectEstimate/UPDATE_PROJECTESTIMATE')
export const DELETE_PROJECTESTIMATE = createAction<{ id: number }>('@projectEstimate/DELETE_PROJECTESTIMATE')