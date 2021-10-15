# URL Match Pattern

a JavaScript package handles match patterns described in browser extension

See articles on [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) and [Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/match_patterns/).


## Usage

```javascript
/// check if a string is a valid URL match pattern
URLMatchPattern.test('*://github.com/'); // true

/// check if a string matches a URL match pattern
URLMatchPattern.test('*://*.google.com/*', 'https://google.com/search'); // true

/// get a RegExp object which represents a URL match pattern
const regexp = URLMatchPattern.toRegExp('*://*.name/');
regexp.test('https://domainA.name/'); // true
regexp.test('https://domainB.name/'); // true

/// or create an object with `test` method
const pattern = new URLMatchPattern('*://*.name/');
pattern.test('https://domainA.name/'); // true
pattern.test('https://domainB.name/'); // true
```


### note

```javascript
/// method `test` (both static and instance) allows url with port and hash
URLMatchPattern.test('*://*/', 'http://username:password@abc:666/#hash=hash?a'); // true

const pattern = new URLMatchPattern('*://*/');
pattern.test('http://username:password@abc:666/#hash=hash?a'); // true

/// converting to RegExp object would lose that compatibility for current version
const regexp = URLMatchPattern.toRegExp('*://*/');
regexp.test('http://abc/'); // true
regexp.test('http://abc:80/'); // false
regexp.test('http://abc/#foo'); // false
```


## Compatibility

Either browser supports `http`, `https`, and `ftp`.

scheme          | this project | Firefox 55+ | Chrome 91+ | Edge, Opera | Safari
----------------|--------------|-------------|------------|-------------|------
`ws`, `wss`     | Yes          | Yes         | No         | No          | No
`urn`           | No           | No          | Yes        | No          | No
`data`          | No           | partial     | No         | No          | No
`file`          | Yes          | Yes         | Yes        | Yes         | No


## Defects of URL Match Pattern

* not well-defined
* no escaping way for `*` in path
* `*` in path also matches `/` and `?`, which usually have special meaning.
