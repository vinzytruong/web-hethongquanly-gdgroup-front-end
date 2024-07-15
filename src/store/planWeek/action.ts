import { PlanWeek } from '@/interfaces/plan'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL = createAction<{ plan: PlanWeek[] }>('@planWeek/GET_ALL')
export const ADD_PLAN_WEEK = createAction<{ plan: PlanWeek }>('@planWeek/ADD_PLAN_WEEK')
export const UPDATE_PLAN_WEEK = createAction<{ plan: PlanWeek, id:number }>('@planWeek/UPDATE_PLAN_WEEK')
export const DELETE_PLAN_WEEK = createAction<{ id: number }>('@planWeek/DELETE_PLAN_WEEK')