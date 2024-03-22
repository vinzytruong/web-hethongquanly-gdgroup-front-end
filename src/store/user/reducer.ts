import { User } from '@/interfaces/user'
import { createReducer } from '@reduxjs/toolkit'
import { SAVE_USER } from './action'


export const initialState: User = {
    uid:'',
    email:'',
    displayName:'',
    photoURL:'',
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(SAVE_USER, (state, action) => {
            state.uid=action.payload.user?.uid
            state.email=action.payload.user?.email
            state.displayName=action.payload.user?.displayName
            state.photoURL=action.payload.user?.photoURL
        })
)