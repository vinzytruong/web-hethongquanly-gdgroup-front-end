import { createReducer } from '@reduxjs/toolkit'
import { ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT, SAVE_PRODUCT, SAVE_PRODUCTS } from './action'
import { Product } from '@/interfaces/product'



export interface ListProducts {
    products: Product[]
}
export const initialState: ListProducts = {
    products: []
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(SAVE_PRODUCTS, (state, action) => {
            state.products = action.payload.products
        })
        .addCase(SAVE_PRODUCT, (state, action) => {
            state.products[action.payload.id] = action.payload.products
        })
        .addCase(DELETE_PRODUCT, (state, action) => {
            state.products = state.products.filter((obj) => obj.id !== action.payload.id)
        })
        .addCase(ADD_PRODUCT, (state, action) => {
            state.products.push(action.payload.product)
        })
        .addCase(EDIT_PRODUCT, (state, action) => {
            state.products[action.payload.id] = action.payload.product
        })
)