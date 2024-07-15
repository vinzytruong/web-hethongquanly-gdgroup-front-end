import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_MULTIPLE_PRODUCTINSHAREDEQUIPMENTS,
  ADD_PRODUCTINSHAREDEQUIPMENTS,
  DELETE_PRODUCTINSHAREDEQUIPMENTS,
  GET_ALL_PRODUCTINSHAREDEQUIPMENTS,
  UPDATE_PRODUCTINSHAREDEQUIPMENTS,
  UPDATE_QUANTITY_PRODUCTINSHAREDEQUIPMENTS,
} from "./action";
import { ProductInEstimate, Products } from "@/interfaces/products";

export let initialState: Products[] = [];
export default createReducer(initialState, (builder) =>
  builder
    .addCase(GET_ALL_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {
      return action.payload.productInSharedEquipments;
    })
    .addCase(ADD_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {
      state.push(action.payload.product);
    })
    .addCase(ADD_MULTIPLE_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {})

    .addCase(UPDATE_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {
      const updatedState = state.map((product) => {
        if (product.sanPhamID === action.payload.product.sanPhamID) {
          return {
            ...action.payload.product,
            soLuong: product.soLuong, // Retain the original quantity
          }; // Update the changed product // Cập nhật sản phẩm đã thay đổi
        }
        return product; // Trả về sản phẩm khác như cũ
      });
      return updatedState;
    })

    .addCase(UPDATE_QUANTITY_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {
      const updatedState = state.map((product) => {
        if (product.sanPhamID === action.payload.product.sanPhamID) {
          return {
            ...action.payload.product,
          }; // Update the changed product // Cập nhật sản phẩm đã thay đổi
        }
        return product; // Trả về sản phẩm khác như cũ
      });
      return updatedState;
    })
    .addCase(DELETE_PRODUCTINSHAREDEQUIPMENTS, (state, action) => {
      return state.filter(
        (product) => product.sanPhamID !== action.payload.product.sanPhamID
      );
    })
);
