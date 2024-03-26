import { createReducer } from '@reduxjs/toolkit'
import { LOGIN, LOGOUT } from './action'

export const initialState = {
    account: {
        username: '',
        role: ''
    },
    isLoggedIn: false,
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(LOGIN, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.account.username = action.payload.account.username
            state.account.role=action.payload.account.role
        })
        .addCase(LOGOUT, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
)