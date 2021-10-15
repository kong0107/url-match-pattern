const URLMatchPattern = require('./index.js');

describe('constructor', () => {
    test('load script', () => {
        expect(typeof URLMatchPattern)
        .toBe('function');
    });

    test('no argument should throw error', () => {
        expect(() => new URLMatchPattern)
        .toThrow(TypeError);
    });

    test('invalid pattern should throw error', () => {
        expect(() => new URLMatchPattern('blah blah blah'))
        .toThrow(SyntaxError);
    });

    test('special pattern "<all_urls>"', () => {
        expect((new URLMatchPattern('<all_urls>')).valueOf())
        .toEqual('<all_urls>');
    });
});

describe('static function `test(pattern)`', () => {
    test('limited supported schemes', () => {
        expect(URLMatchPattern.test('*://localhost/foo*'))
        .toBe(true);

        expect(URLMatchPattern.test('http://99.88.77.66/*/abc'))
        .toBe(true);

        expect(URLMatchPattern.test('https://foo.bar/*'))
        .toBe(true);

        expect(URLMatchPattern.test('ws://foo.bar/*'))
        .toBe(true);

        expect(URLMatchPattern.test('wss://99.88.77.66/*/abc'))
        .toBe(true);

        expect(URLMatchPattern.test('ftp://foo.bar/*'))
        .toBe(true);

        expect(URLMatchPattern.test('sftp://foo.bar/*'))
        .toBe(false);

        expect(URLMatchPattern.test('rtsp://foo.bar/*'))
        .toBe(false);
    });

    test('host is optional only for scheme `file`', () => {
        expect(URLMatchPattern.test('file://*/foo*'))
        .toBe(true);

        expect(URLMatchPattern.test('file:///blah/*'))
        .toBe(true);

        expect(URLMatchPattern.test('https:///*'))
        .toBe(false);

        expect(URLMatchPattern.test('https://*/*'))
        .toBe(true);
    });

    test('`*` as port of host is only allowed at the beginning and followed by `.`', () => {
        expect(URLMatchPattern.test('https://mozilla.*.org/'))
        .toBe(false);

        expect(URLMatchPattern.test('https://*mozilla.org/'))
        .toBe(false);

        expect(URLMatchPattern.test('https://*.mozilla.org/'))
        .toBe(true);
    });

    test('port is not allowed in pattern', () => {
        expect(URLMatchPattern.test('https://mozilla.org:80/'))
        .toBe(false);
    });

    test('path should start with `/`', () => {
        expect(URLMatchPattern.test('https://www.google.com'))
        .toBe(false);

        expect(URLMatchPattern.test('file://*'))
        .toBe(false);

        expect(URLMatchPattern.test('*://*'))
        .toBe(false);
    });

    test('path can contains multiple `*`', () => {
        expect(URLMatchPattern.test('https://www.google.com/*a.*b'))
        .toBe(true);

        expect(URLMatchPattern.test('https://www.google.com/c*.d'))
        .toBe(true);
    });
});

describe('static function `test(pattern, url)`', () => {
    test('invalid pattern -> throws error', () => {
        expect(() => URLMatchPattern.test('all_urls', 'https://goo.gl/'))
        .toThrow(SyntaxError);
    });

    test('invalid url -> false without error', () => {
        expect(URLMatchPattern.test('<all_urls>', 'xxx'))
        .toBe(false);
    });

    test('pattern <all_urls> matches all valid url', () => {
        expect(URLMatchPattern.test('<all_urls>', 'https://goo.gl/'))
        .toBe(true);

        expect(URLMatchPattern.test('<all_urls>', 'ftp://user:pass@domain.name/path?abc=3'))
        .toBe(true);
    });

    test('pattern with scheme `*` matches only http and https', () => {
        expect(URLMatchPattern.test('*://*/', 'http://domain.name/'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*/', 'https://domain.name/'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*/', 'ftp://domain.name/'))
        .toBe(false);

        expect(URLMatchPattern.test('*://*/', 'sftp://domain.name/'))
        .toBe(false);
    });

    test('pattern with host starts with `*.` also matches host without subdomain', () => {
        expect(URLMatchPattern.test('*://*.abc/', 'http://abc/'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*.abc/', 'http://x.abc/'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*.abc/', 'http://x.x.abc/'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*.abc/', 'http://x.xabc/'))
        .toBe(false);
    });

    test('port, hash, username and password in url are allowed and ignored', () => {
        // note: This is not the case if calling `toRegExp`
        expect(URLMatchPattern.test('*://*/', 'http://username:password@abc:666/#hash=hash?a'))
        .toBe(true);
    });

    test('search field in url (starting with `?` and having at least one following character) is part of path', () => {
        expect(URLMatchPattern.test('*://*/dd', 'http://abc/dd?foo=bar'))
        .toBe(false);

        expect(URLMatchPattern.test('*://*/dd?foo', 'http://abc/dd?foo=bar'))
        .toBe(false);

        expect(URLMatchPattern.test('*://*/dd?foo=', 'http://abc/dd?foo=bar'))
        .toBe(false);

        expect(URLMatchPattern.test('*://*/dd?foo=b*r', 'http://abc/dd?foo=bar'))
        .toBe(true);
    });

    test('`*` in pattern\'s path matches any printable characters but `#`', () => {
        expect(URLMatchPattern.test('*://*/A*Z', 'http://abc/APPLE/and/toyZ'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*/A*Z', 'http://abc/APPLE?search=Z'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*/A*Z', 'http://abc/A`~!@$%^&*()_+-=[]{};:\'\"\\|,./<>?Z'))
        .toBe(true);

        expect(URLMatchPattern.test('*://*/A*Z', 'http://abc/A#Z'))
        .toBe(false);
    });
});
