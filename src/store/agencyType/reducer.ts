import { createReducer } from '@reduxjs/toolkit'
import { Agency, AgencyType } from '@/interfaces/agency';
import { GET_ALL_AGENCY_TYPE } from './action';

export const initialState: AgencyType[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL_AGENCY_TYPE, (state, action) => {
            return action.payload.agencyType;
        })
        
)