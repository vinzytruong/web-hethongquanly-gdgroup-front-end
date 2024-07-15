import { createReducer } from '@reduxjs/toolkit'
import {  GET_ALL_CONTRACTOR_TYPE } from './action'
import { Contractors, ContractorsType } from '@/interfaces/contractors';

export const initialState: ContractorsType[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_CONTRACTOR_TYPE, (state, action) => {
            return action.payload.contractorsType;
        })
        
)