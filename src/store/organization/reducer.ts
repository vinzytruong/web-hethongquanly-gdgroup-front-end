import { createReducer } from '@reduxjs/toolkit'
import { ADD_ORGANIZATION, DELETE_ORGANIZATION, GET_ALL, UPDATE_ORGANIZATION } from './action'
import { Organization } from '@/interfaces/organization';

export const initialState: Organization[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.organization;
        })
        .addCase(ADD_ORGANIZATION, (state, action) => {
            state.push(action.payload.organization)
        })
        .addCase(UPDATE_ORGANIZATION, (state, action) => {
            state = state.map(obj => {
                if (obj.coQuanID === action.payload.id) {
                  // Cập nhật giá trị cho thuộc tính bạn muốn
                  obj.tenCoQuan = action.payload.organization.tenCoQuan;
                  obj.diaChi=action.payload.organization.diaChi;
                  obj.maSoThue=action.payload.organization.maSoThue;
                  obj.huyenID=action.payload.organization.huyenID;
                  obj.tinhID=action.payload.organization.tinhID;
                }
                return obj;
              });
        })
        .addCase(DELETE_ORGANIZATION, (state, action) => {
            return state.filter(item => item.coQuanID !== action.payload.id)
        })
)