import { createAction } from '@reduxjs/toolkit'

export const SELECT_ITEM = createAction<{ selectedItem: string[] }>('@menu/SELECT_ITEM')
export const OPEN_DRWAWER = createAction<{ drawerOpen: boolean }>('@menu/OPEN_DRAWER')