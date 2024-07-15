import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_MULTIPLE_PRODUCTINESTIMATES,
  ADD_PRODUCTINESTIMATES,
  DELETE_PRODUCTINESTIMATES,
  GET_ALL_PRODUCTSINESTIMATES,
  UPDATE_PRODUCTINESTIMATES,
  UPDATE_QUANTITY_PRODUCTINESTIMATES,
} from "./action";
import { ProductInEstimate, Products } from "@/interfaces/products";

export let initialState: ProductInEstimate[] = [];
export default createReducer(initialState, (builder) =>
  builder
    .addCase(GET_ALL_PRODUCTSINESTIMATES, (state, action) => {
      return action.payload.productInEstimates;
    })
    .addCase(ADD_PRODUCTINESTIMATES, (state, action) => {
      state.forEach((productInEstimate: ProductInEstimate) => {
        if (action.payload.product.khoiLop && action.payload.product.monHoc) {
          if (
            action.payload.product.khoiLop.some(
              (khoi: any) => khoi.khoiLopID === productInEstimate.khoiLopID
            ) &&
            action.payload.product.monHoc.some(
              (mh: any) => mh.monHocID === productInEstimate.monHocID
            )
          ) {
            let productFound = false; // Biến kiểm tra sản phẩm đã tồn tại hay chưa
            productInEstimate.sanPham.forEach((existingProduct) => {
              if (
                existingProduct.maSanPham === action.payload.product.maSanPham
              ) {
                productFound = true; // Đánh dấu rằng sản phẩm đã tồn tại
              }
            });

            // Nếu sản phẩm chưa tồn tại, thêm vào mảng sanPham
            if (!productFound) {
              productInEstimate.sanPham.push(action.payload.product);
            }
          }
        }
      });
    })
    .addCase(ADD_MULTIPLE_PRODUCTINESTIMATES, (state, action) => {
      state.forEach((productInEstimate: ProductInEstimate) => {
        action.payload.products.forEach((product: Products) => {
          if (product.khoiLop && product.monHoc) {
            if (
              product.khoiLop.some(
                (khoi: any) => khoi.khoiLopID === productInEstimate.khoiLopID
              ) &&
              product.monHoc.some(
                (mh: any) => mh.monHocID === productInEstimate.monHocID
              )
            ) {
              let productFound = false;
              productInEstimate.sanPham.forEach((existingProduct) => {
                if (existingProduct.maSanPham === product.maSanPham) {
                  productFound = true;
                }
              });
              if (!productFound) {
                productInEstimate.sanPham.push(product);
              }
            }
          }
        });
      });
    })

    .addCase(UPDATE_PRODUCTINESTIMATES, (state, action) => {
      // Create a new array with updated items
      const updatedState = state.map((productInEstimate) => {
        // Check if the current productInEstimate has the item to update
        const updatedSanPham = productInEstimate.sanPham.map((item) => {
          if (action.payload.product.maSanPham === item.maSanPham) {
            return {
              ...action.payload.product, // Update all properties of the item
              soLuong: item.soLuong,
              isChange: true,
            };
          }
          return item; // Return the original item if it doesn't need updating
        });

        // Return the updated productInEstimate with the updated sanPham array
        return {
          ...productInEstimate,
          sanPham: updatedSanPham,
        };
      });

      // Return the updated state
      return updatedState;
    })

    .addCase(UPDATE_QUANTITY_PRODUCTINESTIMATES, (state, action) => {
      // Create a new array with updated items
      const updatedState = state.map((productInEstimate) => {
        if (
          action.payload.productInEstimate.khoiLopID ===
            productInEstimate.khoiLopID &&
          action.payload.productInEstimate.monHocID ===
            productInEstimate.monHocID
        ) {
          return {
            ...action.payload.productInEstimate,
            isChange: true,
          };
        }
        return productInEstimate;
      });
      // Return the updated state
      return updatedState;
    })
    .addCase(DELETE_PRODUCTINESTIMATES, (state, action) => {
      return state.map((productInEstimate) => {
        if (
          productInEstimate.khoiLopID === action.payload.khoiLopID &&
          productInEstimate.monHocID === action.payload.monHocID
        ) {
          // Filter out the product with matching sanPhamID
          return {
            ...productInEstimate,
            sanPham: productInEstimate.sanPham.filter(
              (product) =>
                product.maSanPham !== action.payload.product.maSanPham
            ),
          };
        }
        return productInEstimate; // Return other estimate items as they are
      });
    })
);
