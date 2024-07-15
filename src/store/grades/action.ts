import { Grades } from '@/interfaces/grades'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ grades: Grades[] }>('@grades/GET_ALL')
export const ADD_GRADES = createAction<{ grades: Grades }>('@grades/ADD_GRADES')
export const UPDATE_GRADES = createAction<{ grades: Grades, id:number }>('@grades/UPDATE_GRADES')
export const DELETE_GRADES = createAction<{ id: number }>('@grades/DELETE_GRADES')