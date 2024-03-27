import { CheckingStateProps, RootStateProps } from '@/interfaces/checking'
import { createAction } from '@reduxjs/toolkit'


export const GET_DATA_CHECKING = createAction<{ checking: CheckingStateProps }>('@checking/GET_DATA_CHECKING')