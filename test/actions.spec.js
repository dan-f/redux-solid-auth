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

    it('dispatches a request and success action when logging in works', (done) => {
      const webId = 'https://example.com/profile/card#me'
      const {loginSpy, InjectedActions} = substituteSolidLogin(() => Promise.resolve(webId))
      const dispatch = action => Promise.resolve(action)
      const dispatchSpy = spy(dispatch)
      InjectedActions.authenticate()(dispatchSpy)
        .then(() => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(loginSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_SUCCESS,
            webId
          })).toBe(true)
          done()
        })
    })

    it('dispatches a request and failure action when logging in fails', (done) => {
      const {loginSpy, InjectedActions} = substituteSolidLogin(() => Promise.reject(new Error('oops!')))
      const dispatch = action => Promise.resolve(action)
      const dispatchSpy = spy(dispatch)
      InjectedActions.authenticate()(dispatchSpy)
        .then(error => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(loginSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_FAILURE,
            error
          }))
          done()
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
