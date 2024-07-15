import { ContractorInteractions } from "@/interfaces/contractorInteraction";
import { createAction } from "@reduxjs/toolkit";

export const GET_ALL = createAction<{
  contractorInteractions: ContractorInteractions[];
}>("@CONTRACTORINTERACTIONS/GET_ALL_CONTRACTORINTERACTIONS");
export const ADD_CONTRACTORINTERACTIONS = createAction<{
  units: ContractorInteractions;
}>("@CONTRACTORINTERACTIONS/ADD_CONTRACTORINTERACTIONS");
export const UPDATE_CONTRACTORINTERACTIONS = createAction<{
  contractorInteractions: ContractorInteractions;
  id: number;
}>("@CONTRACTORINTERACTIONS/UPDATE_CONTRACTORINTERACTIONS");
export const DELETE_CONTRACTORINTERACTIONS = createAction<{ id: number }>(
  "@CONTRACTORINTERACTIONS/DELETE_CONTRACTORINTERACTIONS"
);
