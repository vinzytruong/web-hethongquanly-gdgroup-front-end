import { createReducer } from '@reduxjs/toolkit'
import { ADD_ROLE_STAFF, DELETE_STAFF, GET_ALL } from './action'
import { Staff } from '@/interfaces/user'

export const initialState:Staff[] =[]
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.staff;
        })
        .addCase(DELETE_STAFF, (state, action) => {
            return state.filter(item => item.nhanVienID !== action.payload.id)
        })
        .addCase(ADD_ROLE_STAFF, (state, action) => {    
            state.find(item => item.nhanVienID === action.payload.id)?.role!=action.payload.roles
            console.log("action.payload.roles",state.find(item => item.nhanVienID === action.payload.id));
        })
)