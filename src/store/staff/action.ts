import { Account } from '@/interfaces/auth'
import { Staff } from '@/interfaces/user'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ staff: Staff[] }>('@staff/GET_ALL')