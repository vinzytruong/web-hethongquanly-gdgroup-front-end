import { SupplierType } from '@/interfaces/supplier'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL_SUPPLIER_TYPE = createAction<{ supplierType: SupplierType[] }>('@supplierType/GET_ALL_SUPPLIER_TYPE')