import { createReducer } from '@reduxjs/toolkit'
import { ADD_POSITION_OF_COMPANY, DELETE_POSITION_OF_COMPANY, GET_ALL_POSITION, UPDATE_POSITION_BY_ID, GET_POSITION_BY_DEPARTMENT } from './action'
import { Position } from '@/interfaces/position'

export const initialState: Position[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_POSITION, (state, action) => {
            return action.payload.position;
        })
        .addCase(GET_POSITION_BY_DEPARTMENT, (state, action) => {
            return action.payload.position;
        })
        .addCase(UPDATE_POSITION_BY_ID, (state, action) => {
            const updatedState = state.filter(item => item.chucVuID !== action.payload.position.chucVuID);
            updatedState.push(action.payload.position);
            return updatedState;
        })

        .addCase(ADD_POSITION_OF_COMPANY, (state, action) => {
            state.push(action.payload.position)
        })
        .addCase(DELETE_POSITION_OF_COMPANY, (state, action) => {
            return state.filter(item => item.chucVuID !== action.payload.id)
        })
)