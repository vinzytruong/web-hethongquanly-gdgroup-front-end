import { createReducer } from '@reduxjs/toolkit'
import { ADD_PRODUCTTYPES, DELETE_PRODUCTTYPES, GET_ALL, UPDATE_PRODUCTTYPES } from './action'
import { ProductTypes } from '@/interfaces/productTypes';

export const initialState: ProductTypes[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.productTypes;
        })
        .addCase(ADD_PRODUCTTYPES, (state, action) => {
            state.push(action.payload.productTypes)
        })
        .addCase(UPDATE_PRODUCTTYPES, (state, action) => {
            console.log("updatedItems_action",action.payload.productTypes);
            const updatedItems = state.map(item => {
                if (item.loaiSanPhamID === action.payload.id) {
                    return { ...item, ...action.payload.productTypes };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_PRODUCTTYPES, (state, action) => {
            return state.filter(item => item.loaiSanPhamID !== action.payload.id)
        })
)