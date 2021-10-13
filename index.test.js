const URLMatchPattern = require('./index.js');

describe('construction', () => {
    test('import module', () => {
        expect(typeof URLMatchPattern)
        .toBe('function');
    });
    test('special pattern "<all_urls>"', () => {
        expect((new URLMatchPattern('<all_urls>')).valueOf())
        .toEqual({scheme: '*', host: '*', path: '/*'});
    });
    test('constructor(string)', () => {
        expect((new URLMatchPattern('ftp://*/abc')).valueOf())
        .toEqual({scheme: 'ftp', host: '*', path: '/abc'});
    });
    test('constructor(object)', () => {
        expect((new URLMatchPattern({scheme: 'ftp', host: '*', path: '/abc'})).valueOf())
        .toEqual({scheme: 'ftp', host: '*', path: '/abc'});
    });
    test('constructor(string, string, string)', () => {
        expect((new URLMatchPattern('ftp', '*', '/abc')).valueOf())
        .toEqual({scheme: 'ftp', host: '*', path: '/abc'});
    });
});
describe('construction exception', () => {
    test('invalid pattern', () => {
        expect(() => new URLMatchPattern('blah blah blah'))
        .toThrow(SyntaxError);
    });
    test('wrong argument length: 0', () => {
        expect(() => new URLMatchPattern)
        .toThrow(TypeError);
    });
    test('wrong argument length: 2', () => {
        expect(() => new URLMatchPattern('<all_urls>', undefined))
        .toThrow(TypeError);
    });
    test('wrong argument object', () => {
        expect(() => new URLMatchPattern({scheme: 'https', host: 'xxx.xx'}))
        .toThrow(TypeError);
    });
});

