import { PlanDay } from '@/interfaces/plan'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL = createAction<{ plan: PlanDay[] }>('@planDay/GET_ALL')
export const ADD_PLAN_DAY = createAction<{ plan: PlanDay }>('@planDay/ADD_PLAN_DAY')
export const UPDATE_PLAN_DAY = createAction<{ plan: PlanDay, id:number }>('@planDay/UPDATE_PLAN_DAY')
export const DELETE_PLAN_DAY = createAction<{ id: number }>('@planDay/DELETE_PLAN_DAY')