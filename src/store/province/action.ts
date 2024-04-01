import { Province } from '@/interfaces/province'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ province: Province[] }>('@province/GET_ALL')