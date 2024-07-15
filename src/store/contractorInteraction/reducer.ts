import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_CONTRACTORINTERACTIONS,
  DELETE_CONTRACTORINTERACTIONS,
  GET_ALL,
  UPDATE_CONTRACTORINTERACTIONS,
} from "./action";
import { ContractorInteractions } from "@/interfaces/contractorInteraction";

export const initialState: ContractorInteractions[] = [];
export default createReducer(initialState, (builder) =>
  builder
    .addCase(GET_ALL, (state, action) => {
      return action.payload.contractorInteractions;
    })
    .addCase(ADD_CONTRACTORINTERACTIONS, (state, action) => {
      state.push(action.payload.units);
    })
    .addCase(UPDATE_CONTRACTORINTERACTIONS, (state, action) => {
      console.log("updatedItems_action", action.payload.contractorInteractions);
      const updatedItems = state.map((item) => {
        if (item.gtchid === action.payload.id) {
          return { ...item, ...action.payload.contractorInteractions };
        }
        return item;
      });

      return updatedItems;
    })
    .addCase(DELETE_CONTRACTORINTERACTIONS, (state, action) => {
      return state.filter((item) => item.gtchid !== action.payload.id);
    })
);
