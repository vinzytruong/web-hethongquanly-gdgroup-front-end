import { createReducer } from '@reduxjs/toolkit'
import { ADD_AGENCY, DELETE_AGENCY, GET_ALL, UPDATE_AGENCY } from './action'
import { Agency } from '@/interfaces/agency';

export const initialState: Agency[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.agency;
        })
        .addCase(ADD_AGENCY, (state, action) => {
            state.push(action.payload.agency)
        })
        .addCase(UPDATE_AGENCY, (state, action) => {
            const updatedItems = state.map(item => {
                if (item.daiLyID === action.payload.id) {
                    return { ...item, ...action.payload.agency };
                }
                return item;
            });
            return updatedItems

        })
        .addCase(DELETE_AGENCY, (state, action) => {
            return state.filter(item => item.daiLyID !== action.payload.id)
        })
)