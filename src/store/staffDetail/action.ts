import { StaffDetail } from '@/interfaces/user'
import { createAction } from '@reduxjs/toolkit'

export const GET_STAFF_DETAIL_BY_ID = createAction<{ staffDetail: StaffDetail }>('@staff/GET_STAFF_DETAIL_BY_ID')