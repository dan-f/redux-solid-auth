/* eslint-env mocha */
import expect from 'expect'

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE
} from '../src/action-types'
import { webId, isLoading } from '../src/reducers'

describe('auth reducers', () => {
  describe('webId', () => {
    it('returns the webId on success', () => {
      const id = 'https://example.com/profile/card#me'
      const action = {
        type: AUTH_SUCCESS,
        webId: id
      }
      expect(webId('', action)).toEqual(id)
    })

    it('returns the default state for an unrecognized action', () => {
      const action = {
        type: 'UNRECOGNIZED_ACTION_TYPE',
        webId: 'foo'
      }
      expect(webId('currentWebId', action)).toEqual('currentWebId')
    })
  })

  describe('isLoading', () => {
    it('returns true when an auth request has been dispatched', () => {
      expect(isLoading(false, {type: AUTH_REQUEST})).toBe(true)
    })

    it('returns false when an auth success has been dispatched', () => {
      expect(isLoading(true, {type: AUTH_SUCCESS})).toBe(false)
    })

    it('returns false when an auth failure has been dispatched', () => {
      expect(isLoading(true, {type: AUTH_FAILURE})).toBe(false)
    })

    it('returns the default state for an unrecognized action', () => {
      expect(isLoading(true, {type: 'UNRECOGNIZED_ACTION_TYPE'})).toBe(true)
      expect(isLoading(false, {type: 'UNRECOGNIZED_ACTION_TYPE'})).toBe(false)
    })
  })
})
