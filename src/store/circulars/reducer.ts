import { createReducer } from "@reduxjs/toolkit";
import {
  ADD_CIRCULARS,
  DELETE_CIRCULARS,
  GET_ALL,
  UPDATE_CIRCULARS,
} from "./action";
import { Circulars } from "@/interfaces/circulars";

export const initialState: Circulars[] | null = [];
export default createReducer(initialState, (builder) =>
  builder
    .addCase(GET_ALL, (state, action) => {
      return action.payload.circulars;
    })
    .addCase(ADD_CIRCULARS, (state, action) => {
      state.push(action.payload.circulars);
    })
    .addCase(UPDATE_CIRCULARS, (state, action) => {
      const updatedItems = state.map((item) => {
        if (item.thongTuID === action.payload.id) {
          return { ...item, ...action.payload.circulars };
        }
        return item;
      });

      return updatedItems;
    })
    .addCase(DELETE_CIRCULARS, (state, action) => {
      return state.filter((item) => item.thongTuID !== action.payload.id);
    })
);
