import { ProductInEstimate, Products } from "@/interfaces/products";
import { createAction } from "@reduxjs/toolkit";

export let GET_ALL_PRODUCTSINESTIMATES = createAction<{
  productInEstimates: ProductInEstimate[];
}>("@products_in_estimates/GET_ALL");
export let ADD_PRODUCTINESTIMATES = createAction<{
  product: Products;
}>("@products_in_estimates/ADD_PRODUCTS");
export let UPDATE_PRODUCTINESTIMATES = createAction<{
  product: Products;
}>("@products_in_estimates/UPDATE_PRODUCTS");
export let DELETE_PRODUCTINESTIMATES = createAction<{
  product: Products;
  khoiLopID: number;
  monHocID: number;
}>("@products_in_estimates/DELETE_PRODUCTS");
export let ADD_MULTIPLE_PRODUCTINESTIMATES = createAction<{
  products: Products[];
}>("@products_in_estimates/ADD_MULTIPLE_PRODUCTS");
export let UPDATE_QUANTITY_PRODUCTINESTIMATES = createAction<{
  productInEstimate: ProductInEstimate;
}>("@products_in_estimates/UPDATE_QUANTITY_PRODUCTS");
