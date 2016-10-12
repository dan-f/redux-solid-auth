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
      .then(webId => dispatch(success(webId)))
      .catch(error => dispatch(failure(error)))
  }
}

export function request () {
  return { type: AUTH_REQUEST }
}

export function success (webId) {
  return {
    type: AUTH_SUCCESS,
    webId
  }
}

export function failure (error) {
  return {
    type: AUTH_FAILURE,
    error
  }
}
