import { Account } from '@/interfaces/auth'
import { createAction } from '@reduxjs/toolkit'


export const LOGIN = createAction<{ isLoggedIn:boolean, account:Account }>('@auth/LOGIN')
export const LOGOUT = createAction<{ isLoggedIn:boolean}>('@auth/LOGOUT')