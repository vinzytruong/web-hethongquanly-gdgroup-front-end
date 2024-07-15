import { Agency, AgencyType } from '@/interfaces/agency'
import { createAction } from '@reduxjs/toolkit'


export const GET_ALL_AGENCY_TYPE = createAction<{ agencyType: AgencyType[] }>('@agencyType/GET_ALL_AGENCY_TYPE')