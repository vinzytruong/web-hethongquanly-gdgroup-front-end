import { createReducer } from '@reduxjs/toolkit'
import { GET_ALL } from './action'
import { Province } from '@/interfaces/province'

export const initialState: Province[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.province;
        })
)