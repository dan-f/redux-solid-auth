import { combineReducers } from 'redux'

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from './action-types'

export function webId (state = '', action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.webId
    default:
      return state
  }
}

export function isLoading (state = true, action) {
  switch (action.type) {
    case AUTH_REQUEST:
      return true
    case AUTH_FAILURE:
    case AUTH_SUCCESS:
      return false
    default:
      return state
  }
}

export default combineReducers({webId, isLoading})
