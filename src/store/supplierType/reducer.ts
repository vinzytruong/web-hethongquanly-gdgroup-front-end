import { createReducer } from '@reduxjs/toolkit'
import { GET_ALL_SUPPLIER_TYPE } from './action'
import { SupplierType } from '@/interfaces/supplier';

export const initialState: SupplierType[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_SUPPLIER_TYPE, (state, action) => {
            return action.payload.supplierType;
        })
)