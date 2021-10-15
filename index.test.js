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
});

describe('main', () => {
    test('static test a valid pattern: "<all_urls>"', () => {
        expect(URLMatchPattern.test('<all_urls>'))
        .toBe(true);
    });
    test('static test a valid pattern: "*://localhost/foo*"', () => {
        expect(URLMatchPattern.test('*://localhost/foo*'))
        .toBe(true);
    });
    test('static test a valid pattern: "ftp://*.edu/post/ad?=*"', () => {
        expect(URLMatchPattern.test('ftp://*.edu/post/ad?=*'))
        .toBe(true);
    });
    test('static test a valid pattern: "ws://99.88.77.66/*/abc"', () => {
        expect(URLMatchPattern.test('ws://99.88.77.66/*/abc'))
        .toBe(true);
    });
    // test('static test a valid pattern: "file:///blah/*"', () => {
    //     expect(URLMatchPattern.test('file:///blah/*'))
    //     .toBe(true);
    // });
    test('static test an invalid pattern: "https://www.google.com"', () => {
        expect(URLMatchPattern.test('https://www.google.com'))
        .toBe(false);
    });
    test('static test an invalid pattern: "https://mozilla.*.org/"', () => {
        expect(URLMatchPattern.test('https://mozilla.*.org/'))
        .toBe(false);
    });
    test('static test an invalid pattern: "https://mozilla.org:80/"', () => {
        expect(URLMatchPattern.test('https://mozilla.org:80/'))
        .toBe(false);
    });
    test('static test an invalid pattern: "file://*"', () => {
        expect(URLMatchPattern.test('file://*'))
        .toBe(false);
    });
    test('static test an invalid pattern: "*://*"', () => {
        expect(URLMatchPattern.test('*://*'))
        .toBe(false);
    });
});
