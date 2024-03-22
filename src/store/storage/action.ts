import { Sites } from '@/interfaces/site'
import { createAction } from '@reduxjs/toolkit'

export const SAVE_FILE = createAction<{ urlImage:string }>('@storage/SAVE_FILE')