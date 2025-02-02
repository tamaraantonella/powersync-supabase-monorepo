import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchLogin, fetchUserInfo, fetchLogout } from '@web/api/user'
import type { FormInitialValues } from '@web/pages/login'
import { i18nResources } from '@web/locales'

export const authLoginThunk = createAsyncThunk(
  'auth/login',
  async (loginPayload: FormInitialValues) => {
    const response = await fetchLogin(loginPayload)
    const { token } = response.result
    window.localStorage.setItem('token', token)
    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get('redirect')
    if (redirect) {
      window.location.href = `${import.meta.env.BASE_URL}${redirect.slice(1)}`
    } else {
      window.location.href = `${import.meta.env.BASE_URL}`
    }
    return token
  }
)

export const authLogoutThunk = createAsyncThunk('auth/logout', async () => {
  const response = await fetchLogout()
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('theme')
  window.localStorage.removeItem('lng')
  window.location.href = `${import.meta.env.BASE_URL}login`
  return response
})

export const userInfoThunk = createAsyncThunk('userinfo', async () => {
  const response = await fetchUserInfo()
  return response.result
})

const CONSTANT_USERINFO = {
  hasFetchedUserInfo: false,
  userId: '',
  username: '',
  realName: '',
  avatar: '',
  desc: '',
  password: '',
}

const token = window.localStorage.getItem('token')
const lng = window.localStorage.getItem('lng') ?? ''
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    /**
     * authLoginThunk
     */
    token,
    hasFetchedToken: !!token,

    // ---------

    /**
     * userInfoThunk
     */
    ...CONSTANT_USERINFO,
    // ignore illegality
    lng: Object.keys(i18nResources).includes(lng) ? lng : 'es-ES',
  },
  reducers: {
    changeLanguage(state, action) {
      state.lng = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authLoginThunk.fulfilled, (state, action) => {
      state.token = action.payload
      state.hasFetchedToken = true
    })
    builder.addCase(authLogoutThunk.fulfilled, (state) => {
      return {
        ...state,
        token: '',
        hasFetchedToken: false,
        ...CONSTANT_USERINFO,
      }
    })
    builder.addCase(userInfoThunk.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
      hasFetchedUserInfo: true,
    }))
  },
})
