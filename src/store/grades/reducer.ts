import { createReducer } from '@reduxjs/toolkit'
import { ADD_GRADES, DELETE_GRADES, GET_ALL, UPDATE_GRADES } from './action'
import { Grades } from '@/interfaces/grades';

export const initialState: Grades[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.grades;
        })
        .addCase(ADD_GRADES, (state, action) => {
            state.push(action.payload.grades)
        })
        .addCase(UPDATE_GRADES, (state, action) => {
            console.log("updatedItems_action",action.payload.grades);
            const updatedItems = state.map(item => {
                if (item.khoiLopID === action.payload.id) {
                    return { ...item, ...action.payload.grades };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_GRADES, (state, action) => {
            return state.filter(item => item.khoiLopID !== action.payload.id)
        })
)