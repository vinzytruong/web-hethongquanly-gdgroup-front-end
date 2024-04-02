import { createReducer } from '@reduxjs/toolkit'
import { ADD_AUTHOR, DELETE_AUTHOR, GET_ALL, UPDATE_AUTHOR } from './action'
import { Author } from '@/interfaces/author';

export const initialState: Author[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.author;
        })
        .addCase(ADD_AUTHOR, (state, action) => {
            state.push(action.payload.author)
        })
        .addCase(UPDATE_AUTHOR, (state, action) => {
            state = state.map(obj => {
                if (obj.tacGiaID === action.payload.id) {
                  obj.active = action.payload.author.active;
                  obj.cccd=action.payload.author.cccd;
                  obj.chucVuTacGia=action.payload.author.chucVuTacGia;
                  obj.donViCongTac=action.payload.author.donViCongTac;
                  obj.email=action.payload.author.email;
                  obj.gioiTinh=action.payload.author.gioiTinh;
                  obj.monChuyenNghanh=action.payload.author.monChuyenNghanh;
                  obj.ngaySinh=action.payload.author.ngaySinh;
                  obj.soDienThoai=action.payload.author.soDienThoai;
                  obj.tenTacGia=action.payload.author.tenTacGia;
                }
                return obj;
              });
        })
        .addCase(DELETE_AUTHOR, (state, action) => {
            return state.filter(item => item.tacGiaID !== action.payload.id)
        })
)