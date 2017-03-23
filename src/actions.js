import { login, currentUser } from 'solid-auth-tls'

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from './action-types'

export const authenticate = config => authAction(login, config)

export const checkAuthenticated = config => authAction(currentUser, config)

function authAction (authFn, config) {
  return dispatch => {
    dispatch(request())
    return authFn(config)
      .then(webId => {
        dispatch(success(webId))
        return webId
      })
      .catch(error => {
        dispatch(failure(error))
        throw error
      })
  }
}

function request () {
  return { type: AUTH_REQUEST }
}

function success (webId) {
  return {
    type: AUTH_SUCCESS,
    webId
  }
}

function failure (error) {
  return {
    type: AUTH_FAILURE,
    error
  }
}
