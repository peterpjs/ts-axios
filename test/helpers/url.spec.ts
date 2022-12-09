import { bulidURL, combineURL, isAbsoluteURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(bulidURL('/foo')).toBe('/foo')
    })

    test('should support  params', () => {
      expect(bulidURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(bulidURL('/foo', { foo: 'bar', baz: null })).toBe('/foo?foo=bar')
    })
    test('should ignore if the only param value is null', () => {
      expect(bulidURL('/foo', { baz: null })).toBe('/foo')
    })

    test('should support object params ', () => {
      expect(bulidURL('/foo', { foo: { bar: 'baz' } })).toBe(
        '/foo?foo=' + encodeURI('{"bar":"baz"}')
      )
    })

    test('should support date params ', () => {
      expect(bulidURL('/foo', { foo: ['bar', 'baz'] })).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char  params ', () => {
      expect(bulidURL('/foo', { foo: '@:$, ' })).toBe('/foo?foo=@:$,+')
    })

    test('should support existing  params ', () => {
      expect(bulidURL('/foo?foo=bar', { bar: 'baz' })).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark ', () => {
      expect(bulidURL('/foo?foo=bar#hash', { query: 'baz' })).toBe('/foo?foo=bar&query=baz')
    })

    test('should use serializer if provided ', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(bulidURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams ', () => {
      expect(bulidURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })
    test('should return false if URL is prelative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combineURL ', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })
    test('should reomve duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })
    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })
    test('should not insert slash when relative url missing/empty ', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })
    test('should allow a single slash for relative url ', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin ', () => {
    test('should detect same origin ', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin ', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
