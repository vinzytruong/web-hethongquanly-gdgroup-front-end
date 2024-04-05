import { createReducer } from '@reduxjs/toolkit'
import { GET_DATA_CHECKING } from './action'
import { CheckingStateProps } from '@/interfaces/checking'

export const initialState: CheckingStateProps = {
    dataChecking: [],
    error: null
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_DATA_CHECKING, (state, action) => {
            state.dataChecking=action.payload.checking.dataChecking
        })
      
)