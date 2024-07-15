import { Subjects } from '@/interfaces/subjects'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ subjects: Subjects[] }>('@subjects/GET_ALL')
export const ADD_SUBJECTS = createAction<{ subjects: Subjects }>('@subjects/ADD_SUBJECTS')
export const UPDATE_SUBJECTS = createAction<{ subjects: Subjects, id:number }>('@subjects/UPDATE_SUBJECTS')
export const DELETE_SUBJECTS = createAction<{ id: number }>('@subjects/DELETE_SUBJECTS')