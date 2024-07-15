import { RoleProvince } from '@/interfaces/roleProvince'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL_ROLE_PROVINCE = createAction<{ roleProvince: RoleProvince[] }>('@roleProvince/GET_ALL_ROLE_PROVINCE')
