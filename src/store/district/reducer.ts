import { createReducer } from '@reduxjs/toolkit'
import { GET_BY_PROVINCE_ID } from './action'
import { District } from '@/interfaces/district'

export const initialState: District[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_BY_PROVINCE_ID, (state, action) => {
            return action.payload.district;
        })
)