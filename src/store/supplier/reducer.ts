import { createReducer } from '@reduxjs/toolkit'
import { ADD_SUPPLIER, DELETE_SUPPLIER, GET_ALL, UPDATE_SUPPLIER } from './action'
import { Supplier } from '@/interfaces/supplier';

export const initialState: Supplier[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.supplier;
        })
        .addCase(ADD_SUPPLIER, (state, action) => {
            state.push(action.payload.supplier)
        })
        .addCase(UPDATE_SUPPLIER, (state, action) => {
            state = state.map(obj => {
                if (obj.nhaCungCapID === action.payload.id) {
                  obj.tenCongTy = action.payload.supplier.tenCongTy;
                  obj.diaChi=action.payload.supplier.diaChi;
                  obj.maSoThue=action.payload.supplier.maSoThue;
                  obj.nguoiDaiDien=action.payload.supplier.nguoiDaiDien;
                  obj.tinhID=action.payload.supplier.tinhID;
                  obj.thongTinThem=action.payload.supplier.thongTinThem;
                }
                return obj;
              });
        })
        .addCase(DELETE_SUPPLIER, (state, action) => {
            return state.filter(item => item.nhaCungCapID !== action.payload.id)
        })
)