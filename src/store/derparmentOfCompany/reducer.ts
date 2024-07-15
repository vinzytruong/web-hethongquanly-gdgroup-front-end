import { createReducer } from '@reduxjs/toolkit'
import { ADD_DEPARTMENT_OF_COMPANY, DELETE_DEPARTMENT_OF_COMPANY, GET_ALL, UPDATE_DEPARTMENT_OF_COMPANY, GET_DERPARMENT_OF_COMPANY } from './action'
import { DerparmentOfCompany, } from '@/interfaces/derparmentOfCompany'

export const initialState: DerparmentOfCompany[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.derparmentOfCompany;
        })
        .addCase(GET_DERPARMENT_OF_COMPANY, (state, action) => {
            return action.payload.derparmentOfCompany;
        })
        .addCase(ADD_DEPARTMENT_OF_COMPANY, (state, action) => {
            state.push(action.payload.derparmentOfCompany)
        })
        .addCase(UPDATE_DEPARTMENT_OF_COMPANY, (state, action) => {
            const updatedState = state.filter(item => item.phongBanID !== action.payload.derparmentOfCompany.phongBanID)
            updatedState.push(action.payload.derparmentOfCompany);
            return updatedState;
        })
        .addCase(DELETE_DEPARTMENT_OF_COMPANY, (state, action) => {
            return state.filter(item => item.phongBanID !== action.payload.id)
        })
)