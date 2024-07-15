import { createReducer } from '@reduxjs/toolkit'
import { ADD_UNITS, DELETE_UNITS, GET_ALL, UPDATE_UNITS } from './action'
import { Units } from '@/interfaces/units';

export const initialState: Units[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.units;
        })
        .addCase(ADD_UNITS, (state, action) => {
            state.push(action.payload.units)
        })
        .addCase(UPDATE_UNITS, (state, action) => {
            console.log("updatedItems_action",action.payload.units);
            const updatedItems = state.map(item => {
                if (item.dvtid === action.payload.id) {
                    return { ...item, ...action.payload.units };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_UNITS, (state, action) => {
            return state.filter(item => item.dvtid !== action.payload.id)
        })
)