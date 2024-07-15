import { Product } from "@/interfaces/product";
import { ProductInEstimate, Products } from "@/interfaces/products";
import { createAction } from "@reduxjs/toolkit";

export let GET_ALL_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  productInSharedEquipments: Products[];
}>("@products_in_shared_equipments/GET_ALL");
export let ADD_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  product: Products;
}>("@products_in_shared_equipments/ADD_PRODUCTS");
export let UPDATE_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  product: Products;
}>("@products_in_shared_equipments/UPDATE_PRODUCTS");
export let DELETE_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  product: Products;
}>("@products_in_shared_equipments/DELETE_PRODUCTS");
export let ADD_MULTIPLE_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  products: Products[];
}>("@products_in_shared_equipments/ADD_MULTIPLE_PRODUCTS");
export let UPDATE_QUANTITY_PRODUCTINSHAREDEQUIPMENTS = createAction<{
  product: Products;
}>("@products_in_shared_equipments/UPDATE_QUANTITY_PRODUCTS");
