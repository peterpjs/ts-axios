import cookie from '../../src/helpers/cookie'

describe('helpers:cookes', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })
  test('should be null if cookie name is not exist ', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('bar')).toBeNull()
  })
})
