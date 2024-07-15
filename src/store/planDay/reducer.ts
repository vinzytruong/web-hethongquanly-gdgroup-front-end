import { createReducer } from '@reduxjs/toolkit'
import { ADD_PLAN_DAY, DELETE_PLAN_DAY, GET_ALL, UPDATE_PLAN_DAY } from './action'
import { PlanDay } from '@/interfaces/plan';

export const initialState: PlanDay[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.plan;
        })
        .addCase(ADD_PLAN_DAY, (state, action) => {
            state.push(action.payload.plan)
        })
        .addCase(UPDATE_PLAN_DAY, (state, action) => {
            const updatedItems = state.map(item => {
                if (item.ngayID === action.payload.id) {
                    return { ...item, ...action.payload.plan };
                }
                return item;
            });
            return updatedItems
        })
        .addCase(DELETE_PLAN_DAY, (state, action) => {
            return state.filter(item => item.ngayID !== action.payload.id)
        })
)