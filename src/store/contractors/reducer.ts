import { createReducer } from '@reduxjs/toolkit'
import { ADD_CONTRACTORS, DELETE_CONTRACTORS, GET_ALL, UPDATE_CONTRACTORS } from './action'
import { Contractors } from '@/interfaces/contractors';

export const initialState: Contractors[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.contractors;
        })
        .addCase(ADD_CONTRACTORS, (state, action) => {
            state.push(action.payload.contractors)
        })
        .addCase(UPDATE_CONTRACTORS, (state, action) => {
            state = state.map(obj => {
                if (obj.nhaThauID === action.payload.id) {
                  obj.tenCongTy = action.payload.contractors.tenCongTy;
                  obj.diaChi=action.payload.contractors.diaChi;
                  obj.maSoThue=action.payload.contractors.maSoThue;
                  obj.nguoiDaiDien=action.payload.contractors.nguoiDaiDien;
                  obj.tinhID=action.payload.contractors.tinhID;
                  obj.thongTinThem=action.payload.contractors.thongTinThem;
                }
                return obj;
              });
        })
        .addCase(DELETE_CONTRACTORS, (state, action) => {
            return state.filter(item => item.nhaThauID !== action.payload.id)
        })
)