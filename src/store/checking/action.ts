import { CheckingStateProps } from '@/interfaces/checking'
import { createAction } from '@reduxjs/toolkit'


export const GET_DATA_CHECKING = createAction<{ checking: CheckingStateProps }>('@checking/GET_DATA_CHECKING')
// export const GET_DATA_CHECKING_ONE_PERSON = createAction<{ checking: CheckingStateProps[] }>('@checking/GET_DATA_CHECKING_ONE_PERSON')