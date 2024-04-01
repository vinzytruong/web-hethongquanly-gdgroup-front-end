import { Organization } from '@/interfaces/organization'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL = createAction<{ organization: Organization[] }>('@organization/GET_ALL')
export const ADD_ORGANIZATION = createAction<{ organization: Organization }>('@organization/ADD_ORGANIZATION')
export const UPDATE_ORGANIZATION = createAction<{ organization: Organization, id:number }>('@organization/UPDATE_ORGANIZATION')
export const DELETE_ORGANIZATION = createAction<{ id: number }>('@organization/DELETE_ORGANIZATION')