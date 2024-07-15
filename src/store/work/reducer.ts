import { createReducer } from '@reduxjs/toolkit'
import { ADD_WORK, DELETE_WORK, GET_ALL, UPDATE_WORK } from './action'
import { Work } from '@/interfaces/work';

export const initialState: Work[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.work;
        })
        .addCase(ADD_WORK, (state, action) => {
            state.push(action.payload.work)
        })
        .addCase(UPDATE_WORK, (state, action) => {
            console.log("updatedItems_action",action.payload.work);
            const updatedItems = state.map(item => {
                if (item.congViecID === action.payload.id) {
                    return { ...item, ...action.payload.work };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_WORK, (state, action) => {
            return state.filter(item => item.congViecID !== action.payload.id)
        })
)