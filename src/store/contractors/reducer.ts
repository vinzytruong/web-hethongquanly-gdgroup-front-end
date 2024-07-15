import { createReducer } from '@reduxjs/toolkit'
import { ADD_CONTRACTORS, DELETE_CONTRACTORS, GET_ALL, UPDATE_CONTRACTORS } from './action'
import { Contractors } from '@/interfaces/contractors';

export const initialState: Contractors[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.contractors;
        })
        .addCase(ADD_CONTRACTORS, (state, action) => {
            state.push(action.payload.contractors)
        })
        .addCase(UPDATE_CONTRACTORS, (state, action) => {
            console.log("updatedItems_action",action.payload.contractors);
            const updatedItems = state.map(item => {
                if (item.nhaThauID === action.payload.id) {
                    return { ...item, ...action.payload.contractors };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_CONTRACTORS, (state, action) => {
            return state.filter(item => item.nhaThauID !== action.payload.id)
        })
)