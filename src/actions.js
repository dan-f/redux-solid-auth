import solid from 'solid-client'

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from './action-types'

export function authenticate () {
  return dispatch => {
    dispatch(request())
    return solid.login()
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

export function checkAuthenticated () {
  return dispatch => {
    dispatch(request())
    return solid.currentUser()
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
