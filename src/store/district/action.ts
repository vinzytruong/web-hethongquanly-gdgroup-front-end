import { District } from '@/interfaces/district'
import { createAction } from '@reduxjs/toolkit'


export const GET_BY_PROVINCE_ID = createAction<{ district: District[] }>('@district/GET_BY_PROVINCE_ID')