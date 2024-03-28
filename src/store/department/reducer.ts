import { createReducer } from '@reduxjs/toolkit'
import { GET_LIST_DEPARTMENT_HANNET } from './action';
import { DepartmentStateProps } from '@/interfaces/department';

export const initialState: DepartmentStateProps = {
    dataDepartment: [],
    error: null
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_LIST_DEPARTMENT_HANNET, (state, action) => {
            state.dataDepartment=action.payload.department.dataDepartment
        })
)