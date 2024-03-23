import { createAction } from '@reduxjs/toolkit'
import { Account } from './type'

export const LOGIN = createAction<{ isLoggedIn:boolean, account:Account }>('@auth/LOGIN')
export const LOGOUT = createAction<{ isLoggedIn:boolean}>('@auth/LOGOUT')