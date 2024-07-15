import { createReducer } from '@reduxjs/toolkit'
import { ADD_PLAN_MONTH, DELETE_PLAN_MONTH, GET_ALL, UPDATE_PLAN_MONTH } from './action'
import { PlanMonth } from '@/interfaces/plan';

export const initialState: PlanMonth[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.plan;
        })
        .addCase(ADD_PLAN_MONTH, (state, action) => {
            state.push(action.payload.plan)
        })
        .addCase(UPDATE_PLAN_MONTH, (state, action) => {
            const updatedItems = state.map(item => {
                if (item.thangID === action.payload.id) {
                    return { ...item, ...action.payload.plan };
                }
                return item;
            });
            return updatedItems
        })
        .addCase(DELETE_PLAN_MONTH, (state, action) => {
            return state.filter(item => item.thangID !== action.payload.id)
        })
)