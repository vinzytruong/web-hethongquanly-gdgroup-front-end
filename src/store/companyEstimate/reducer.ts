import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_COMPANYESTIMATES,
  DELETE_COMPANYESTIMATES,
  GET_ALL,
  UPDATE_COMPANYESTIMATES,
} from "./action";
import { CompanyEstimates } from "@/interfaces/companyEstimates";

export const initialState: CompanyEstimates[] = [];
export default createReducer(initialState, (builder) =>
  builder
    .addCase(GET_ALL, (state, action) => {
      return action.payload.companyEstimates;
    })
    .addCase(ADD_COMPANYESTIMATES, (state, action) => {
      state.push(action.payload.companyEstimates);
    })
    .addCase(UPDATE_COMPANYESTIMATES, (state, action) => {
      console.log("updatedItems_action", action.payload.companyEstimates);
      const updatedItems = state.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload.companyEstimates };
        }
        return item;
      });

      return updatedItems;
    })
    .addCase(DELETE_COMPANYESTIMATES, (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    })
);
