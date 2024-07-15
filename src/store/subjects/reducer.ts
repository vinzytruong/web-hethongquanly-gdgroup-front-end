import { createReducer } from '@reduxjs/toolkit'
import { ADD_SUBJECTS, DELETE_SUBJECTS, GET_ALL, UPDATE_SUBJECTS } from './action'
import { Subjects } from '@/interfaces/subjects';

export const initialState: Subjects[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.subjects;
        })
        .addCase(ADD_SUBJECTS, (state, action) => {
            state.push(action.payload.subjects)
        })
        .addCase(UPDATE_SUBJECTS, (state, action) => {
            console.log("updatedItems_action",action.payload.subjects);
            const updatedItems = state.map(item => {
                if (item.monHocID === action.payload.id) {
                    return { ...item, ...action.payload.subjects };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_SUBJECTS, (state, action) => {
            return state.filter(item => item.monHocID !== action.payload.id)
        })
)