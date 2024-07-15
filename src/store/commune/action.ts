import { Commune } from '@/interfaces/commune'
import { createAction } from '@reduxjs/toolkit'


export const GET_BY_DISTRICT_ID = createAction<{ commune: Commune[] }>('@commune/GET_BY_DISTRICT_ID')
export const GET_XA_BY_ID = createAction<{ commune: Commune }>('@commune/GET_XA_BY_ID')