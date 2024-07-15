import { createReducer } from '@reduxjs/toolkit'
import { GET_ALL_REPORT_PROJECT_INTERACT } from './action'
import { ReportProjectInteract } from '@/interfaces/reportProjectInteract';

export const initialState: ReportProjectInteract[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_REPORT_PROJECT_INTERACT, (state, action) => {
            return action.payload.reportProjectInteract;
        })
)
