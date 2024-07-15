import { Role } from '@/interfaces/role'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL_ROLE = createAction<{ role: Role[] }>('@role/GET_ALL_ROLE')
