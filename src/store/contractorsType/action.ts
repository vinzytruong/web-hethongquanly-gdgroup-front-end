import { Contractors, ContractorsType } from '@/interfaces/contractors'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL_CONTRACTOR_TYPE = createAction<{ contractorsType: ContractorsType[] }>('@contractorsType/GET_ALL_CONTRACTOR_TYPE')