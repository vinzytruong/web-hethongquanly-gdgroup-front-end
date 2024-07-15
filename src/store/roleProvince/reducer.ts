import { createReducer } from '@reduxjs/toolkit'
import { RoleProvince } from '@/interfaces/roleProvince';
import { GET_ALL_ROLE_PROVINCE } from './action';

export const initialState: RoleProvince[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_ROLE_PROVINCE, (state, action) => {
            return action.payload.roleProvince;
        })

)