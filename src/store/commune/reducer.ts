import { createReducer } from '@reduxjs/toolkit'
import { GET_BY_DISTRICT_ID, GET_XA_BY_ID } from './action'
import { Commune } from '@/interfaces/commune'

export const initialState: Commune[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_BY_DISTRICT_ID, (state, action) => {
            return action.payload.commune;
        })
        .addCase(GET_XA_BY_ID, (state, action) => {
            state.push(action.payload.commune);
        })
)