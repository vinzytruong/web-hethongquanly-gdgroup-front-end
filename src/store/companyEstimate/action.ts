import { CompanyEstimates } from "@/interfaces/companyEstimates";
import { createAction } from "@reduxjs/toolkit";

export const GET_ALL = createAction<{ companyEstimates: CompanyEstimates[] }>(
  "@companyEstimates/GET_ALL"
);
export const ADD_COMPANYESTIMATES = createAction<{
  companyEstimates: CompanyEstimates;
}>("@companyEstimates/ADD_COMPANYESTIMATES");
export const UPDATE_COMPANYESTIMATES = createAction<{
  companyEstimates: CompanyEstimates;
  id: number;
}>("@companyEstimates/UPDATE_COMPANYESTIMATES");
export const DELETE_COMPANYESTIMATES = createAction<{ id: number }>(
  "@companyEstimates/DELETE_COMPANYESTIMATES"
);
