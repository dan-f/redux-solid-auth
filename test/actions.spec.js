/* eslint-env mocha */
import expect from 'expect'
import proxyquire from 'proxyquire'
import { spy } from 'sinon'

import * as Actions from '../src/actions'
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from '../src/action-types'

describe('auth actions', () => {
  describe('authenticate', () => {
    function substituteSolidLogin (loginFn) {
      const loginSpy = spy(loginFn)
      const InjectedActions = proxyquire('../src/actions', {
        'solid-client': {login: loginSpy}
      })
      return {loginSpy, InjectedActions}
    }

    it('dispatches a request and success action when logging in works', () => {
      const webId = 'https://example.com/profile/card#me'
      const {loginSpy, InjectedActions} = substituteSolidLogin(() => Promise.resolve(webId))
      const dispatch = action => Promise.resolve(action)
      const dispatchSpy = spy(dispatch)
      return InjectedActions.authenticate()(dispatchSpy)
        .then(authWebId => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(loginSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_SUCCESS,
            webId
          })).toBe(true)
          expect(authWebId).toEqual(webId)
        })
    })

    it('dispatches a request and failure action when logging in fails', () => {
      const error = new Error('oops!')
      const {loginSpy, InjectedActions} = substituteSolidLogin(() => Promise.reject(error))
      const dispatch = action => Promise.resolve(action)
      const dispatchSpy = spy(dispatch)
      return InjectedActions.authenticate()(dispatchSpy)
        .then(() => {
          throw new Error('Expected promise to fail')
        })
        .catch(err => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(loginSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_FAILURE,
            error
          }))
          expect(err).toEqual(error)
        })
    })
  })

  describe('request', () => {
    it('can create a request action', () => {
      expect(Actions.request()).toEqual({type: AUTH_REQUEST})
    })
  })

  describe('success', () => {
    it('can create a success action', () => {
      const webId = 'https://example.com/profile/card#me'
      expect(Actions.success(webId)).toEqual({
        type: AUTH_SUCCESS,
        webId
      })
    })
  })

  describe('failure', () => {
    it('can create a failure action', () => {
      const error = {status: 500}
      expect(Actions.failure(error)).toEqual({
        type: AUTH_FAILURE,
        error
      })
    })
  })
})
