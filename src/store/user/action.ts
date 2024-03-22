
import { User } from '@/interfaces/user'
import { createAction } from '@reduxjs/toolkit'

export const SAVE_USER = createAction<{ user: User|null }>('@user/SAVE_USER')