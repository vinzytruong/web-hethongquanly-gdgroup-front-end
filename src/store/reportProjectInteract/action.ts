import { ReportProjectInteract } from '@/interfaces/reportProjectInteract'
import { createAction } from '@reduxjs/toolkit'

export const GET_ALL_REPORT_PROJECT_INTERACT = createAction<{ reportProjectInteract: ReportProjectInteract[] }>('@reportProjectInteract/GET_ALL')