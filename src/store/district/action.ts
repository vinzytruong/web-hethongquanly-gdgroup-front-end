import { District } from '@/interfaces/district'
import { createAction } from '@reduxjs/toolkit'


export const GET_BY_PROVINCE_ID = createAction<{ district: District[] }>('@district/GET_BY_PROVINCE_ID')
export const GET_HUYEN_BY_ID = createAction<{ district: District }>('@district/GET_HUYEN_BY_ID')