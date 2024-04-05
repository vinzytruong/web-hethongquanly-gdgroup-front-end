import { createReducer } from '@reduxjs/toolkit'
import { ADD_INTERACTION, DELETE_INTERACTION, GET_ALL, UPDATE_INTERACTION } from './action'
import { Interaction } from '@/interfaces/interaction';

export const initialState: Interaction[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.interaction;
        })
        .addCase(ADD_INTERACTION, (state, action) => {
            state.push(action.payload.interaction)
        })
        .addCase(UPDATE_INTERACTION, (state, action) => {
            state = state.map(obj => {
                if (obj.tuongTacID === action.payload.id) {
                  obj.buocThiTruong = action.payload.interaction.buocThiTruong;
                  obj.canBoTiepXuc=action.payload.interaction.canBoTiepXuc;
                  obj.coQuanID=action.payload.interaction.coQuanID;
                  obj.ghiChu=action.payload.interaction.ghiChu;
                  obj.nhanVienID=action.payload.interaction.nhanVienID;
                  obj.nhomHangQuanTam=action.payload.interaction.nhomHangQuanTam;
                  obj.thoiGian=action.payload.interaction.thoiGian;
                  obj.thongTinLienHe=action.payload.interaction.thongTinLienHe;
                  obj.thongTinTiepXuc=action.payload.interaction.thongTinTiepXuc;
                }
                return obj;
              });
        })
        .addCase(DELETE_INTERACTION, (state, action) => {
            return state.filter(item => item.tuongTacID !== action.payload.id)
        })
)