import { Sites } from '@/interfaces/site'
import { createAction } from '@reduxjs/toolkit'

export const SAVE_SITES = createAction<{ sites: Sites[] }>('@sites/SAVE_SITES')
export const SAVE_SITE = createAction<{ site: Sites, id: number }>('@sites/SAVE_SITE')
export const DELETE_SITE = createAction<{ id: number }>('@sites/DELETE_SITE')
export const ADD_SITE = createAction<{ site: Sites }>('@sites/ADD_SITE')
export const EDIT_SITE = createAction<{ id:number, site: Sites }>('@sites/EDIT_SITE')