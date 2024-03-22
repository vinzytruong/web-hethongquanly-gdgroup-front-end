import { createReducer } from '@reduxjs/toolkit'
import { Sites } from '@/interfaces/site'
import { SAVE_FILE } from './action'



interface Image {
    urlImage:string
}
export const initialState: Image ={
   urlImage:''
}
export default createReducer(initialState, (builder) =>
    builder
        .addCase(SAVE_FILE, (state, action) => {
            state.urlImage = action.payload.urlImage
        })

)