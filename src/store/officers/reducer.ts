import { createReducer } from '@reduxjs/toolkit'
import { ADD_OFFICERS, DELETE_OFFICERS, GET_ALL, UPDATE_OFFICERS } from './action'
import { Officers } from '@/interfaces/officers';

export const initialState: Officers[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.officers;
        })
        .addCase(ADD_OFFICERS, (state, action) => {
            state.push(action.payload.officers)
        })
        .addCase(UPDATE_OFFICERS, (state, action) => {
            state = state.map(obj => {
                if (obj.canBoID === action.payload.id) {
                  // Cập nhật giá trị cho thuộc tính bạn muốn
                  obj.chucVu = action.payload.officers.chucVu;
                  obj.email=action.payload.officers.email;
                  obj.gioiTinh=action.payload.officers.gioiTinh;
                  obj.hoVaTen=action.payload.officers.hoVaTen;
                  obj.soDienThoai=action.payload.officers.soDienThoai;
                }
                return obj;
              });
        })
        .addCase(DELETE_OFFICERS, (state, action) => {
            return state.filter(item => item.canBoID !== action.payload.id)
        })
)