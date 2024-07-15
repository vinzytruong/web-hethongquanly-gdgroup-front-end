import { PlanMonth } from '@/interfaces/plan'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ plan: PlanMonth[] }>('@plan/GET_ALL')
export const ADD_PLAN_MONTH = createAction<{ plan: PlanMonth }>('@plan/ADD_PLAN_MONTH')
export const UPDATE_PLAN_MONTH = createAction<{ plan: PlanMonth, id:number }>('@plan/UPDATE_PLAN_MONTH')
export const DELETE_PLAN_MONTH = createAction<{ id: number }>('@plan/DELETE_PLAN_MONTH')