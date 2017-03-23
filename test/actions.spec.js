/* eslint-env mocha */
import expect from 'expect'
import proxyquire from 'proxyquire'
import { spy } from 'sinon'

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from '../src/action-types'

describe('auth actions', () => {
  let dispatch, dispatchSpy

  beforeEach(() => {
    dispatch = action => Promise.resolve(action)
    dispatchSpy = spy(dispatch)
  })

  function injectSolidWith ({currentUser, login}) {
    const currentUserSpy = spy(currentUser)
    const loginSpy = spy(login)
    const InjectedActions = proxyquire('../src/actions', {
      'solid-auth-tls': {
        currentUser: currentUserSpy,
        login: loginSpy
      }
    })
    return {currentUserSpy, loginSpy, InjectedActions}
  }

  describe('authenticate', () => {
    it('dispatches a request and success action when logging in works', () => {
      const webId = 'https://example.com/profile/card#me'
      const {loginSpy, InjectedActions} = injectSolidWith({
        login: () => Promise.resolve(webId)
      })
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
      const {loginSpy, InjectedActions} = injectSolidWith({
        login: () => Promise.reject(error)
      })
      return InjectedActions.authenticate()(dispatchSpy)
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

    it('passes a configuration object to the login function if provided', () => {
      const {loginSpy, InjectedActions} = injectSolidWith({
        login: () => Promise.resolve()
      })
      return InjectedActions.authenticate()(dispatchSpy)
        .then(() => {
          expect(loginSpy.calledWithExactly(undefined)).toBe(true)
        })
        .then(InjectedActions.authenticate({ foo: 'bar' })(dispatchSpy))
        .then(() => {
          expect(loginSpy.calledWithExactly({ foo: 'bar' })).toBe(true)
        })
    })
  })

  describe('checkAuthenticated', () => {
    it('dispatches a request and success action when checking authentication works', () => {
      const webId = 'https://example.com/profile/card#me'
      const {currentUserSpy, InjectedActions} = injectSolidWith({
        currentUser: () => Promise.resolve(webId)
      })
      return InjectedActions.checkAuthenticated()(dispatchSpy)
        .then(authWebId => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(currentUserSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_SUCCESS,
            webId
          })).toBe(true)
          expect(authWebId).toEqual(webId)
        })
    })

    it('dispatches a request and failure action when checking authentication fails', () => {
      const error = new Error('oops!')
      const {currentUserSpy, InjectedActions} = injectSolidWith({
        currentUser: () => Promise.reject(error)
      })
      return InjectedActions.checkAuthenticated()(dispatchSpy)
        .catch(err => {
          expect(dispatchSpy.calledWith({type: AUTH_REQUEST})).toBe(true)
          expect(currentUserSpy.called).toBe(true)
          expect(dispatchSpy.calledWith({
            type: AUTH_FAILURE,
            error
          }))
          expect(err).toEqual(error)
        })
    })

    it('passes a configuration object to the currentUser function if provided', () => {
      const {currentUserSpy, InjectedActions} = injectSolidWith({
        currentUser: () => Promise.resolve()
      })
      return InjectedActions.checkAuthenticated()(dispatchSpy)
        .then(() => {
          expect(currentUserSpy.calledWithExactly(undefined)).toBe(true)
        })
        .then(InjectedActions.checkAuthenticated({ foo: 'bar' })(dispatchSpy))
        .then(() => {
          expect(currentUserSpy.calledWithExactly({ foo: 'bar' })).toBe(true)
        })
    })
  })
})
