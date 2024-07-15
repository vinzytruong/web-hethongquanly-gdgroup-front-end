import { createReducer } from '@reduxjs/toolkit'
import { ADD_AUTHOR, DELETE_AUTHOR, GET_ALL, UPDATE_AUTHOR } from './action'
import { Author } from '@/interfaces/author';

export const initialState: Author[] = []
export default createReducer(initialState, (builder) =>
    builder
        .addCase(GET_ALL, (state, action) => {
            return action.payload.author;
        })
        .addCase(ADD_AUTHOR, (state, action) => {
            state.push(action.payload.author)
        })
        .addCase(UPDATE_AUTHOR, (state, action) => {
            const updatedItems = state.map(item => {
                if (item.tacGiaID === action.payload.id) {
                    return { ...item, ...action.payload.author   };
                }
                return item;
            });
            return updatedItems
        })
        .addCase(DELETE_AUTHOR, (state, action) => {
            return state.filter(item => item.tacGiaID !== action.payload.id)
        })
)