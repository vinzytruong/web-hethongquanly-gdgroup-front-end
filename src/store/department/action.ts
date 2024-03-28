import { DepartmentStateProps } from '@/interfaces/department'
import { createAction } from '@reduxjs/toolkit'


export const GET_LIST_DEPARTMENT_HANNET = createAction<{ department: DepartmentStateProps }>('@checking/GET_LIST_DEPARTMENT_HANNET')