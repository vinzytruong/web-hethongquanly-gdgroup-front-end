import { createReducer } from '@reduxjs/toolkit'
import { ADD_PLAN_WEEK, DELETE_PLAN_WEEK, GET_ALL, UPDATE_PLAN_WEEK } from './action'
import { PlanWeek } from '@/interfaces/plan';

export const initialState: PlanWeek[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.plan;
        })
        .addCase(ADD_PLAN_WEEK, (state, action) => {
            state.push(action.payload.plan)
        })
        .addCase(UPDATE_PLAN_WEEK, (state, action) => {
            const updatedItems = state.map(item => {
                if (item.tuanID === action.payload.id) {
                    return { ...item, ...action.payload.plan };
                }
                return item;
            });
            return updatedItems
        })
        .addCase(DELETE_PLAN_WEEK, (state, action) => {
            return state.filter(item => item.tuanID !== action.payload.id)
        })
)