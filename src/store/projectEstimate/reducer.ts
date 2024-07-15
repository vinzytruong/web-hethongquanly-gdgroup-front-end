import { createReducer } from '@reduxjs/toolkit'
import { ADD_PROJECTESTIMATE, DELETE_PROJECTESTIMATE, GET_ALL, UPDATE_PROJECTESTIMATE } from './action'
import { ProjectEstimate } from '@/interfaces/projectEstimate';

export const initialState: ProjectEstimate[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.projectEstimate;
        })
        .addCase(ADD_PROJECTESTIMATE, (state, action) => {
            state.push(action.payload.projectEstimate)
        })
        .addCase(UPDATE_PROJECTESTIMATE, (state, action) => {
            const updatedState = state.filter(item => item.duToanID !== action.payload.projectEstimate.duToanID);
            updatedState.push(action.payload.projectEstimate);
            return updatedState;
        })
        .addCase(DELETE_PROJECTESTIMATE, (state, action) => {
            return state.filter(item => item.duToanID !== action.payload.id)
        })
        )