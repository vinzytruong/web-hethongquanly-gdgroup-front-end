import { createReducer } from '@reduxjs/toolkit'
import { SELECT_ITEM, OPEN_DRWAWER } from './action'

export type MenuProps = {
    selectedItem: string[];
    drawerOpen: boolean;
};


export const initialState: MenuProps = {
    selectedItem: ['dashboard'],
    drawerOpen: false
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(SELECT_ITEM, (state, action) => {
            state.selectedItem = action.payload.selectedItem
        })
        .addCase(OPEN_DRWAWER, (state, action) => {
            state.drawerOpen = action.payload.drawerOpen
        })
)