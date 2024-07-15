import { createReducer } from '@reduxjs/toolkit'
import { GET_STAFF_DETAIL_BY_ID } from './action'
import { StaffDetail } from '@/interfaces/user'

export const initialState:StaffDetail={
    nhanVienID: 0,
    tenNhanVien: ''
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_STAFF_DETAIL_BY_ID, (state, action) => {
            return action.payload.staffDetail;
        })
    
)