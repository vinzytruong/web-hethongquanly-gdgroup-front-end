import { createReducer } from '@reduxjs/toolkit'
import { ADD_PRODUCTS, DELETE_PRODUCTS, GET_ALL, UPDATE_PRODUCTS } from './action'
import { Products } from '@/interfaces/products';

export const initialState: Products[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.products;
        })
        .addCase(ADD_PRODUCTS, (state, action) => {
            state.push(action.payload.products)
        })
        .addCase(UPDATE_PRODUCTS, (state, action) => {
            console.log("updatedItems_action",action.payload.products);
            const updatedItems = state.map(item => {
                if (item.sanPhamID === action.payload.id) {
                    return { ...item, ...action.payload.products };
                }
                return item;
            });
            

            return updatedItems

        })
        .addCase(DELETE_PRODUCTS, (state, action) => {
            return state.filter(item => item.sanPhamID !== action.payload.id)
        })
)