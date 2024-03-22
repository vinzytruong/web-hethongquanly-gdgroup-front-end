import { createReducer } from '@reduxjs/toolkit'
import { Sites } from '@/interfaces/site'
import { ADD_SITE, DELETE_SITE, EDIT_SITE, SAVE_SITE, SAVE_SITES } from './action'


export interface ListSites {
    sites: Sites[]
}
export const initialState: ListSites = {
    sites: []
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(SAVE_SITES, (state, action) => {
            state.sites = action.payload.sites
        })
        .addCase(SAVE_SITE, (state, action) => {
            state.sites[action.payload.id] = action.payload.site
        })
        .addCase(DELETE_SITE, (state, action) => {
            state.sites = state.sites.filter((obj) => obj.id !== action.payload.id)
        })
        .addCase(ADD_SITE, (state, action) => {
            state.sites.push(action.payload.site)
        })
        .addCase(EDIT_SITE, (state, action) => {
            state.sites[action.payload.id] = action.payload.site
        })
)