import { Author } from '@/interfaces/author'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ author: Author[] }>('@author/GET_ALL')
export const ADD_AUTHOR = createAction<{ author: Author }>('@author/ADD_AUTHOR')
export const UPDATE_AUTHOR = createAction<{ author: Author, id:number }>('@author/UPDATE_AUTHOR')
export const DELETE_AUTHOR = createAction<{ id: number }>('@author/DELETE_AUTHOR')