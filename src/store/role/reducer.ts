import { createReducer } from '@reduxjs/toolkit'
import { Role } from '@/interfaces/role';
import { GET_ALL_ROLE } from './action';

export const initialState: Role[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_ROLE, (state, action) => {
            return action.payload.role;
        })

)