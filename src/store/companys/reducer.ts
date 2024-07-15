import { createReducer } from '@reduxjs/toolkit'
import { ADD_COMPANY, DELETE_COMPANY, GET_ALL, UPDATE_COMPANY } from './action'
import { Companys } from '@/interfaces/companys'

export const initialState: Companys[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.companys;
        })
        .addCase(ADD_COMPANY, (state, action) => {
            state.push(action.payload.companys)
        })
        .addCase(UPDATE_COMPANY, (state, action) => {
            let updateState = state.filter(item => item.congTyID !== action.payload.companys.congTyID)
            updateState.push(action.payload.companys)
            return updateState
        })
        .addCase(DELETE_COMPANY, (state, action) => {
            return state.filter(item => item.congTyID !== action.payload.id)
        })
)