import { Staff } from '@/interfaces/user'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL = createAction<{ staff: Staff[] }>('@staff/GET_ALL')
export const DELETE_STAFF = createAction<{ id: number }>('@staff/DELETE_STAFF')
export const ADD_ROLE_STAFF = createAction<{ id: number, roles:string[] }>('@staff/ADD_ROLE_STAFF')