import { createReducer } from '@reduxjs/toolkit'
import { GET_ALL } from './action'
import { Staff } from '@/interfaces/user'

export const initialState:Staff[] =[]
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.staff;
        })
)